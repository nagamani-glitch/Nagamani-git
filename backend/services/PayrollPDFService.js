// import fs from 'fs';
// import path from 'path';
// import PDFDocument from 'pdfkit';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export class PayrollPDFService {
//   static async generatePayslipPDF(payslipData) {
//     return new Promise((resolve, reject) => {
//       try {
//         // Ensure directories exist
//         const uploadsDir = path.join(__dirname, '../uploads');
//         const payslipsDir = path.join(uploadsDir, 'payslips');
//         fs.mkdirSync(payslipsDir, { recursive: true });

//         // Create a unique filename for the PDF
//         const fileName = `payslip_${payslipData.empId}_${payslipData.month}_${payslipData.year}_${Date.now()}.pdf`;
//         const filePath = path.join(payslipsDir, fileName);

//         // Create a new PDF document
//         const doc = new PDFDocument({ size: 'A4', margin: 40 });
//         const stream = fs.createWriteStream(filePath);
//         doc.pipe(stream);

//         // Helper function to format currency
//         const formatCurrency = (amount) => `Rs ${parseFloat(amount).toFixed(2)}`;

//         // Extract values
//         const { empId, empName, department, designation, bankDetails, basicPay, allowances, deductions, month, year, pfNo, panNo } = payslipData;
        
//         // Calculate working days and LOP days
//         const totalDaysInMonth = new Date(year, month, 0).getDate();
//         const workingDays = payslipData.workingDays || totalDaysInMonth;
//         const lopDays = payslipData.lopDays || 0;
//         const effectiveWorkingDays = workingDays - lopDays;
        
//         // Calculate per day salary
//         const perDaySalary = parseFloat(basicPay) / workingDays;
        
//         // Calculate salary after LOP deduction
//         const salaryAfterLOP = parseFloat(basicPay) - (perDaySalary * lopDays);

//         /** -------------------- HEADER -------------------- **/
//         doc.fontSize(20).fillColor('#f70505').font('Helvetica-Bold')
//           .text('DB4Cloud Technologies Pvt Ltd', { align: 'center' });

//         doc.moveDown(0.5)
//           .fontSize(10).fillColor('#333333').text('#24-361, Satyanarayana puram, KongaReddy Palli, Chittor Andhra Pradesh - 517001', { align: 'center' });

//         doc.moveDown(0.8)
//           .fontSize(12).fillColor('#555555')
//           .text(`Payslip for the month of ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`, { align: 'center' });

//         doc.moveDown(1);

//         /** -------------------- EMPLOYEE DETAILS SECTION -------------------- **/
//         // Section header
//         doc.fontSize(12).fillColor('#f70505').font('Helvetica-Bold')
//           .text('EMPLOYEE DETAILS', { align: 'left' });
        
//         doc.moveDown(0.5);
        
//         // Define columns and layout
//         const leftColumnX = 50;
//         const rightColumnX = 320;
//         const labelWidth = 100;
//         let leftY = doc.y;
//         let rightY = doc.y;
        
//         // Helper function to add a detail row
//         const addDetailRow = (label, value, x, y) => {
//           doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//              .text(label, x, y);
//           doc.font('Helvetica').text(value || 'N/A', x + labelWidth, y);
//           return y + 20; // Return the next Y position
//         };
        
//         // Distribute details evenly - 6 items on left, 5 items on right
        
//         // Left column - First 6 details
//         leftY = addDetailRow('Employee ID:', empId, leftColumnX, leftY);
//         leftY = addDetailRow('Employee Name:', empName, leftColumnX, leftY);
//         leftY = addDetailRow('Department:', department, leftColumnX, leftY);
//         leftY = addDetailRow('Designation:', designation, leftColumnX, leftY);
//         leftY = addDetailRow('PF Number:', pfNo, leftColumnX, leftY);
//         leftY = addDetailRow('Working Days:', workingDays.toString(), leftColumnX, leftY);
        
        
//         // Right column - Next 5 details
        
//         rightY = addDetailRow('Bank Name:', bankDetails?.bankName, rightColumnX, rightY);
//         rightY = addDetailRow('Bank A/C No.:', bankDetails?.accountNo, rightColumnX, rightY);
//         rightY = addDetailRow('PAN Number:', panNo, rightColumnX, rightY);
//         rightY = addDetailRow('LOP Days:', lopDays.toString(), rightColumnX, rightY);
//         rightY = addDetailRow('Payable Days:', effectiveWorkingDays.toString(), rightColumnX, rightY);
        
//         // Set the document Y position to the maximum of left and right columns
//         doc.y = Math.max(leftY, rightY) + 10;

//         /** -------------------- EARNINGS & DEDUCTIONS -------------------- **/
//         let earningsY = doc.y;
//         let totalEarnings = 0, totalDeductions = 0;

//         // Section headers
//         doc.fontSize(12).fillColor('#f70505').font('Helvetica-Bold')
//           .text('EARNINGS', leftColumnX, earningsY);
//         doc.text('DEDUCTIONS', rightColumnX, earningsY);

//         earningsY += 20;

//         // Process earnings - Basic pay with LOP adjustment, but allowances without adjustment
//         const earnings = [{ name: 'Basic Pay', amount: salaryAfterLOP }];
        
//         // Process allowances without LOP adjustment (based on actual basic pay)
//         if (allowances && allowances.length > 0) {
//           allowances.forEach(allowance => {
//             // Use the original allowance amount without adjustment
//             earnings.push({ 
//               name: allowance.name, 
//               amount: parseFloat(allowance.amount)
//             });
//           });
//         }
        
//         // Use deductions without any adjustment
//         const deductionsList = deductions || [];

//         const maxRows = Math.max(earnings.length, deductionsList.length);

//         // Fixed column widths for earnings and deductions
//         const earningsLabelWidth = 120;
//         const earningsValueWidth = 80;
//         const deductionsLabelWidth = 120;
//         const deductionsValueWidth = 80;

//         for (let i = 0; i < maxRows; i++) {
//           if (earnings[i]) {
//             doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//               .text(earnings[i].name + ':', leftColumnX, earningsY + (i * 20), { width: earningsLabelWidth });
//             doc.font('Helvetica')
//               .text(formatCurrency(earnings[i].amount), leftColumnX + earningsLabelWidth, earningsY + (i * 20), { 
//                 width: earningsValueWidth, 
//                 align: 'right' 
//               });
//             totalEarnings += parseFloat(earnings[i].amount);
//           }
          
//           if (deductionsList[i]) {
//             doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//               .text(deductionsList[i].name + ':', rightColumnX, earningsY + (i * 20), { width: deductionsLabelWidth });
//             doc.font('Helvetica')
//               .text(formatCurrency(deductionsList[i].amount), rightColumnX + deductionsLabelWidth, earningsY + (i * 20), { 
//                 width: deductionsValueWidth, 
//                 align: 'right' 
//               });
//             totalDeductions += parseFloat(deductionsList[i].amount);
//           }
//         }

//         earningsY += maxRows * 20 + 10;

//         /** -------------------- TOTALS -------------------- **/
//         doc.fontSize(11).fillColor('#f70505').font('Helvetica-Bold')
//           .text('Total Earnings:', leftColumnX, earningsY, { width: earningsLabelWidth });
//         doc.text(formatCurrency(totalEarnings), leftColumnX + earningsLabelWidth, earningsY, { 
//           width: earningsValueWidth, 
//           align: 'right' 
//         });
        
//         doc.fontSize(11).fillColor('#f70505').font('Helvetica-Bold')
//           .text('Total Deductions:', rightColumnX, earningsY, { width: deductionsLabelWidth });
//         doc.text(formatCurrency(totalDeductions), rightColumnX + deductionsLabelWidth, earningsY, { 
//           width: deductionsValueWidth, 
//           align: 'right' 
//         });

//         /** -------------------- NET SALARY -------------------- **/
//         const netSalary = totalEarnings - totalDeductions;

//         doc.moveDown(2);
//         doc.fontSize(14).fillColor('#f70505').font('Helvetica-Bold')
//           .text('NET SALARY:', leftColumnX, doc.y, { width: earningsLabelWidth });
//         doc.text(formatCurrency(netSalary), leftColumnX + earningsLabelWidth, doc.y, { 
//           width: earningsValueWidth + 50, 
//           align: 'left' 
//         });

//         doc.end();
//         stream.on('finish', () => resolve(filePath));
//         stream.on('error', (err) => reject(err));
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }
// }


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
        
        // Calculate salary after LOP deduction
        const salaryAfterLOP = parseFloat(basicPay) - (perDaySalary * lopDays);

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

        doc.moveDown(1);
        
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
        // Added Date of Joining to the employee details
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
            { label: 'Department', value: department },
            { label: 'PAN Number', value: panNo }
          ],
          [
            { label: 'Designation', value: designation },
            { label: 'LOP Days', value: lopDays.toString() }
          ],
          [
            { label: 'PF Number', value: pfNo },
            { label: 'Payable Days', value: effectiveWorkingDays.toString() }
          ],
          [
            { label: 'Working Days', value: workingDays.toString() },
            { label: 'Date of Joining', value: dateOfJoining ? new Date(dateOfJoining).toLocaleDateString() : 'N/A' }
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

        // Section headers with table-like styling
        doc.rect(40, earningsY, pageWidth / 2, 30).fillAndStroke('#e6e6e6', '#cccccc');
        doc.rect(40 + (pageWidth / 2), earningsY, pageWidth / 2, 30).fillAndStroke('#e6e6e6', '#cccccc');
        
        doc.fontSize(12).fillColor('#f70505').font('Helvetica-Bold')
          .text('EARNINGS', 50, earningsY + 10);
        doc.text('DEDUCTIONS', 50 + (pageWidth / 2), earningsY + 10);

        earningsY += 30;

        // Process earnings - Basic pay with LOP adjustment, but allowances without adjustment
        const earnings = [{ name: 'Basic Pay', amount: salaryAfterLOP }];
        
        // Process allowances without LOP adjustment (based on actual basic pay)
        if (allowances && allowances.length > 0) {
          allowances.forEach(allowance => {
            // Use the original allowance amount without adjustment
            earnings.push({ 
              name: allowance.name, 
              amount: parseFloat(allowance.amount)
            });
          });
        }
        
        // Use deductions without any adjustment
        const deductionsList = deductions || [];

        const maxRows = Math.max(earnings.length, deductionsList.length);
        
        // Draw earnings and deductions in table format
        for (let i = 0; i < maxRows; i++) {
          // Earnings column
          if (i < earnings.length) {
            drawTableCell(
              40, earningsY + (i * rowHeight), 
              (pageWidth / 2) * 0.6, rowHeight,
              earnings[i].name + ':',
              { font: 'Helvetica-Bold' }
            );
            
            drawTableCell(
              40 + ((pageWidth / 2) * 0.6), earningsY + (i * rowHeight), 
              (pageWidth / 2) * 0.4, rowHeight,
              formatCurrency(earnings[i].amount),
              { align: 'right' }
            );
            
            totalEarnings += parseFloat(earnings[i].amount);
          } else {
            // Empty cells to maintain table structure
            drawTableCell(
              40, earningsY + (i * rowHeight), 
              (pageWidth / 2) * 0.6, rowHeight, 
              '',
              { fillColor: '#ffffff' }
            );
            
            drawTableCell(
              40 + ((pageWidth / 2) * 0.6), earningsY + (i * rowHeight), 
              (pageWidth / 2) * 0.4, rowHeight, 
              '',
              { fillColor: '#ffffff' }
            );
          }
          
          // Deductions column
          if (i < deductionsList.length) {
            drawTableCell(
              40 + (pageWidth / 2), earningsY + (i * rowHeight), 
              (pageWidth / 2) * 0.6, rowHeight,
              deductionsList[i].name + ':',
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
        // Total Earnings
        drawTableCell(
          40, totalRowY, 
          (pageWidth / 2) * 0.6, rowHeight,
          'Total Earnings:',
          { font: 'Helvetica-Bold', fillColor: '#f0f0f0', fontColor: '#f70505' }
        );
        
        drawTableCell(
          40 + ((pageWidth / 2) * 0.6), totalRowY, 
          (pageWidth / 2) * 0.4, rowHeight,
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
        const netSalary = totalEarnings - totalDeductions;
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
        // Position the disclaimer closer to the net salary section
        const disclaimerY = netSalaryY + rowHeight + 30;
        
        doc.rect(40, disclaimerY, pageWidth, 50)
          .fillAndStroke('#f9f9f9', '#cccccc');
        
        doc.fontSize(9).fillColor('#555555').font('Helvetica-Bold')
          .text('** Computer generated pay slip & does not require any signature & seal. **', 
                40, disclaimerY + 15, { align: 'center' });
        
        doc.fontSize(9).fillColor('#555555').font('Helvetica')
          .text('** If you received this in error please destroy it along with any copies and notify the sender immediately **', 
                40, disclaimerY + 30, { align: 'center' });

        doc.end();
        stream.on('finish', () => resolve(filePath));
        stream.on('error', (err) => reject(err));
      } catch (error) {
        reject(error);
      }
    });
  }
}
