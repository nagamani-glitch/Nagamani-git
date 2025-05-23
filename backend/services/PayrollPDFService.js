// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import PDFDocument from 'pdfkit';
// import https from 'https';

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
//         const { empId, empName, department, designation, bankDetails, basicPay, allowances, deductions, month, year, pfNo, uanNo, panNo, dateOfJoining } = payslipData;
        
//         // Calculate working days and LOP days
//         const totalDaysInMonth = new Date(year, month, 0).getDate();
//         const workingDays = payslipData.workingDays || totalDaysInMonth;
//         const lopDays = payslipData.lopDays || 0;
//         const effectiveWorkingDays = workingDays - lopDays;
        
//         // Calculate per day salary
//         const perDaySalary = parseFloat(basicPay) / workingDays;
        
//         // Calculate attendance ratio
//         const attendanceRatio = effectiveWorkingDays / workingDays;

//         // Helper function to draw a table cell
//         const drawTableCell = (x, y, width, height, text, options = {}) => {
//           const defaultOptions = {
//             fontSize: 10,
//             fontColor: '#333333',
//             font: 'Helvetica',
//             align: 'left',
//             valign: 'top',
//             padding: 5,
//             fillColor: null,
//             borderColor: '#cccccc',
//             drawBorder: true
//           };
          
//           const opts = { ...defaultOptions, ...options };
          
//           // Draw cell background if specified
//           if (opts.fillColor) {
//             doc.fillColor(opts.fillColor).rect(x, y, width, height).fill();
//           }
          
//           // Draw cell border
//           if (opts.drawBorder) {
//             doc.strokeColor(opts.borderColor).lineWidth(0.5)
//               .rect(x, y, width, height).stroke();
//           }
          
//           // Draw text
//           doc.font(opts.font === 'Helvetica-Bold' ? 'Helvetica-Bold' : 'Helvetica')
//             .fontSize(opts.fontSize)
//             .fillColor(opts.fontColor);
          
//           const textX = x + opts.padding;
//           const textY = y + opts.padding;
//           const textWidth = width - (2 * opts.padding);
          
//           doc.text(text || '', textX, textY, {
//             width: textWidth,
//             align: opts.align
//           });
//         };

//         // Function to fetch and add the logo
//         const addLogoAndContinue = () => {
//           const logoUrl = "https://res.cloudinary.com/dfl9rotoy/image/upload/v1741065300/logo2-removebg-preview_p6juhh.png";
          
//           // Download the logo image
//           https.get(logoUrl, (response) => {
//             if (response.statusCode !== 200) {
//               // If logo can't be fetched, continue without it
//               console.error(`Failed to load logo: ${response.statusCode}`);
//               continueWithPdfGeneration();
//               return;
//             }
            
//             const chunks = [];
//             response.on('data', (chunk) => chunks.push(chunk));
//             response.on('end', () => {
//               const logoData = Buffer.concat(chunks);
              
//               // First add the regular logo at the top
//               const logoWidth = 150;
//               const logoHeight = 75;
//               const logoX = (doc.page.width - logoWidth) / 2;
//               const logoY = 40;
              
//               doc.image(logoData, logoX, logoY, {
//                 width: logoWidth,
//                 height: logoHeight
//               });
              
//               // Start content after the logo
//               doc.y = logoY + logoHeight + 10;
              
//               // Continue with the rest of the PDF generation, passing the logo data
//               // so we can add the watermark after all content is added
//               continueWithPdfGeneration(logoData);
//             });
//           }).on('error', (err) => {
//             console.error('Error downloading logo:', err);
//             continueWithPdfGeneration();
//           });
//         };

//         // Function to continue with PDF generation after logo
//         const continueWithPdfGeneration = (logoData = null) => {
//           /** -------------------- HEADER -------------------- **/
//           // Company name and address first, after the logo
          
//           doc.fontSize(20).fillColor('#f70505').font('Helvetica-Bold')
//             .text('DB4Cloud Technologies Pvt Ltd', { align: 'center' });

//           doc.moveDown(0.5)
//             .fontSize(10).fillColor('#333333').text('#24-361, Satyanarayana puram, KongaReddy Palli, Chittor Andhra Pradesh - 517001', { align: 'center' });

//           doc.moveDown(0.8)
//             .fontSize(14).fillColor('#555555').font('Helvetica-Bold')
//             .text(`Payslip for the month of ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`, { align: 'center' });

//           doc.moveDown(2);
          
//           // Now draw the header box
//           doc.rect(40, doc.y, doc.page.width - 80, 30).fillAndStroke('#e6e6e6', '#cccccc');
//           doc.fontSize(12).fillColor('#f70505').font('Helvetica-Bold')
//             .text('EMPLOYEE DETAILS', 50, doc.y - 25, { align: 'left' });
          
//           doc.moveDown(0.5);
          
//           // Employee details table
//           const startTableY = doc.y;
//           const pageWidth = doc.page.width - 80;
//           const colWidth = pageWidth / 2;
          
//           const employeeDetails = [
//             [
//               { label: 'Employee ID', value: empId },
//               { label: 'Bank Name', value: bankDetails?.bankName }
//             ],
//             [
//               { label: 'Employee Name', value: empName },
//               { label: 'Bank A/C No.', value: bankDetails?.accountNo }
//             ],
//             [
//               { label: 'Date of Joining', value: dateOfJoining ? new Date(dateOfJoining).toLocaleDateString() : 'N/A' },
//               { label: 'PAN Number', value: panNo }
//             ],
//             [
//               { label: 'Department', value: department },
//               { label: 'UAN Number', value: uanNo || 'N/A' }
//             ],
//             [
//               { label: 'Designation', value: designation },
//               { label: 'PF Number', value: pfNo }
//             ],
//             [
//               { label: 'Working Days', value: workingDays.toString() },
//               { label: 'LOP Days', value: lopDays.toString() }
//             ],
//             [
//               { label: 'Payable Days', value: effectiveWorkingDays.toString() },
//               { label: '', value: '' }  // Empty cell to maintain the layout
//             ]
//           ];
          
//           // Draw employee details table
//           let currentY = startTableY;
//           const rowHeight = 25;
          
//           employeeDetails.forEach((row, rowIndex) => {
//             row.forEach((cell, colIndex) => {
//               const x = 40 + (colIndex * colWidth);
              
//               // Draw label cell
//               drawTableCell(
//                 x, currentY, colWidth / 2, rowHeight,
//                 cell.label + '',
//                 { 
//                   font: 'Helvetica-Bold',
//                   fillColor: '#f5f5f5'
//                 }
//               );
              
//               // Draw value cell
//               drawTableCell(
//                 x + (colWidth / 2), currentY, colWidth / 2, rowHeight,
//                 cell.value || 'N/A',
//                 { fillColor: '#ffffff' }
//               );
//             });
            
//             currentY += rowHeight;
//           });
          
//           doc.y = currentY + 20;

//           /** -------------------- EARNINGS & DEDUCTIONS -------------------- **/
//           let earningsY = doc.y;
//           let totalEarnings = 0, totalDeductions = 0;
//           let totalActualEarnings = 0;

//           // Section headers with table-like styling
//           doc.rect(40, earningsY, pageWidth / 2, 30).fillAndStroke('#e6e6e6', '#cccccc');
//           doc.rect(40 + (pageWidth / 2), earningsY, pageWidth / 2, 30).fillAndStroke('#e6e6e6', '#cccccc');
          
//           doc.fontSize(12).fillColor('#f70505').font('Helvetica-Bold')
//             .text('EARNINGS', 50, earningsY + 10);
//           doc.text('DEDUCTIONS', 50 + (pageWidth / 2), earningsY + 10);

//           earningsY += 30;

//           // Process earnings - Only include allowances, not the basic pay separately
//           // This aligns with the frontend logic where Total Pay is distributed across allowances
//           const earnings = [];
          
//           // Process allowances
//           if (allowances && allowances.length > 0) {
//             allowances.forEach(allowance => {
//               // Calculate actual amount (before attendance adjustment)
//               const actualAmount = parseFloat(basicPay) * (parseFloat(allowance.percentage) / 100);
//               // Calculate earned amount (after attendance adjustment)
//               const earnedAmount = parseFloat(allowance.amount);
              
//               earnings.push({ 
//                 name: allowance.name, 
//                 actualAmount: actualAmount,
//                 earnedAmount: earnedAmount,
//                 percentage: allowance.percentage
//               });
              
//               // Add to total earnings
//               totalActualEarnings += actualAmount;
//               totalEarnings += earnedAmount;
//             });
//           }
          
//           // Use deductions without any adjustment
//           const deductionsList = deductions || [];

//           const maxRows = Math.max(earnings.length, deductionsList.length);
          
//           // Draw column headers for earnings
//           drawTableCell(
//             40, earningsY, 
//             (pageWidth / 2) * 0.4, rowHeight,
//             'Component',
//             { font: 'Helvetica-Bold', fillColor: '#f0f0f0' }
//           );
          
//           drawTableCell(
//             40 + ((pageWidth / 2) * 0.4), earningsY, 
//             (pageWidth / 2) * 0.3, rowHeight,
//             'Actual',
//             { font: 'Helvetica-Bold', fillColor: '#f0f0f0', align: 'right' }
//           );
          
//           drawTableCell(
//             40 + ((pageWidth / 2) * 0.7), earningsY, 
//             (pageWidth / 2) * 0.3, rowHeight,
//             'Earned',
//             { font: 'Helvetica-Bold', fillColor: '#f0f0f0', align: 'right' }
//           );
          
//           // Draw column headers for deductions
//           drawTableCell(
//             40 + (pageWidth / 2), earningsY, 
//             (pageWidth / 2) * 0.6, rowHeight,
//             'Deduction',
//             { font: 'Helvetica-Bold', fillColor: '#f0f0f0' }
//           );
          
//           drawTableCell(
//             40 + (pageWidth / 2) + ((pageWidth / 2) * 0.6), earningsY, 
//             (pageWidth / 2) * 0.4, rowHeight,
//             'Amount',
//             { font: 'Helvetica-Bold', fillColor: '#f0f0f0', align: 'right' }
//           );
          
//           earningsY += rowHeight;
          
//           // Draw earnings and deductions in table format
//           for (let i = 0; i < maxRows; i++) {
//             // Earnings column
//             if (i < earnings.length) {
//               // Component name
//               drawTableCell(
//                 40, earningsY + (i * rowHeight), 
//                 (pageWidth / 2) * 0.4, rowHeight,
//                 earnings[i].name,
//                 { font: 'Helvetica-Bold', fontSize: 9 }
//               );
              
//               // Actual amount
//               drawTableCell(
//                 40 + ((pageWidth / 2) * 0.4), earningsY + (i * rowHeight), 
//                 (pageWidth / 2) * 0.3, rowHeight,
//                 formatCurrency(earnings[i].actualAmount),
//                 { align: 'right', fontColor: '#555555' }
//               );
              
//               // Earned amount
//               drawTableCell(
//                 40 + ((pageWidth / 2) * 0.7), earningsY + (i * rowHeight), 
//                 (pageWidth / 2) * 0.3, rowHeight,
//                 formatCurrency(earnings[i].earnedAmount),
//                 { align: 'right', font: 'Helvetica-Bold' }
//               );
//             } else {
//               // Empty cells to maintain table structure
//               drawTableCell(
//                 40, earningsY + (i * rowHeight), 
//                 (pageWidth / 2) * 0.4, rowHeight, 
//                 '',
//                 { fillColor: '#ffffff' }
//               );
              
//               drawTableCell(
//                 40 + ((pageWidth / 2) * 0.4), earningsY + (i * rowHeight), 
//                 (pageWidth / 2) * 0.3, rowHeight, 
//                 '',
//                 { fillColor: '#ffffff' }
//               );
              
//               drawTableCell(
//                 40 + ((pageWidth / 2) * 0.7), earningsY + (i * rowHeight), 
//                 (pageWidth / 2) * 0.3, rowHeight, 
//                 '',
//                 { fillColor: '#ffffff' }
//               );
//             }
            
//             // Deductions column
//             if (i < deductionsList.length) {
//               drawTableCell(
//                 40 + (pageWidth / 2), earningsY + (i * rowHeight), 
//                 (pageWidth / 2) * 0.6, rowHeight,
//                 deductionsList[i].name,
//                 { font: 'Helvetica-Bold' }
//               );
              
//               drawTableCell(
//                 40 + (pageWidth / 2) + ((pageWidth / 2) * 0.6), earningsY + (i * rowHeight), 
//                 (pageWidth / 2) * 0.4, rowHeight,
//                 formatCurrency(deductionsList[i].amount),
//                 { align: 'right' }
//               );
              
//               totalDeductions += parseFloat(deductionsList[i].amount);
//             } else {
//               // Empty cells to maintain table structure
//               drawTableCell(
//                 40 + (pageWidth / 2), earningsY + (i * rowHeight), 
//                 (pageWidth / 2) * 0.6, rowHeight, 
//                 '',
//                 { fillColor: '#ffffff' }
//               );
              
//               drawTableCell(
//                 40 + (pageWidth / 2) + ((pageWidth / 2) * 0.6), earningsY + (i * rowHeight), 
//                 (pageWidth / 2) * 0.4, rowHeight, 
//                 '',
//                 { fillColor: '#ffffff' }
//               );
//             }
//           }

//           const totalRowY = earningsY + (maxRows * rowHeight);

//           /** -------------------- TOTALS -------------------- **/
//           // Total Earnings - Actual
//           drawTableCell(
//             40, totalRowY, 
//             (pageWidth / 2) * 0.4, rowHeight,
//             'Total Earnings:',
//             { font: 'Helvetica-Bold', fillColor: '#f0f0f0', fontColor: '#f70505' }
//           );
          
//           // Total Earnings - Actual
//           drawTableCell(
//             40 + ((pageWidth / 2) * 0.4), totalRowY, 
//             (pageWidth / 2) * 0.3, rowHeight,
//             formatCurrency(totalActualEarnings),
//             { align: 'right', fillColor: '#f0f0f0', fontColor: '#555555' }
//           );
          
//           // Total Earnings - Earned
//           drawTableCell(
//             40 + ((pageWidth / 2) * 0.7), totalRowY, 
//             (pageWidth / 2) * 0.3, rowHeight,
//             formatCurrency(totalEarnings),
//             { align: 'right', fillColor: '#f0f0f0', fontColor: '#f70505', font: 'Helvetica-Bold' }
//           );
          
//           // Total Deductions
//           drawTableCell(
//             40 + (pageWidth / 2), totalRowY, 
//             (pageWidth / 2) * 0.6, rowHeight,
//             'Total Deductions:',
//             { font: 'Helvetica-Bold', fillColor: '#f0f0f0', fontColor: '#f70505' }
//           );
          
//           drawTableCell(
//             40 + (pageWidth / 2) + ((pageWidth / 2) * 0.6), totalRowY, 
//             (pageWidth / 2) * 0.4, rowHeight,
//             formatCurrency(totalDeductions),
//             { align: 'right', fillColor: '#f0f0f0', fontColor: '#f70505', font: 'Helvetica-Bold' }
//           );

//           /** -------------------- NET SALARY -------------------- **/
//           // Use the netSalary value passed from the controller instead of recalculating it
//           const netSalary = payslipData.netSalary || (totalEarnings - totalDeductions);
//           const netSalaryY = totalRowY + rowHeight + 20;

//           // Net salary box with highlight
//           doc.rect(40, netSalaryY, pageWidth, rowHeight + 10)
//             .fillAndStroke('#f0f0f0', '#cccccc');

//           doc.fontSize(14).fillColor('#f70505').font('Helvetica-Bold')
//             .text('NET SALARY:', 50, netSalaryY + 10);

//           doc.fontSize(14).fillColor('#f70505').font('Helvetica-Bold')
//             .text(formatCurrency(netSalary), 180, netSalaryY + 10);

//           /** -------------------- DISCLAIMER -------------------- **/
//           // Reduced the gap between net salary and disclaimer
          
//           const disclaimerY = netSalaryY + rowHeight + 30;
          
//           doc.rect(40, disclaimerY, pageWidth, 50)
//             .fillAndStroke('#f9f9f9', '#cccccc');
          
//           doc.fontSize(9).fillColor('#555555').font('Helvetica-Bold')
//             .text('** Computer generated pay slip & does not require any signature & seal. **', 
//                   40, disclaimerY + 15, { align: 'center' });
          
//           doc.fontSize(9).fillColor('#555555').font('Helvetica')
//             .text('** If you received this in error please destroy it along with any copies and notify the sender immediately **', 
//                   40, disclaimerY + 30, { align: 'center' });

//           // // At the very end, before ending the document, add the watermark if we have logo data
//           // if (logoData) {
//           //   // Save the current state of the document
//           //   doc.save();
            
//           //   // Add watermark with higher opacity so it shows through colored elements
//           //   const watermarkWidth = 700;
//           //   const watermarkHeight = 700;
//           //   const watermarkX = (doc.page.width - watermarkWidth) / 2;
//           //   const watermarkY = (doc.page.height - watermarkHeight) / 2;
            
//           //   // Use a higher opacity value (0.15 instead of 0.08)
//           //   doc.opacity(0.15);
            
//           //   // Add the watermark
//           //   doc.image(logoData, watermarkX, watermarkY, {
//           //     width: watermarkWidth,
//           //     height: watermarkHeight,

//           //   });
            
//           //   // Restore the document state
//           //   doc.restore();
//           // }

//           doc.end();
//         };

//         // Start the PDF generation process by adding the logo first
//         addLogoAndContinue();

//         stream.on('finish', () => resolve(filePath));
//         stream.on('error', (err) => reject(err));
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }
// }

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
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
        const { empId, empName, department, designation, bankDetails, basicPay, allowances, deductions, month, year, pfNo, uanNo, panNo, dateOfJoining } = payslipData;
        
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
            borderWidth: 1,
            drawBorder: true
          };
          
          const opts = { ...defaultOptions, ...options };
          
          // Draw cell background if fillColor is provided
          if (opts.fillColor) {
            doc.fillColor(opts.fillColor)
               .rect(x, y, width, height)
               .fill();
          }
          
          // Draw cell border if drawBorder is true
          if (opts.drawBorder) {
            doc.strokeColor(opts.borderColor)
               .lineWidth(opts.borderWidth)
               .rect(x, y, width, height)
               .stroke();
          }
          
          // Draw text
          doc.font(opts.font)
             .fontSize(opts.fontSize)
             .fillColor(opts.fontColor);
          
          // Calculate text position based on alignment
          const textX = x + opts.padding;
          let textY = y + opts.padding;
          
          // Handle vertical alignment
          if (opts.valign === 'middle') {
            const textHeight = doc.heightOfString(text, { width: width - (opts.padding * 2) });
            textY = y + (height - textHeight) / 2;
          } else if (opts.valign === 'bottom') {
            const textHeight = doc.heightOfString(text, { width: width - (opts.padding * 2) });
            textY = y + height - textHeight - opts.padding;
          }
          
          // Draw text with alignment
          doc.text(text, textX, textY, {
            width: width - (opts.padding * 2),
            align: opts.align
          });
        };

        // Add company logo and header
        doc.fontSize(18)
           .fillColor('#333333')
           .text('PAYSLIP', { align: 'center' });
        
        doc.moveDown();
        
        // Add month and year
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        doc.fontSize(12)
           .fillColor('#666666')
           .text(`For the month of ${monthNames[month - 1]} ${year}`, { align: 'center' });
        
        doc.moveDown();
        
        // Employee details section
        const startY = doc.y;
        const pageWidth = doc.page.width - 80; // Accounting for margins
        
        // Draw employee details table
        const employeeDetailsTable = [
          { label: 'Employee ID', value: empId },
          { label: 'Employee Name', value: empName },
          { label: 'Department', value: department },
          { label: 'Designation', value: designation },
          { label: 'PF Number', value: pfNo },
          { label: 'UAN Number', value: uanNo },
          { label: 'PAN Number', value: panNo },
          { label: 'Date of Joining', value: dateOfJoining ? new Date(dateOfJoining).toLocaleDateString() : 'N/A' },
          { label: 'Bank Name', value: bankDetails.bankName },
          { label: 'Account Number', value: bankDetails.accountNo }
        ];
        
        // Draw employee details in two columns
        const colWidth = pageWidth / 2;
        let currentY = startY;
        
        for (let i = 0; i < employeeDetailsTable.length; i += 2) {
          const rowHeight = 25;
          
          // First column
          drawTableCell(40, currentY, colWidth, rowHeight, employeeDetailsTable[i].label, {
            fillColor: '#f5f5f5',
            fontColor: '#333333',
            fontSize: 10,
            align: 'left',
            valign: 'middle'
          });
          
          drawTableCell(40 + colWidth / 2, currentY, colWidth / 2, rowHeight, employeeDetailsTable[i].value, {
            fontColor: '#333333',
            fontSize: 10,
            align: 'left',
            valign: 'middle'
          });
          
          // Second column (if exists)
          if (i + 1 < employeeDetailsTable.length) {
            drawTableCell(40 + colWidth, currentY, colWidth / 2, rowHeight, employeeDetailsTable[i + 1].label, {
              fillColor: '#f5f5f5',
              fontColor: '#333333',
              fontSize: 10,
              align: 'left',
              valign: 'middle'
            });
            
            drawTableCell(40 + colWidth * 1.5, currentY, colWidth / 2, rowHeight, employeeDetailsTable[i + 1].value, {
              fontColor: '#333333',
              fontSize: 10,
              align: 'left',
              valign: 'middle'
            });
          }
          
          currentY += rowHeight;
        }
        
        doc.y = currentY + 20;
        
        // Attendance details
        doc.fontSize(12)
           .fillColor('#333333')
           .text('Attendance Details', { underline: true });
        
        doc.moveDown(0.5);
        
        const attendanceTable = [
          { label: 'Total Days', value: totalDaysInMonth.toString() },
          { label: 'Working Days', value: workingDays.toString() },
          { label: 'LOP Days', value: lopDays.toString() },
          { label: 'Effective Working Days', value: effectiveWorkingDays.toString() }
        ];
        
        // Draw attendance details table
        currentY = doc.y;
        const attendanceColWidth = pageWidth / 4;
        
        for (let i = 0; i < attendanceTable.length; i++) {
          drawTableCell(40 + (i * attendanceColWidth), currentY, attendanceColWidth, 25, attendanceTable[i].label, {
            fillColor: '#f5f5f5',
            fontColor: '#333333',
            fontSize: 10,
            align: 'center',
            valign: 'middle'
          });
          
          drawTableCell(40 + (i * attendanceColWidth), currentY + 25, attendanceColWidth, 25, attendanceTable[i].value, {
            fontColor: '#333333',
            fontSize: 10,
            align: 'center',
            valign: 'middle'
          });
        }
        
        doc.y = currentY + 70;
        
        // Earnings and Deductions
        doc.fontSize(12)
           .fillColor('#333333')
           .text('Earnings and Deductions', { underline: true });
        
        doc.moveDown(0.5);
        
        // Calculate totals
        const totalEarnings = allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
        const totalDeductions = deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
        const netSalary = totalEarnings - totalDeductions;
        
        // Calculate LOP impact
        const lopImpact = (totalEarnings * lopDays) / workingDays;
        const finalNetSalary = netSalary - lopImpact;
        
        // Draw earnings and deductions table
        currentY = doc.y;
        const halfWidth = pageWidth / 2;
        
        // Table headers
        drawTableCell(40, currentY, halfWidth / 2, 25, 'Earnings', {
          fillColor: '#4CAF50',
          fontColor: '#FFFFFF',
          fontSize: 12,
          align: 'center',
          valign: 'middle'
        });
        
        drawTableCell(40 + halfWidth / 2, currentY, halfWidth / 2, 25, 'Amount', {
          fillColor: '#4CAF50',
          fontColor: '#FFFFFF',
          fontSize: 12,
          align: 'center',
          valign: 'middle'
        });
        
        drawTableCell(40 + halfWidth, currentY, halfWidth / 2, 25, 'Deductions', {
          fillColor: '#F44336',
          fontColor: '#FFFFFF',
          fontSize: 12,
          align: 'center',
          valign: 'middle'
        });
        
        drawTableCell(40 + halfWidth * 1.5, currentY, halfWidth / 2, 25, 'Amount', {
          fillColor: '#F44336',
          fontColor: '#FFFFFF',
          fontSize: 12,
          align: 'center',
          valign: 'middle'
        });
        
        currentY += 25;
        
        // Determine the maximum number of rows needed
        const maxRows = Math.max(allowances.length, deductions.length);
        
        // Draw rows for earnings and deductions
        for (let i = 0; i < maxRows; i++) {
          const rowHeight = 20;
          
          // Earnings column
          if (i < allowances.length) {
            drawTableCell(40, currentY, halfWidth / 2, rowHeight, allowances[i].name, {
              fontColor: '#333333',
              fontSize: 10,
              align: 'left',
              valign: 'middle'
            });
            
            drawTableCell(40 + halfWidth / 2, currentY, halfWidth / 2, rowHeight, formatCurrency(allowances[i].amount), {
              fontColor: '#333333',
              fontSize: 10,
              align: 'right',
              valign: 'middle'
            });
          } else {
            drawTableCell(40, currentY, halfWidth / 2, rowHeight, '', {
                            fontColor: '#333333',
              fontSize: 10,
              align: 'left',
              valign: 'middle'
            });
            
            drawTableCell(40 + halfWidth / 2, currentY, halfWidth / 2, rowHeight, '', {
              fontColor: '#333333',
              fontSize: 10,
              align: 'right',
              valign: 'middle'
            });
          }
          
          // Deductions column
          if (i < deductions.length) {
            drawTableCell(40 + halfWidth, currentY, halfWidth / 2, rowHeight, deductions[i].name, {
              fontColor: '#333333',
              fontSize: 10,
              align: 'left',
              valign: 'middle'
            });
            
            drawTableCell(40 + halfWidth * 1.5, currentY, halfWidth / 2, rowHeight, formatCurrency(deductions[i].amount), {
              fontColor: '#333333',
              fontSize: 10,
              align: 'right',
              valign: 'middle'
            });
          } else {
            drawTableCell(40 + halfWidth, currentY, halfWidth / 2, rowHeight, '', {
              fontColor: '#333333',
              fontSize: 10,
              align: 'left',
              valign: 'middle'
            });
            
            drawTableCell(40 + halfWidth * 1.5, currentY, halfWidth / 2, rowHeight, '', {
              fontColor: '#333333',
              fontSize: 10,
              align: 'right',
              valign: 'middle'
            });
          }
          
          currentY += rowHeight;
        }
        
        // Draw totals
        drawTableCell(40, currentY, halfWidth / 2, 25, 'Total Earnings', {
          fillColor: '#E8F5E9',
          fontColor: '#2E7D32',
          fontSize: 11,
          align: 'left',
          valign: 'middle',
          font: 'Helvetica-Bold'
        });
        
        drawTableCell(40 + halfWidth / 2, currentY, halfWidth / 2, 25, formatCurrency(totalEarnings), {
          fillColor: '#E8F5E9',
          fontColor: '#2E7D32',
          fontSize: 11,
          align: 'right',
          valign: 'middle',
          font: 'Helvetica-Bold'
        });
        
        drawTableCell(40 + halfWidth, currentY, halfWidth / 2, 25, 'Total Deductions', {
          fillColor: '#FFEBEE',
          fontColor: '#C62828',
          fontSize: 11,
          align: 'left',
          valign: 'middle',
          font: 'Helvetica-Bold'
        });
        
        drawTableCell(40 + halfWidth * 1.5, currentY, halfWidth / 2, 25, formatCurrency(totalDeductions), {
          fillColor: '#FFEBEE',
          fontColor: '#C62828',
          fontSize: 11,
          align: 'right',
          valign: 'middle',
          font: 'Helvetica-Bold'
        });
        
        currentY += 25;
        
        // Draw LOP impact
        drawTableCell(40, currentY, halfWidth, 25, 'LOP Impact', {
          fillColor: '#FFF8E1',
          fontColor: '#F57F17',
          fontSize: 11,
          align: 'left',
          valign: 'middle',
          font: 'Helvetica-Bold'
        });
        
        drawTableCell(40 + halfWidth, currentY, halfWidth, 25, formatCurrency(lopImpact), {
          fillColor: '#FFF8E1',
          fontColor: '#F57F17',
          fontSize: 11,
          align: 'right',
          valign: 'middle',
          font: 'Helvetica-Bold'
        });
        
        currentY += 25;
        
        // Draw net salary
        drawTableCell(40, currentY, halfWidth, 30, 'NET SALARY', {
          fillColor: '#1976D2',
          fontColor: '#FFFFFF',
          fontSize: 12,
          align: 'left',
          valign: 'middle',
          font: 'Helvetica-Bold'
        });
        
        drawTableCell(40 + halfWidth, currentY, halfWidth, 30, formatCurrency(finalNetSalary), {
          fillColor: '#1976D2',
          fontColor: '#FFFFFF',
          fontSize: 12,
          align: 'right',
          valign: 'middle',
          font: 'Helvetica-Bold'
        });
        
        // Add footer
        doc.fontSize(8)
           .fillColor('#666666')
           .text('This is a computer-generated document. No signature is required.', 40, doc.page.height - 50, { align: 'center' });
        
        // Finalize the PDF
        doc.end();
        
        // Wait for the stream to finish
        stream.on('finish', () => {
          resolve(filePath);
        });
        
        stream.on('error', (err) => {
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

