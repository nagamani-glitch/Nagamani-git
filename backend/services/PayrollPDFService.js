

import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class PayrollPDFService {
  static async generatePayslipPDF(payslipData) {
    return new Promise((resolve, reject) => {
      try {
        // Ensure directories exist
        const uploadsDir = path.join(__dirname, '../uploads');
        const payslipsDir = path.join(uploadsDir, 'payslips');
        fs.mkdirSync(payslipsDir, { recursive: true });

        // Create a unique filename for the PDF
        const fileName = `payslip_${payslipData.empId}_${payslipData.month}_${payslipData.year}_${Date.now()}.pdf`;
        const filePath = path.join(payslipsDir, fileName);

        // Create a new PDF document
        const doc = new PDFDocument({ size: 'A4', margin: 40 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Helper function to format currency
        const formatCurrency = (amount) => `Rs ${parseFloat(amount).toFixed(2)}`;

        // Extract values
        const { empId, empName, department, designation, bankDetails, basicPay, allowances, deductions, month, year, pfNo, panNo, dateOfJoining } = payslipData;
        
        // Calculate working days and LOP days
        const totalDaysInMonth = new Date(year, month, 0).getDate();
        const workingDays = payslipData.workingDays || totalDaysInMonth;
        const lopDays = payslipData.lopDays || 0;
        const effectiveWorkingDays = workingDays - lopDays;
        
        // Calculate per day salary
        const perDaySalary = parseFloat(basicPay) / workingDays;
        
        // Calculate attendance ratio
        const attendanceRatio = effectiveWorkingDays / workingDays;

        // Helper function to draw a table cell
        const drawTableCell = (x, y, width, height, text, options = {}) => {
          const defaultOptions = {
            fontSize: 10,
            fontColor: '#333333',
            font: 'Helvetica',
            align: 'left',
            valign: 'top',
            padding: 5,
            fillColor: null,
            borderColor: '#cccccc',
            drawBorder: true
          };
          
          const opts = { ...defaultOptions, ...options };
          
          // Draw cell background if specified
          if (opts.fillColor) {
            doc.fillColor(opts.fillColor).rect(x, y, width, height).fill();
          }
          
          // Draw cell border
          if (opts.drawBorder) {
            doc.strokeColor(opts.borderColor).lineWidth(0.5)
              .rect(x, y, width, height).stroke();
          }
          
          // Draw text
          doc.font(opts.font === 'Helvetica-Bold' ? 'Helvetica-Bold' : 'Helvetica')
            .fontSize(opts.fontSize)
            .fillColor(opts.fontColor);
          
          const textX = x + opts.padding;
          const textY = y + opts.padding;
          const textWidth = width - (2 * opts.padding);
          
          doc.text(text || '', textX, textY, {
            width: textWidth,
            align: opts.align
          });
        };

        /** -------------------- HEADER -------------------- **/
        // Company name and address first, before any tab/box
        doc.fontSize(20).fillColor('#f70505').font('Helvetica-Bold')
          .text('DB4Cloud Technologies Pvt Ltd', { align: 'center' });

        doc.moveDown(0.5)
          .fontSize(10).fillColor('#333333').text('#24-361, Satyanarayana puram, KongaReddy Palli, Chittor Andhra Pradesh - 517001', { align: 'center' });

        doc.moveDown(0.8)
          .fontSize(14).fillColor('#555555').font('Helvetica-Bold')
          .text(`Payslip for the month of ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`, { align: 'center' });

        doc.moveDown(2);
        
        // Now draw the header box
        doc.rect(40, doc.y, doc.page.width - 80, 30).fillAndStroke('#e6e6e6', '#cccccc');
        doc.fontSize(12).fillColor('#f70505').font('Helvetica-Bold')
          .text('EMPLOYEE DETAILS', 50, doc.y - 25, { align: 'left' });
        
        doc.moveDown(0.5);
        
        // Employee details table
        const startY = doc.y;
        const pageWidth = doc.page.width - 80;
        const colWidth = pageWidth / 2;
        
        // Define employee details in a structured format for the table
        
        const employeeDetails = [
          [
            { label: 'Employee ID', value: empId },
            { label: 'Bank Name', value: bankDetails?.bankName }
          ],
          [
            { label: 'Employee Name', value: empName },
            { label: 'Bank A/C No.', value: bankDetails?.accountNo }
          ],
          [
            { label: 'Date of Joining', value: dateOfJoining ? new Date(dateOfJoining).toLocaleDateString() : 'N/A' },
            
            { label: 'PAN Number', value: panNo }
          ],
          [
            { label: 'Department', value: department },
            { label: 'Working Days', value: workingDays.toString() },
          ],
          [
            { label: 'Designation', value: designation },
            
            { label: 'LOP Days', value: lopDays.toString() },
          ],
          [
            { label: 'PF Number', value: pfNo },
            
            { label: 'Payable Days', value: effectiveWorkingDays.toString() }
          ]
        ];
        
        // Draw employee details table
        let currentY = startY;
        const rowHeight = 25;
        
        employeeDetails.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            const x = 40 + (colIndex * colWidth);
            
            // Draw label cell
            drawTableCell(
              x, currentY, colWidth / 2, rowHeight,
              cell.label + ':',
              { 
                font: 'Helvetica-Bold',
                fillColor: '#f5f5f5'
              }
            );
            
            // Draw value cell
            drawTableCell(
              x + (colWidth / 2), currentY, colWidth / 2, rowHeight,
              cell.value || 'N/A',
              { fillColor: '#ffffff' }
            );
          });
          
          currentY += rowHeight;
        });
        
        doc.y = currentY + 20;

        /** -------------------- EARNINGS & DEDUCTIONS -------------------- **/
        let earningsY = doc.y;
        let totalEarnings = 0, totalDeductions = 0;
        let totalActualEarnings = 0;

        // Section headers with table-like styling
        doc.rect(40, earningsY, pageWidth / 2, 30).fillAndStroke('#e6e6e6', '#cccccc');
        doc.rect(40 + (pageWidth / 2), earningsY, pageWidth / 2, 30).fillAndStroke('#e6e6e6', '#cccccc');
        
        doc.fontSize(12).fillColor('#f70505').font('Helvetica-Bold')
          .text('EARNINGS', 50, earningsY + 10);
        doc.text('DEDUCTIONS', 50 + (pageWidth / 2), earningsY + 10);

        earningsY += 30;

        // Process earnings - Only include allowances, not the basic pay separately
        // This aligns with the frontend logic where Total Pay is distributed across allowances
        const earnings = [];
        
        // Process allowances
        if (allowances && allowances.length > 0) {
          allowances.forEach(allowance => {
            // Calculate actual amount (before attendance adjustment)
            const actualAmount = parseFloat(basicPay) * (parseFloat(allowance.percentage) / 100);
            // Calculate earned amount (after attendance adjustment)
            const earnedAmount = parseFloat(allowance.amount);
            
            earnings.push({ 
              name: allowance.name, 
              actualAmount: actualAmount,
              earnedAmount: earnedAmount,
              percentage: allowance.percentage
            });
            
            // Add to total earnings
            totalActualEarnings += actualAmount;
            totalEarnings += earnedAmount;
          });
        }
        
        // Use deductions without any adjustment
        const deductionsList = deductions || [];

        const maxRows = Math.max(earnings.length, deductionsList.length);
        
        // Draw column headers for earnings
        drawTableCell(
          40, earningsY, 
          (pageWidth / 2) * 0.4, rowHeight,
          'Component',
          { font: 'Helvetica-Bold', fillColor: '#f0f0f0' }
        );
        
        drawTableCell(
          40 + ((pageWidth / 2) * 0.4), earningsY, 
          (pageWidth / 2) * 0.3, rowHeight,
          'Actual',
          { font: 'Helvetica-Bold', fillColor: '#f0f0f0', align: 'right' }
        );
        
        drawTableCell(
          40 + ((pageWidth / 2) * 0.7), earningsY, 
          (pageWidth / 2) * 0.3, rowHeight,
          'Earned',
          { font: 'Helvetica-Bold', fillColor: '#f0f0f0', align: 'right' }
        );
        
        // Draw column headers for deductions
        drawTableCell(
          40 + (pageWidth / 2), earningsY, 
          (pageWidth / 2) * 0.6, rowHeight,
          'Deduction',
          { font: 'Helvetica-Bold', fillColor: '#f0f0f0' }
        );
        
        drawTableCell(
          40 + (pageWidth / 2) + ((pageWidth / 2) * 0.6), earningsY, 
          (pageWidth / 2) * 0.4, rowHeight,
          'Amount',
          { font: 'Helvetica-Bold', fillColor: '#f0f0f0', align: 'right' }
        );
        
        earningsY += rowHeight;
        
        // Draw earnings and deductions in table format
        for (let i = 0; i < maxRows; i++) {
          // Earnings column
          if (i < earnings.length) {
            // Component name
            drawTableCell(
              40, earningsY + (i * rowHeight), 
              (pageWidth / 2) * 0.4, rowHeight,
              earnings[i].name,
              { font: 'Helvetica-Bold' }
            );
            
            // Actual amount
            drawTableCell(
              40 + ((pageWidth / 2) * 0.4), earningsY + (i * rowHeight), 
              (pageWidth / 2) * 0.3, rowHeight,
              formatCurrency(earnings[i].actualAmount),
              { align: 'right', fontColor: '#555555' }
            );
            
            // Earned amount
            drawTableCell(
              40 + ((pageWidth / 2) * 0.7), earningsY + (i * rowHeight), 
              (pageWidth / 2) * 0.3, rowHeight,
              formatCurrency(earnings[i].earnedAmount),
              { align: 'right', font: 'Helvetica-Bold' }
            );
          } else {
            // Empty cells to maintain table structure
            drawTableCell(
              40, earningsY + (i * rowHeight), 
              (pageWidth / 2) * 0.4, rowHeight, 
              '',
              { fillColor: '#ffffff' }
            );
            
            drawTableCell(
              40 + ((pageWidth / 2) * 0.4), earningsY + (i * rowHeight), 
              (pageWidth / 2) * 0.3, rowHeight, 
              '',
              { fillColor: '#ffffff' }
            );
            
            drawTableCell(
              40 + ((pageWidth / 2) * 0.7), earningsY + (i * rowHeight), 
              (pageWidth / 2) * 0.3, rowHeight, 
              '',
              { fillColor: '#ffffff' }
            );
          }
          
          // Deductions column
          if (i < deductionsList.length) {
            drawTableCell(
              40 + (pageWidth / 2), earningsY + (i * rowHeight), 
              (pageWidth / 2) * 0.6, rowHeight,
              deductionsList[i].name,
              { font: 'Helvetica-Bold' }
            );
            
            drawTableCell(
              40 + (pageWidth / 2) + ((pageWidth / 2) * 0.6), earningsY + (i * rowHeight), 
              (pageWidth / 2) * 0.4, rowHeight,
              formatCurrency(deductionsList[i].amount),
              { align: 'right' }
            );
            
            totalDeductions += parseFloat(deductionsList[i].amount);
          } else {
            // Empty cells to maintain table structure
            drawTableCell(
              40 + (pageWidth / 2), earningsY + (i * rowHeight), 
              (pageWidth / 2) * 0.6, rowHeight, 
              '',
              { fillColor: '#ffffff' }
            );
            
            drawTableCell(
              40 + (pageWidth / 2) + ((pageWidth / 2) * 0.6), earningsY + (i * rowHeight), 
              (pageWidth / 2) * 0.4, rowHeight, 
              '',
              { fillColor: '#ffffff' }
            );
          }
        }

        const totalRowY = earningsY + (maxRows * rowHeight);

        /** -------------------- TOTALS -------------------- **/
        // Total Earnings - Actual
        drawTableCell(
          40, totalRowY, 
          (pageWidth / 2) * 0.4, rowHeight,
          'Total Earnings:',
          { font: 'Helvetica-Bold', fillColor: '#f0f0f0', fontColor: '#f70505' }
        );
        
        // Total Earnings - Actual
        drawTableCell(
          40 + ((pageWidth / 2) * 0.4), totalRowY, 
          (pageWidth / 2) * 0.3, rowHeight,
          formatCurrency(totalActualEarnings),
          { align: 'right', fillColor: '#f0f0f0', fontColor: '#555555' }
        );
        
        // Total Earnings - Earned
        drawTableCell(
          40 + ((pageWidth / 2) * 0.7), totalRowY, 
          (pageWidth / 2) * 0.3, rowHeight,
          formatCurrency(totalEarnings),
          { align: 'right', fillColor: '#f0f0f0', fontColor: '#f70505', font: 'Helvetica-Bold' }
        );
        
        // Total Deductions
        drawTableCell(
          40 + (pageWidth / 2), totalRowY, 
          (pageWidth / 2) * 0.6, rowHeight,
          'Total Deductions:',
          { font: 'Helvetica-Bold', fillColor: '#f0f0f0', fontColor: '#f70505' }
        );
        
        drawTableCell(
          40 + (pageWidth / 2) + ((pageWidth / 2) * 0.6), totalRowY, 
          (pageWidth / 2) * 0.4, rowHeight,
          formatCurrency(totalDeductions),
          { align: 'right', fillColor: '#f0f0f0', fontColor: '#f70505', font: 'Helvetica-Bold' }
        );

       


        /** -------------------- NET SALARY -------------------- **/
// Use the netSalary value passed from the controller instead of recalculating it
const netSalary = payslipData.netSalary || (totalEarnings - totalDeductions);
const netSalaryY = totalRowY + rowHeight + 20;

// Net salary box with highlight
doc.rect(40, netSalaryY, pageWidth, rowHeight + 10)
  .fillAndStroke('#f0f0f0', '#cccccc');

doc.fontSize(14).fillColor('#f70505').font('Helvetica-Bold')
  .text('NET SALARY:', 50, netSalaryY + 10);

doc.fontSize(14).fillColor('#f70505').font('Helvetica-Bold')
  .text(formatCurrency(netSalary), 180, netSalaryY + 10);


        /** -------------------- DISCLAIMER -------------------- **/
        // Reduced the gap between net salary and disclaimer
        
        const disclaimerY = netSalaryY + rowHeight + 30;
        
        doc.rect(40, disclaimerY, pageWidth, 50)
          .fillAndStroke('#f9f9f9', '#cccccc');
        
        doc.fontSize(9).fillColor('#555555').font('Helvetica-Bold')
          .text('** Computer generated pay slip & does not require any signature & seal. **', 
                40, disclaimerY + 15, { align: 'center' });
        
        doc.fontSize(9).fillColor('#555555').font('Helvetica')
          .text('** If you received this in error please destroy it along with any copies and notify the sender immediately **', 
                40, disclaimerY + 30, { align: 'center' });

        // Add a note about the calculation method
        // const calculationNoteY = disclaimerY + 60;
        // doc.fontSize(8).fillColor('#777777')
        //   .text('Note: "Actual" shows full entitlement before attendance adjustment. "Earned" shows amount after attendance adjustment.', 
        //         40, calculationNoteY, { align: 'center' });

        doc.end();
        stream.on('finish', () => resolve(filePath));
        stream.on('error', (err) => reject(err));
      } catch (error) {
        reject(error);
      }
    });
  }
}
