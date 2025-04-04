// import PDFDocument from 'pdfkit';
// import fs from 'fs-extra';
// import path from 'path';
// import moment from 'moment';

// export class PayrollPDFService {
//   static async generatePayslipPDF(payslipData) {
//     const formatCurrency = (amount) => {
//       return `Rs. ${parseFloat(amount).toFixed(2)}`;
//     };

//     const doc = new PDFDocument({
//       size: 'A4',
//       margin: 50,
//       bufferPages: true
//     });

//     // Layout constants
//     const pageWidth = doc.page.width;
//     const contentWidth = pageWidth - 100;
//     const leftMargin = 50;
//     const rightMargin = pageWidth - 50;
//     const columnWidth = (contentWidth - 20) / 2;
//     const rowHeight = 30;
//     const detailRowHeight = 25;

//     const fileName = `payslip_${payslipData.empId}_${payslipData.month}_${payslipData.year}.pdf`;
//     const filePath = path.join('uploads', 'payslips', fileName);

//     await fs.ensureDir(path.dirname(filePath));
//     const stream = fs.createWriteStream(filePath);
//     doc.pipe(stream);

//     // Border design
//     doc.rect(15, 15, pageWidth - 30, doc.page.height - 30).strokeColor('#000080').lineWidth(0.5).stroke();
//     doc.rect(20, 20, pageWidth - 40, doc.page.height - 40).strokeColor('#000080').lineWidth(1).stroke();
//     doc.rect(25, 25, pageWidth - 50, doc.page.height - 50).strokeColor('#000080').lineWidth(0.5).stroke();

//     // Company header
//     const headerY = 50;
//     doc.fontSize(32)
//        .fillColor('#000080')
//        .font('Helvetica-Bold')
//        .text('DB4Cloud Technologies Pvt Ltd', leftMargin, headerY, {
//          align: 'center',
//          width: contentWidth,
//          characterSpacing: 0.5
//        });

//     // Payslip header
//     const monthName = moment().month(payslipData.month - 1).format('MMMM');
//     doc.fontSize(26)
//        .fillColor('#1a1a1a')
//        .text('Salary Slip', leftMargin, doc.y + 25, {
//          align: 'center',
//          width: contentWidth
//        });

//     doc.fontSize(18)
//        .fillColor('#4d4d4d')
//        .text(`For the month of ${monthName} ${payslipData.year}`, leftMargin, doc.y + 15, {
//          align: 'center',
//          width: contentWidth
//        });

//     // Separator
//     const separatorY = doc.y + 25;
//     doc.moveTo(leftMargin, separatorY)
//        .lineTo(rightMargin, separatorY)
//        .strokeColor('#000080')
//        .lineWidth(2)
//        .stroke();

//     // Employee Details Section
//     const detailsBoxY = separatorY + 20;
//     const detailsBoxHeight = 160;
//     doc.rect(leftMargin, detailsBoxY, contentWidth, detailsBoxHeight)
//        .fillColor('#f8f9fa')
//        .fill()
//        .strokeColor('#000080')
//        .lineWidth(1)
//        .stroke();

//     // Section header
//     doc.fontSize(14)
//        .fillColor('#000080')
//        .font('Helvetica-Bold')
//        .text('Employee Details', leftMargin + 10, detailsBoxY + 10);

//     const detailsStartY = detailsBoxY + 35;
//     const colWidth = contentWidth / 2;
//     let currentDetailY = detailsStartY;

//     // Helper function for detail rows
//     const addDetailRow = (label1, value1, label2, value2, y) => {
//       doc.font('Helvetica-Bold')
//          .fillColor('#000080')
//          .fontSize(11)
//          .text(label1, leftMargin + 15, y, { width: 100 })
//          .font('Helvetica')
//          .fillColor('#000000')
//          .text(value1 || 'N/A', leftMargin + 120, y, { width: 150 })
//          .font('Helvetica-Bold')
//          .fillColor('#000080')
//          .text(label2, leftMargin + colWidth + 15, y, { width: 100 })
//          .font('Helvetica')
//          .fillColor('#000000')
//          .text(value2 || 'N/A', leftMargin + colWidth + 120, y, { width: 150 });
//     };

//     // Employee details rows
//     addDetailRow('Employee ID:', payslipData.empId, 'Name:', payslipData.empName, currentDetailY);
//     currentDetailY += detailRowHeight;
    
//     addDetailRow('Department:', payslipData.department, 'Designation:', payslipData.designation, currentDetailY);
//     currentDetailY += detailRowHeight;
    
//     addDetailRow('PF No:', payslipData.pfNo, 'UAN No:', payslipData.uanNo, currentDetailY);
//     currentDetailY += detailRowHeight;
    
//     addDetailRow('PAN No:', payslipData.panNo, 'Bank Name:', payslipData.bankDetails.bankName, currentDetailY);
//     currentDetailY += detailRowHeight;
    
//     addDetailRow('Account No:', payslipData.bankDetails.accountNo, 'Basic Pay:', formatCurrency(payslipData.basicPay), currentDetailY);

//     // Attendance Details Section
//     const attendanceBoxY = detailsBoxY + detailsBoxHeight + 20;
//     const attendanceBoxHeight = 80;
    
//     doc.rect(leftMargin, attendanceBoxY, contentWidth, attendanceBoxHeight)
//        .fillColor('#f8f9fa')
//        .fill()
//        .strokeColor('#000080')
//        .stroke();

//     doc.fontSize(14)
//        .font('Helvetica-Bold')
//        .fillColor('#000080')
//        .text('Attendance Details', leftMargin + 15, attendanceBoxY + 10);

//     const attendanceStartY = attendanceBoxY + 35;
//     const attendanceColWidth = contentWidth / 4;

//     const attendanceDetails = [
//       { label: 'Total Days:', value: payslipData.payableDays },
//       { label: 'LOP Days:', value: payslipData.lopDays },
//       { label: 'Working Days:', value: payslipData.payableDays - payslipData.lopDays },
//       { label: 'Per Day Pay:', value: formatCurrency(payslipData.basicPay / payslipData.payableDays) }
//     ];

//     attendanceDetails.forEach((detail, index) => {
//       doc.font('Helvetica-Bold')
//          .fillColor('#000080')
//          .fontSize(11)
//          .text(detail.label, leftMargin + (attendanceColWidth * index) + 15, attendanceStartY)
//          .font('Helvetica')
//          .fillColor('#000000')
//          .text(detail.value, leftMargin + (attendanceColWidth * index) + 15, attendanceStartY + 20);
//     });

//     // Earnings & Deductions tables
//     const tableY = attendanceBoxY + attendanceBoxHeight + 20;
//     const tableHeaderHeight = 35;

//     // Earnings Table
//     const earningsX = leftMargin;
//     doc.rect(earningsX, tableY, columnWidth, tableHeaderHeight)
//        .fillColor('#000080')
//        .fill();
    
//     doc.fillColor('#FFFFFF')
//        .fontSize(16)
//        .font('Helvetica-Bold')
//        .text('EARNINGS', earningsX, tableY + 10, {
//          width: columnWidth,
//          align: 'center'
//        });

//     let currentY = tableY + tableHeaderHeight;

//     // Basic pay row
//     doc.rect(earningsX, currentY, columnWidth, rowHeight)
//        .fillColor('#f8f9fa')
//        .fill()
//        .strokeColor('#000080')
//        .stroke();

//     doc.fillColor('#000000')
//        .fontSize(11)
//        .font('Helvetica')
//        .text('Basic Pay', earningsX + 15, currentY + 8)
//        .text(formatCurrency(payslipData.basicPay), 
//              earningsX + columnWidth - 80, currentY + 8, {
//                width: 70,
//                align: 'right'
//              });

//     currentY += rowHeight;

//     // Allowances
//     payslipData.allowances.forEach((allowance, index) => {
//       const rowY = currentY;
//       doc.rect(earningsX, rowY, columnWidth, rowHeight)
//          .fillColor(index % 2 === 0 ? '#ffffff' : '#f8f9fa')
//          .fill()
//          .strokeColor('#000080')
//          .stroke();

//       doc.fillColor('#000000')
//          .fontSize(11)
//          .font('Helvetica')
//          .text(`${allowance.name} (${allowance.percentage}%)`, earningsX + 15, rowY + 8)
//          .text(formatCurrency(allowance.amount), 
//                earningsX + columnWidth - 80, rowY + 8, {
//                  width: 70,
//                  align: 'right'
//                });

//       currentY += rowHeight;
//     });

//     // Deductions Table
//     const deductionsX = leftMargin + columnWidth + 20;
//     doc.rect(deductionsX, tableY, columnWidth, tableHeaderHeight)
//        .fillColor('#000080')
//        .fill();

//     doc.fillColor('#FFFFFF')
//        .fontSize(16)
//        .font('Helvetica-Bold')
//        .text('DEDUCTIONS', deductionsX, tableY + 10, {
//          width: columnWidth,
//          align: 'center'
//        });

//     currentY = tableY + tableHeaderHeight;

//     payslipData.deductions.forEach((deduction, index) => {
//       const rowY = currentY;
//       doc.rect(deductionsX, rowY, columnWidth, rowHeight)
//          .fillColor(index % 2 === 0 ? '#ffffff' : '#f8f9fa')
//          .fill()
//          .strokeColor('#000080')
//          .stroke();

//       doc.fillColor('#000000')
//          .fontSize(11)
//          .font('Helvetica')
//          .text(`${deduction.name} (${deduction.percentage}%)`, deductionsX + 15, rowY + 8)
//          .text(formatCurrency(deduction.amount), 
//                deductionsX + columnWidth - 80, rowY + 8, {
//                  width: 70,
//                  align: 'right'
//                });

//       currentY += rowHeight;
//     });

//     // Summary section
//     const summaryY = currentY + 30;
//     const summaryHeight = 130;
//     doc.rect(leftMargin, summaryY, contentWidth, summaryHeight)
//        .fillColor('#f8f9fa')
//        .fill()
//        .strokeColor('#000080')
//        .lineWidth(2)
//        .stroke();

//     const summaryTextX = leftMargin + 20;
//     const summaryValueX = leftMargin + 200;
    
//     doc.fontSize(14)
//        .font('Helvetica-Bold')
//        .fillColor('#000080')
//        .text('Gross Salary:', summaryTextX, summaryY + 20)
//        .text(formatCurrency(payslipData.grossSalary), summaryValueX, summaryY + 20);

//     doc.text('Total Deductions:', summaryTextX, summaryY + 55)
//        .text(formatCurrency(payslipData.totalDeductions), summaryValueX, summaryY + 55);

//     doc.fontSize(16)
//        .text('Net Salary:', summaryTextX, summaryY + 90)
//        .text(formatCurrency(payslipData.netSalary), summaryValueX, summaryY + 90);

//     // Footer
//     const generationDate = moment().format('DD/MM/YYYY HH:mm:ss');
//     doc.fontSize(10)
//        .fillColor('#666666')
//        .font('Helvetica-Oblique')
//        .text(`Generated on: ${generationDate}`, leftMargin, doc.page.height - 70, {
//          align: 'center',
//          width: contentWidth
//        })
//        .text('This is a computer-generated document and does not require signature', 
//              leftMargin, doc.page.height - 50, {
//                align: 'center',
//                width: contentWidth
//              });

//     doc.end();

//     return new Promise((resolve, reject) => {
//       stream.on('finish', () => resolve(filePath));
//       stream.on('error', reject);
//     });
//   }
// }



// //----------------------2-------------------------
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
//         // Create directory for payslips if it doesn't exist
//         const uploadsDir = path.join(__dirname, '../uploads');
//         const payslipsDir = path.join(uploadsDir, 'payslips');
        
//         if (!fs.existsSync(uploadsDir)) {
//           fs.mkdirSync(uploadsDir);
//         }
        
//         if (!fs.existsSync(payslipsDir)) {
//           fs.mkdirSync(payslipsDir);
//         }
        
//         // Create a unique filename for the PDF
//         const fileName = `payslip_${payslipData.empId}_${payslipData.month}_${payslipData.year}_${Date.now()}.pdf`;
//         const filePath = path.join(payslipsDir, fileName);
        
//         // Create a new PDF document
//         const doc = new PDFDocument({
//           size: 'A4',
//           margin: 50,
//           info: {
//             Title: `Payslip - ${payslipData.empName} - ${payslipData.month}/${payslipData.year}`,
//             Author: 'HRMS System',
//           }
//         });
        
//         // Pipe the PDF to a file
//         const stream = fs.createWriteStream(filePath);
//         doc.pipe(stream);
        
//         // Add company logo and header
//         // doc.image(path.join(__dirname, '../assets/logo.png'), 50, 45, { width: 100 });
        
//         // Add company name and payslip title
//         doc.fontSize(20).text('COMPANY NAME', { align: 'center' });
//         doc.fontSize(16).text('PAYSLIP', { align: 'center' });
//         doc.moveDown();
        
//         // Add payslip period
//         const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//         doc.fontSize(12).text(`Pay Period: ${monthNames[payslipData.month - 1]} ${payslipData.year}`, { align: 'center' });
//         doc.moveDown();
        
//         // Add a horizontal line
//         doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
//         doc.moveDown();
        
//         // Employee details section
//         doc.fontSize(14).text('Employee Details', { underline: true });
//         doc.moveDown(0.5);
        
//         // Create a table-like structure for employee details
//         const employeeDetails = [
//           { label: 'Employee ID', value: payslipData.empId },
//           { label: 'Employee Name', value: payslipData.empName },
//           { label: 'Department', value: payslipData.department },
//           { label: 'Designation', value: payslipData.designation },
//           { label: 'PF Number', value: payslipData.pfNo },
//           { label: 'UAN Number', value: payslipData.uanNo },
//           { label: 'PAN Number', value: payslipData.panNo }
//         ];
        
//         // Layout employee details in two columns
//         const detailsColumnWidth = (doc.page.width - 100) / 2;
//         let currentY = doc.y;
        
//         employeeDetails.forEach((detail, index) => {
//           const column = index % 2;
//           const xPos = 50 + (column * detailsColumnWidth);
          
//           if (index % 2 === 0 && index > 0) {
//             currentY += 20;
//           }
          
//           doc.fontSize(10)
//              .text(`${detail.label}:`, xPos, currentY, { width: 100, continued: true })
//              .fontSize(10)
//              .text(detail.value || 'N/A', { width: detailsColumnWidth - 100 });
//         });
        
//         doc.moveDown(2);
        
//         // Add a horizontal line
//         doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
//         doc.moveDown();
        
//         // Attendance details
//         doc.fontSize(14).text('Attendance Details', { underline: true });
//         doc.moveDown(0.5);
        
//         const attendanceDetails = [
//           { label: 'Total Days', value: payslipData.payableDays },
//           { label: 'LOP Days', value: payslipData.lopDays },
//           { label: 'Working Days', value: payslipData.payableDays - payslipData.lopDays }
//         ];
        
//         currentY = doc.y;
//         attendanceDetails.forEach((detail, index) => {
//           doc.fontSize(10)
//              .text(`${detail.label}:`, 50, currentY, { width: 100, continued: true })
//              .fontSize(10)
//              .text(detail.value || 'N/A', { width: detailsColumnWidth - 100 });
//           currentY += 20;
//         });
        
//         doc.moveDown(1);
        
//         // Earnings and Deductions in two columns
//         const columnWidth = (doc.page.width - 100) / 2;
        
//         // Earnings column
//         doc.fontSize(14).text('Earnings', 50, doc.y, { underline: true });
//         doc.moveDown(0.5);
        
//         // Basic pay
//         doc.fontSize(10)
//            .text('Basic Pay:', 50, doc.y, { width: columnWidth / 2, continued: true })
//            .text(`Rs. ${(payslipData.basicPay * (payslipData.payableDays - payslipData.lopDays) / payslipData.payableDays).toFixed(2)}`, { align: 'right' });
        
//         // Allowances
//         let totalEarnings = (payslipData.basicPay * (payslipData.payableDays - payslipData.lopDays) / payslipData.payableDays);
        
//         if (payslipData.allowances && payslipData.allowances.length > 0) {
//           payslipData.allowances.forEach(allowance => {
//             doc.fontSize(10)
//                .text(`${allowance.name}:`, 50, doc.y, { width: columnWidth / 2, continued: true })
//                .text(`Rs. ${parseFloat(allowance.amount).toFixed(2)}`, { align: 'right' });
//             totalEarnings += parseFloat(allowance.amount);
//           });
//         }
        
//         // Total earnings
//         doc.moveDown(0.5);
//         doc.fontSize(10)
//            .text('Total Earnings:', 50, doc.y, { width: columnWidth / 2, continued: true, bold: true })
//            .fontSize(12)
//            .text(`Rs. ${totalEarnings.toFixed(2)}`, { align: 'right', bold: true });
        
//         // Save the Y position after earnings
//         const earningsEndY = doc.y;
        
//         // Deductions column
//         doc.fontSize(14).text('Deductions', 50 + columnWidth, doc.y - earningsEndY + doc.y - 14, { underline: true });
//         doc.moveDown(0.5);
        
//         // Deductions
//         let totalDeductions = 0;
        
//         if (payslipData.deductions && payslipData.deductions.length > 0) {
//           payslipData.deductions.forEach(deduction => {
//             doc.fontSize(10)
//                .text(`${deduction.name}:`, 50 + columnWidth, doc.y, { width: columnWidth / 2, continued: true })
//                .text(`Rs. ${parseFloat(deduction.amount).toFixed(2)}`, { align: 'right' });
//             totalDeductions += parseFloat(deduction.amount);
//           });
//         }
        
//         // Total deductions
//         doc.moveDown(0.5);
//         doc.fontSize(10)
//            .text('Total Deductions:', 50 + columnWidth, doc.y, { width: columnWidth / 2, continued: true, bold: true })
//            .fontSize(12)
//            .text(`Rs. ${totalDeductions.toFixed(2)}`, { align: 'right', bold: true });
        
//         // Move to the bottom of both columns
//         doc.y = Math.max(doc.y, earningsEndY);
//         doc.moveDown(2);
        
//         // Add a horizontal line
//         doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
//         doc.moveDown();
        
//         // Net Salary
//         const netSalary = totalEarnings - totalDeductions;
//         doc.fontSize(14).text('Net Salary', { underline: true });
//         doc.moveDown(0.5);
        
//         doc.fontSize(12)
//            .text('Net Salary:', 50, doc.y, { width: 100, continued: true })
//            .fontSize(16)
//            .text(`Rs. ${netSalary.toFixed(2)}`, { bold: true });
        
//         // Add bank details
//         doc.moveDown(1);
//         doc.fontSize(12).text('Bank Details', { underline: true });
//         doc.moveDown(0.5);
        
//         if (payslipData.bankDetails) {
//           doc.fontSize(10)
//              .text(`Bank Name: ${payslipData.bankDetails.bankName || 'N/A'}`);
//           doc.fontSize(10)
//              .text(`Account Number: ${payslipData.bankDetails.accountNo || 'N/A'}`);
//         }
        
//         // Add footer
//         doc.moveDown(2);
//         doc.fontSize(8)
//            .text('This is a computer-generated document. No signature is required.', { align: 'center' });
//         doc.fontSize(8)
//            .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
        
//         // Finalize the PDF
//         doc.end();
        
//         // When the stream is finished, resolve with the file path
//         stream.on('finish', () => {
//           resolve(filePath);
//         });
        
//         stream.on('error', (error) => {
//           reject(error);
//         });
        
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }
// }


// -------------------------3 chat gpt--------------------------
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
//         const formatCurrency = (amount) => `₹ ${parseFloat(amount).toFixed(2)}`;

//         // Add company header
//         doc.fontSize(22).fillColor('#000080').font('Helvetica-Bold')
//            .text('DB4Cloud Technologies Pvt Ltd', { align: 'center' });

//         doc.fontSize(16).fillColor('#333333').text('SALARY SLIP', { align: 'center' });

//         doc.fontSize(12).fillColor('#555555')
//            .text(`For the month of ${new Date(payslipData.year, payslipData.month - 1).toLocaleString('default', { month: 'long' })} ${payslipData.year}`, { align: 'center' });

//         // Employee details section
//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//            .text('EMPLOYEE DETAILS', 50, 130);

//         doc.fontSize(10).fillColor('#333333').font('Helvetica')
//            .text(`Employee ID: ${payslipData.empId}`, 50, 150)
//            .text(`Employee Name: ${payslipData.empName}`, 300, 150)
//            .text(`Department: ${payslipData.department}`, 50, 170)
//            .text(`Designation: ${payslipData.designation}`, 300, 170)
//            .text(`Bank Account: ${payslipData.bankDetails?.accountNo || 'N/A'}`, 50, 190);

//         // Earnings and Deductions Table
//         let earningsY = 230;
//         let totalEarnings = 0, totalDeductions = 0;

//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//            .text('EARNINGS', 50, earningsY).text('DEDUCTIONS', 300, earningsY);

//         earningsY += 20;
//         const earnings = [{ name: 'Basic Pay', amount: payslipData.basicPay }, ...payslipData.allowances || []];
//         const deductions = payslipData.deductions || [];

//         earnings.forEach((item, i) => {
//           doc.fontSize(10).fillColor('#333333').text(`${item.name}: ${formatCurrency(item.amount)}`, 50, earningsY + (i * 20));
//           totalEarnings += parseFloat(item.amount);
//         });

//         deductions.forEach((item, i) => {
//           doc.fontSize(10).fillColor('#333333').text(`${item.name}: ${formatCurrency(item.amount)}`, 300, earningsY + (i * 20));
//           totalDeductions += parseFloat(item.amount);
//         });

//         earningsY += Math.max(earnings.length, deductions.length) * 20;
//         doc.fontSize(12).fillColor('#000080').text(`Total Earnings: ${formatCurrency(totalEarnings)}`, 50, earningsY);
//         doc.text(`Total Deductions: ${formatCurrency(totalDeductions)}`, 300, earningsY);

//         // Net Salary
//         const netSalary = totalEarnings - totalDeductions;
//         doc.fontSize(14).fillColor('#000080').font('Helvetica-Bold')
//            .text(`NET SALARY: ${formatCurrency(netSalary)}`, 50, earningsY + 40);

//         doc.end();
//         stream.on('finish', () => resolve(filePath));
//         stream.on('error', (err) => reject(err));
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }
// }



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
//         const formatCurrency = (amount) => `₹ ${parseFloat(amount).toFixed(2)}`;

//         /** -------------------- HEADER -------------------- **/
//         doc.fontSize(22).fillColor('#000080').font('Helvetica-Bold')
//            .text('DB4Cloud Technologies Pvt Ltd', { align: 'center' });

//         doc.moveDown(0.5)
//            .fontSize(16).fillColor('#333333').text('SALARY SLIP', { align: 'center' });

//         doc.moveDown(0.3)
//            .fontSize(12).fillColor('#555555')
//            .text(`For the month of ${new Date(payslipData.year, payslipData.month - 1).toLocaleString('default', { month: 'long' })} ${payslipData.year}`, { align: 'center' });

//         doc.moveDown(1);

//         /** -------------------- EMPLOYEE DETAILS -------------------- **/
//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//            .text('EMPLOYEE DETAILS', 50, doc.y);

//         doc.moveDown(0.5).fontSize(10).fillColor('#333333').font('Helvetica')
//            .text(`Employee ID: ${payslipData.empId}`, 50, doc.y)
//            .text(`Employee Name: ${payslipData.empName}`, 300, doc.y)
//            .moveDown(0.3)
//            .text(`Department: ${payslipData.department}`, 50, doc.y)
//            .text(`Designation: ${payslipData.designation}`, 300, doc.y)
//            .moveDown(0.3)
//            .text(`Bank Account: ${payslipData.bankDetails?.accountNo || 'N/A'}`, 50, doc.y);

//         doc.moveDown(1);

//         /** -------------------- EARNINGS & DEDUCTIONS -------------------- **/
//         let earningsY = doc.y;
//         let totalEarnings = 0, totalDeductions = 0;

//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//            .text('EARNINGS', 50, earningsY)
//            .text('DEDUCTIONS', 300, earningsY);

//         earningsY += 20;

//         const earnings = [{ name: 'Basic Pay', amount: payslipData.basicPay }, ...(payslipData.allowances || [])];
//         const deductions = payslipData.deductions || [];

//         const maxRows = Math.max(earnings.length, deductions.length);

//         for (let i = 0; i < maxRows; i++) {
//           if (earnings[i]) {
//             doc.fontSize(10).fillColor('#333333')
//                .text(`${earnings[i].name}: ${formatCurrency(earnings[i].amount)}`, 50, earningsY + (i * 20));
//             totalEarnings += parseFloat(earnings[i].amount);
//           }
//           if (deductions[i]) {
//             doc.fontSize(10).fillColor('#333333')
//                .text(`${deductions[i].name}: ${formatCurrency(deductions[i].amount)}`, 300, earningsY + (i * 20));
//             totalDeductions += parseFloat(deductions[i].amount);
//           }
//         }

//         earningsY += maxRows * 20;

//         /** -------------------- TOTALS -------------------- **/
//         doc.moveDown(0.5)
//            .fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//            .text(`Total Earnings: ${formatCurrency(totalEarnings)}`, 50, earningsY)
//            .text(`Total Deductions: ${formatCurrency(totalDeductions)}`, 300, earningsY);

//         /** -------------------- NET SALARY -------------------- **/
//         const netSalary = totalEarnings - totalDeductions;

//         doc.moveDown(1)
//            .fontSize(14).fillColor('#000080').font('Helvetica-Bold')
//            .text(`NET SALARY: ${formatCurrency(netSalary)}`, 50, earningsY + 40);

//         doc.end();
//         stream.on('finish', () => resolve(filePath));
//         stream.on('error', (err) => reject(err));
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }
// }





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

//         /** -------------------- HEADER -------------------- **/
//         doc.fontSize(22).fillColor('#000080').font('Helvetica-Bold')
//            .text('DB4Cloud Technologies Pvt Ltd', { align: 'center' });

//         doc.moveDown(0.5)
//            .fontSize(16).fillColor('#333333').text('SALARY SLIP', { align: 'center' });

//         doc.moveDown(0.3)
//            .fontSize(12).fillColor('#555555')
//            .text(`For the month of ${new Date(payslipData.year, payslipData.month - 1).toLocaleString('default', { month: 'long' })} ${payslipData.year}`, { align: 'center' });

//         doc.moveDown(1);

//         /** -------------------- EMPLOYEE DETAILS -------------------- **/
//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//            .text('EMPLOYEE DETAILS', 50, doc.y);

//         doc.moveDown(0.5).fontSize(10).fillColor('#333333').font('Helvetica')
//            .text(`Employee ID: ${payslipData.empId}`, 50, doc.y)
//            .text(`Employee Name: ${payslipData.empName}`, 300, doc.y)
//            .moveDown(0.3)
//            .text(`Department: ${payslipData.department}`, 50, doc.y)
//            .text(`Designation: ${payslipData.designation}`, 300, doc.y)
//            .moveDown(0.3)
//            .text(`Bank Account: ${payslipData.bankDetails?.accountNo || 'N/A'}`, 50, doc.y);

//         doc.moveDown(1);

//         /** -------------------- EARNINGS & DEDUCTIONS -------------------- **/
//         let earningsY = doc.y;
//         let totalEarnings = 0, totalDeductions = 0;

//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//            .text('EARNINGS', 50, earningsY)
//            .text('DEDUCTIONS', 300, earningsY);

//         earningsY += 20;

//         const earnings = [{ name: 'Basic Pay', amount: payslipData.basicPay }, ...(payslipData.allowances || [])];
//         const deductions = payslipData.deductions || [];

//         const maxRows = Math.max(earnings.length, deductions.length);

//         for (let i = 0; i < maxRows; i++) {
//           if (earnings[i]) {
//             doc.fontSize(10).fillColor('#333333')
//                .text(`${earnings[i].name}: ${formatCurrency(earnings[i].amount)}`, 50, earningsY + (i * 20));
//             totalEarnings += parseFloat(earnings[i].amount);
//           }
//           if (deductions[i]) {
//             doc.fontSize(10).fillColor('#333333')
//                .text(`${deductions[i].name}: ${formatCurrency(deductions[i].amount)}`, 300, earningsY + (i * 20));
//             totalDeductions += parseFloat(deductions[i].amount);
//           }
//         }

//         earningsY += maxRows * 20;

//         /** -------------------- TOTALS -------------------- **/
//         doc.moveDown(0.5)
//            .fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//            .text(`Total Earnings: ${formatCurrency(totalEarnings)}`, 50, earningsY)
//            .text(`Total Deductions: ${formatCurrency(totalDeductions)}`, 300, earningsY);

//         /** -------------------- NET SALARY -------------------- **/
//         const netSalary = totalEarnings - totalDeductions;

//         doc.moveDown(1)
//            .fontSize(14).fillColor('#000080').font('Helvetica-Bold')
//            .text(`NET SALARY: ${formatCurrency(netSalary)}`, 50, earningsY + 40);

//         doc.end();
//         stream.on('finish', () => resolve(filePath));
//         stream.on('error', (err) => reject(err));
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }
// }

//--------------------------------final---------------------
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
//         const { empId, empName, department, designation, bankDetails, basicPay, allowances, deductions, presentDays, workingDays, month, year } = payslipData;
        
//         // Get total days in the month
//         const totalDaysInMonth = new Date(year, month, 0).getDate();
//         const effectiveWorkingDays = workingDays || totalDaysInMonth;
//         const effectivePresentDays = presentDays || effectiveWorkingDays;

//         // Prorate Basic Pay
//         const proratedBasicPay = (parseFloat(basicPay) / effectiveWorkingDays) * effectivePresentDays;

//         /** -------------------- HEADER -------------------- **/
//         doc.fontSize(22).fillColor('#000080').font('Helvetica-Bold')
//           .text('DB4Cloud Technologies Pvt Ltd', { align: 'center' });

//         doc.moveDown(0.5)
//           .fontSize(16).fillColor('#333333').text('SALARY SLIP', { align: 'center' });

//         doc.moveDown(0.3)
//           .fontSize(12).fillColor('#555555')
//           .text(`For the month of ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`, { align: 'center' });

//         doc.moveDown(1);

//         /** -------------------- EMPLOYEE DETAILS -------------------- **/
//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text('EMPLOYEE DETAILS', 50, doc.y);

//         doc.moveDown(0.5).fontSize(10).fillColor('#333333').font('Helvetica')
//           .text(`Employee ID: ${empId}`, 50, doc.y)
//           .text(`Employee Name: ${empName}`, 300, doc.y)
//           .moveDown(0.3)
//           .text(`Department: ${department}`, 50, doc.y)
//           .text(`Designation: ${designation}`, 300, doc.y)
//           .moveDown(0.3)
//           .text(`Bank Account: ${bankDetails?.accountNo || 'N/A'}`, 50, doc.y)
//           .moveDown(0.3)
//           .text(`Present Days: ${effectivePresentDays}`, 50, doc.y)
//           .text(`Working Days: ${effectiveWorkingDays}`, 300, doc.y);

//         doc.moveDown(1);

//         /** -------------------- EARNINGS & DEDUCTIONS -------------------- **/
//         let earningsY = doc.y;
//         let totalEarnings = 0, totalDeductions = 0;

//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text('EARNINGS', 50, earningsY)
//           .text('DEDUCTIONS', 300, earningsY);

//         earningsY += 20;

//         const earnings = [{ name: 'Basic Pay', amount: proratedBasicPay }, ...(allowances || [])];
//         const deductionsList = deductions || [];

//         const maxRows = Math.max(earnings.length, deductionsList.length);

//         for (let i = 0; i < maxRows; i++) {
//           if (earnings[i]) {
//             doc.fontSize(10).fillColor('#333333')
//               .text(`${earnings[i].name}: ${formatCurrency(earnings[i].amount)}`, 50, earningsY + (i * 20));
//             totalEarnings += parseFloat(earnings[i].amount);
//           }
//           if (deductionsList[i]) {
//             doc.fontSize(10).fillColor('#333333')
//               .text(`${deductionsList[i].name}: ${formatCurrency(deductionsList[i].amount)}`, 300, earningsY + (i * 20));
//             totalDeductions += parseFloat(deductionsList[i].amount);
//           }
//         }

//         earningsY += maxRows * 20;

//         /** -------------------- TOTALS -------------------- **/
//         doc.moveDown(0.5)
//           .fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text(`Total Earnings: ${formatCurrency(totalEarnings)}`, 50, earningsY)
//           .text(`Total Deductions: ${formatCurrency(totalDeductions)}`, 300, earningsY);

//         /** -------------------- NET SALARY -------------------- **/
//         const netSalary = totalEarnings - totalDeductions;

//         doc.moveDown(1)
//           .fontSize(14).fillColor('#000080').font('Helvetica-Bold')
//           .text(`NET SALARY: ${formatCurrency(netSalary)}`, 50, earningsY + 40);

//         doc.end();
//         stream.on('finish', () => resolve(filePath));
//         stream.on('error', (err) => reject(err));
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }
// }



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
//         const { empId, empName, department, designation, bankDetails, basicPay, allowances, deductions, month, year } = payslipData;
        
//         // Calculate working days and present days
//         const totalDaysInMonth = new Date(year, month, 0).getDate();
//         const workingDays = payslipData.workingDays || totalDaysInMonth;
//         const presentDays = payslipData.presentDays || workingDays;
//         const lopDays = workingDays - presentDays;

//         // Calculate prorated basic pay
//         const proratedBasicPay = parseFloat(basicPay) * (presentDays / workingDays);

//         /** -------------------- HEADER -------------------- **/
//         doc.fontSize(22).fillColor('#000080').font('Helvetica-Bold')
//           .text('DB4Cloud Technologies Pvt Ltd', { align: 'center' });

//         doc.moveDown(0.5)
//           .fontSize(16).fillColor('#333333').text('SALARY SLIP', { align: 'center' });

//         doc.moveDown(0.3)
//           .fontSize(12).fillColor('#555555')
//           .text(`For the month of ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`, { align: 'center' });

//         doc.moveDown(1);

//         /** -------------------- EMPLOYEE DETAILS -------------------- **/
//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text('EMPLOYEE DETAILS', 50, doc.y);

//         doc.moveDown(0.5).fontSize(10).fillColor('#333333').font('Helvetica')
//           .text(`Employee ID: ${empId}`, 50, doc.y)
//           .text(`Employee Name: ${empName}`, 300, doc.y)
//           .moveDown(0.3)
//           .text(`Department: ${department}`, 50, doc.y)
//           .text(`Designation: ${designation}`, 300, doc.y)
//           .moveDown(0.3)
//           .text(`Bank Account: ${bankDetails?.accountNo || 'N/A'}`, 50, doc.y)
//           .moveDown(0.3)
//           .text(`Present Days: ${presentDays}`, 50, doc.y)
//           .text(`Working Days: ${workingDays}`, 300, doc.y)
//           .moveDown(0.3)
//           .text(`LOP Days: ${lopDays}`, 50, doc.y);

//         doc.moveDown(1);

//         /** -------------------- EARNINGS & DEDUCTIONS -------------------- **/
//         let earningsY = doc.y;
//         let totalEarnings = 0, totalDeductions = 0;

//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text('EARNINGS', 50, earningsY)
//           .text('DEDUCTIONS', 300, earningsY);

//         earningsY += 20;

//         // Process earnings with prorated calculations
//         const earnings = [{ name: 'Basic Pay', amount: proratedBasicPay }];
        
//         // Process allowances with prorated calculations
//         if (allowances && allowances.length > 0) {
//           allowances.forEach(allowance => {
//             // Prorate each allowance based on attendance
//             const proratedAmount = parseFloat(allowance.amount) * (presentDays / workingDays);
//             earnings.push({ 
//               name: allowance.name, 
//               amount: proratedAmount 
//             });
//           });
//         }
        
//         const deductionsList = deductions || [];

//         const maxRows = Math.max(earnings.length, deductionsList.length);

//         for (let i = 0; i < maxRows; i++) {
//           if (earnings[i]) {
//             doc.fontSize(10).fillColor('#333333')
//               .text(`${earnings[i].name}: ${formatCurrency(earnings[i].amount)}`, 50, earningsY + (i * 20));
//             totalEarnings += parseFloat(earnings[i].amount);
//           }
//           if (deductionsList[i]) {
//             doc.fontSize(10).fillColor('#333333')
//               .text(`${deductionsList[i].name}: ${formatCurrency(deductionsList[i].amount)}`, 300, earningsY + (i * 20));
//             totalDeductions += parseFloat(deductionsList[i].amount);
//           }
//         }

//         earningsY += maxRows * 20;

//         /** -------------------- TOTALS -------------------- **/
//         doc.moveDown(0.5)
//           .fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text(`Total Earnings: ${formatCurrency(totalEarnings)}`, 50, earningsY)
//           .text(`Total Deductions: ${formatCurrency(totalDeductions)}`, 300, earningsY);

//         /** -------------------- NET SALARY -------------------- **/
//         const netSalary = totalEarnings - totalDeductions;

//         doc.moveDown(1)
//           .fontSize(14).fillColor('#000080').font('Helvetica-Bold')
//           .text(`NET SALARY: ${formatCurrency(netSalary)}`, 50, earningsY + 40);

//         doc.end();
//         stream.on('finish', () => resolve(filePath));
//         stream.on('error', (err) => reject(err));
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }
// }


// //.....................56789...................
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
//         const { empId, empName, department, designation, bankDetails, basicPay, allowances, deductions, month, year } = payslipData;
        
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
//         doc.fontSize(22).fillColor('#000080').font('Helvetica-Bold')
//           .text('DB4Cloud Technologies Pvt Ltd', { align: 'center' });

//         doc.moveDown(0.5)
//           .fontSize(16).fillColor('#333333').text('SALARY SLIP', { align: 'center' });

//         doc.moveDown(0.3)
//           .fontSize(12).fillColor('#555555')
//           .text(`For the month of ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`, { align: 'center' });

//         doc.moveDown(1);

//         /** -------------------- EMPLOYEE DETAILS -------------------- **/
//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text('EMPLOYEE DETAILS', 50, doc.y);

//         doc.moveDown(0.5).fontSize(10).fillColor('#333333').font('Helvetica')
//           .text(`Employee ID: ${empId}`, 50, doc.y)
//           .text(`Employee Name: ${empName}`, 300, doc.y)
//           .moveDown(0.3)
//           .text(`Department: ${department}`, 50, doc.y)
//           .text(`Designation: ${designation}`, 300, doc.y)
//           .moveDown(0.3)
//           .text(`Bank Account: ${bankDetails?.accountNo || 'N/A'}`, 50, doc.y)
//           .moveDown(0.3)
//           .text(`Working Days: ${workingDays}`, 50, doc.y)
//           .text(`LOP Days: ${lopDays}`, 300, doc.y)
//           .moveDown(0.3)
//           .text(`Payable Days: ${effectiveWorkingDays}`, 50, doc.y);

//         doc.moveDown(1);

//         /** -------------------- EARNINGS & DEDUCTIONS -------------------- **/
//         let earningsY = doc.y;
//         let totalEarnings = 0, totalDeductions = 0;

//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text('EARNINGS', 50, earningsY)
//           .text('DEDUCTIONS', 300, earningsY);

//         earningsY += 20;

//         // Process earnings with LOP adjustment
//         const earnings = [{ name: 'Basic Pay', amount: salaryAfterLOP }];
        
//         // Process allowances with LOP adjustment
//         if (allowances && allowances.length > 0) {
//           allowances.forEach(allowance => {
//             // Adjust allowance based on LOP
//             const allowanceAmount = parseFloat(allowance.amount);
//             const adjustedAllowance = (allowanceAmount / workingDays) * effectiveWorkingDays;
            
//             earnings.push({ 
//               name: allowance.name, 
//               amount: adjustedAllowance 
//             });
//           });
//         }
        
//         const deductionsList = deductions || [];

//         const maxRows = Math.max(earnings.length, deductionsList.length);

//         for (let i = 0; i < maxRows; i++) {
//           if (earnings[i]) {
//             doc.fontSize(10).fillColor('#333333')
//               .text(`${earnings[i].name}: ${formatCurrency(earnings[i].amount)}`, 50, earningsY + (i * 20));
//             totalEarnings += parseFloat(earnings[i].amount);
//           }
//           if (deductionsList[i]) {
//             doc.fontSize(10).fillColor('#333333')
//               .text(`${deductionsList[i].name}: ${formatCurrency(deductionsList[i].amount)}`, 300, earningsY + (i * 20));
//             totalDeductions += parseFloat(deductionsList[i].amount);
//           }
//         }

//         earningsY += maxRows * 20;

//         /** -------------------- TOTALS -------------------- **/
//         doc.moveDown(0.5)
//           .fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text(`Total Earnings: ${formatCurrency(totalEarnings)}`, 50, earningsY)
//           .text(`Total Deductions: ${formatCurrency(totalDeductions)}`, 300, earningsY);

//         /** -------------------- NET SALARY -------------------- **/
//         const netSalary = totalEarnings - totalDeductions;

//         doc.moveDown(1)
//           .fontSize(14).fillColor('#000080').font('Helvetica-Bold')
//           .text(`NET SALARY: ${formatCurrency(netSalary)}`, 50, earningsY + 40);

//         doc.end();
//         stream.on('finish', () => resolve(filePath));
//         stream.on('error', (err) => reject(err));
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }
// }


//.....................calculation fix......................
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
//         const { empId, empName, department, designation, bankDetails, basicPay, allowances, deductions, month, year } = payslipData;
        
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
//         doc.fontSize(22).fillColor('#000080').font('Helvetica-Bold')
//           .text('DB4Cloud Technologies Pvt Ltd', { align: 'center' });

//         doc.moveDown(0.5)
//           .fontSize(16).fillColor('#333333').text('SALARY SLIP', { align: 'center' });

//         doc.moveDown(0.3)
//           .fontSize(12).fillColor('#555555')
//           .text(`For the month of ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`, { align: 'center' });

//         doc.moveDown(1);

//         /** -------------------- EMPLOYEE DETAILS -------------------- **/
//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text('EMPLOYEE DETAILS', 50, doc.y);

//         doc.moveDown(0.5).fontSize(10).fillColor('#333333').font('Helvetica')
//           .text(`Employee ID: ${empId}`, 50, doc.y)
//           .text(`Employee Name: ${empName}`, 300, doc.y)
//           .moveDown(0.3)
//           .text(`Department: ${department}`, 50, doc.y)
//           .text(`Designation: ${designation}`, 300, doc.y)
//           .moveDown(0.3)
//           .text(`Bank Account: ${bankDetails?.accountNo || 'N/A'}`, 50, doc.y)
//           .moveDown(0.3)
//           .text(`Working Days: ${workingDays}`, 50, doc.y)
//           .text(`LOP Days: ${lopDays}`, 300, doc.y)
//           .moveDown(0.3)
//           .text(`Payable Days: ${effectiveWorkingDays}`, 50, doc.y);

//         doc.moveDown(1);

//         /** -------------------- EARNINGS & DEDUCTIONS -------------------- **/
//         let earningsY = doc.y;
//         let totalEarnings = 0, totalDeductions = 0;

//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text('EARNINGS', 50, earningsY)
//           .text('DEDUCTIONS', 300, earningsY);

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

//         for (let i = 0; i < maxRows; i++) {
//           if (earnings[i]) {
//             doc.fontSize(10).fillColor('#333333')
//               .text(`${earnings[i].name}: ${formatCurrency(earnings[i].amount)}`, 50, earningsY + (i * 20));
//             totalEarnings += parseFloat(earnings[i].amount);
//           }
//           if (deductionsList[i]) {
//             doc.fontSize(10).fillColor('#333333')
//               .text(`${deductionsList[i].name}: ${formatCurrency(deductionsList[i].amount)}`, 300, earningsY + (i * 20));
//             totalDeductions += parseFloat(deductionsList[i].amount);
//           }
//         }

//         earningsY += maxRows * 20;

//         /** -------------------- TOTALS -------------------- **/
//         doc.moveDown(0.5)
//           .fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text(`Total Earnings: ${formatCurrency(totalEarnings)}`, 50, earningsY)
//           .text(`Total Deductions: ${formatCurrency(totalDeductions)}`, 300, earningsY);

//         /** -------------------- NET SALARY -------------------- **/
//         const netSalary = totalEarnings - totalDeductions;

//         doc.moveDown(1)
//           .fontSize(14).fillColor('#000080').font('Helvetica-Bold')
//           .text(`NET SALARY: ${formatCurrency(netSalary)}`, 50, earningsY + 40);

//         doc.end();
//         stream.on('finish', () => resolve(filePath));
//         stream.on('error', (err) => reject(err));
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }
// }

 

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
//         doc.fontSize(22).fillColor('#000080').font('Helvetica-Bold')
//           .text('DB4Cloud Technologies Pvt Ltd', { align: 'center' });

//         doc.moveDown(0.5)
//           .fontSize(16).fillColor('#333333').text('SALARY SLIP', { align: 'center' });

//         doc.moveDown(0.3)
//           .fontSize(12).fillColor('#555555')
//           .text(`For the month of ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`, { align: 'center' });

//         doc.moveDown(1);

//         /** -------------------- EMPLOYEE DETAILS -------------------- **/
//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text('EMPLOYEE DETAILS', 50, doc.y);
        
//         doc.moveDown(0.5);
        
//         // Left side employee details
//         const leftColumnX = 50;
//         const rightColumnX = 300;
//         let detailsY = doc.y;
        
//         // Employee ID and Name
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('Employee ID:', leftColumnX, detailsY);
//         doc.font('Helvetica').text(empId || 'N/A', leftColumnX + 100, detailsY);
        
//         detailsY += 20;
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('Employee Name:', leftColumnX, detailsY);
//         doc.font('Helvetica').text(empName || 'N/A', leftColumnX + 100, detailsY);
        
//         detailsY += 20;
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('Department:', leftColumnX, detailsY);
//         doc.font('Helvetica').text(department || 'N/A', leftColumnX + 100, detailsY);
        
//         detailsY += 20;
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('Designation:', leftColumnX, detailsY);
//         doc.font('Helvetica').text(designation || 'N/A', leftColumnX + 100, detailsY);
        
//         detailsY += 20;
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('Bank Name:', leftColumnX, detailsY);
//         doc.font('Helvetica').text(bankDetails?.bankName || 'N/A', leftColumnX + 100, detailsY);
        
//         detailsY += 20;
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('Bank A/C No.:', leftColumnX, detailsY);
//         doc.font('Helvetica').text(bankDetails?.accountNo || 'N/A', leftColumnX + 100, detailsY);
        
//         detailsY += 20;
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('PF Number:', leftColumnX, detailsY);
//         doc.font('Helvetica').text(pfNo || 'N/A', leftColumnX + 100, detailsY);
        
//         detailsY += 20;
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('PAN Number:', leftColumnX, detailsY);
//         doc.font('Helvetica').text(panNo || 'N/A', leftColumnX + 100, detailsY);
        
//         // Right side - Attendance details
//         detailsY = doc.y - 140; // Start at the same height as left column
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('Working Days:', rightColumnX, detailsY);
//         doc.font('Helvetica').text(workingDays.toString(), rightColumnX + 100, detailsY);
        
//         detailsY += 20;
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('LOP Days:', rightColumnX, detailsY);
//         doc.font('Helvetica').text(lopDays.toString(), rightColumnX + 100, detailsY);
        
//         detailsY += 20;
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('Payable Days:', rightColumnX, detailsY);
//         doc.font('Helvetica').text(effectiveWorkingDays.toString(), rightColumnX + 100, detailsY);

//         doc.moveDown(3); // Add some space after employee details

//         /** -------------------- EARNINGS & DEDUCTIONS -------------------- **/
//         let earningsY = doc.y;
//         let totalEarnings = 0, totalDeductions = 0;

//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text('EARNINGS', 50, earningsY)
//           .text('DEDUCTIONS', 300, earningsY);

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

//         for (let i = 0; i < maxRows; i++) {
//           if (earnings[i]) {
//             doc.fontSize(10).fillColor('#333333')
//               .text(`${earnings[i].name}: ${formatCurrency(earnings[i].amount)}`, 50, earningsY + (i * 20));
//             totalEarnings += parseFloat(earnings[i].amount);
//           }
//           if (deductionsList[i]) {
//             doc.fontSize(10).fillColor('#333333')
//               .text(`${deductionsList[i].name}: ${formatCurrency(deductionsList[i].amount)}`, 300, earningsY + (i * 20));
//             totalDeductions += parseFloat(deductionsList[i].amount);
//           }
//         }

//         earningsY += maxRows * 20;

//         /** -------------------- TOTALS -------------------- **/
//         doc.moveDown(0.5)
//           .fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text(`Total Earnings: ${formatCurrency(totalEarnings)}`, 50, earningsY)
//           .text(`Total Deductions: ${formatCurrency(totalDeductions)}`, 300, earningsY);

//         /** -------------------- NET SALARY -------------------- **/
//         const netSalary = totalEarnings - totalDeductions;

//         doc.moveDown(1)
//           .fontSize(14).fillColor('#000080').font('Helvetica-Bold')
//           .text(`NET SALARY: ${formatCurrency(netSalary)}`, 50, earningsY + 40);

//         doc.end();
//         stream.on('finish', () => resolve(filePath));
//         stream.on('error', (err) => reject(err));
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }
// }

//...................upeer format is good...............
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
//         doc.fontSize(22).fillColor('#000080').font('Helvetica-Bold')
//           .text('DB4Cloud Technologies Pvt Ltd', { align: 'center' });

//         doc.moveDown(0.5)
//           .fontSize(16).fillColor('#333333').text('SALARY SLIP', { align: 'center' });

//         doc.moveDown(0.3)
//           .fontSize(12).fillColor('#555555')
//           .text(`For the month of ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`, { align: 'center' });

//         doc.moveDown(1);

//         /** -------------------- EMPLOYEE DETAILS -------------------- **/
//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text('EMPLOYEE DETAILS', 50, doc.y);
        
//         doc.moveDown(0.5);
        
//         // Define columns
//         const leftColumnX = 50;
//         const rightColumnX = 300;
//         let detailsY = doc.y;
        
//         // Left column details (4 items)
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('Employee ID:', leftColumnX, detailsY);
//         doc.font('Helvetica').text(empId || 'N/A', leftColumnX + 100, detailsY);
        
//         detailsY += 20;
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('Employee Name:', leftColumnX, detailsY);
//         doc.font('Helvetica').text(empName || 'N/A', leftColumnX + 100, detailsY);
        
//         detailsY += 20;
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('Department:', leftColumnX, detailsY);
//         doc.font('Helvetica').text(department || 'N/A', leftColumnX + 100, detailsY);
        
//         detailsY += 20;
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('Designation:', leftColumnX, detailsY);
//         doc.font('Helvetica').text(designation || 'N/A', leftColumnX + 100, detailsY);
        
//         // Right column details (4 items)
//         let rightDetailsY = doc.y - 60; // Start at the same height as left column
        
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('Bank Name:', rightColumnX, rightDetailsY);
//         doc.font('Helvetica').text(bankDetails?.bankName || 'N/A', rightColumnX + 100, rightDetailsY);
        
//         rightDetailsY += 20;
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('Bank A/C No.:', rightColumnX, rightDetailsY);
//         doc.font('Helvetica').text(bankDetails?.accountNo || 'N/A', rightColumnX + 100, rightDetailsY);
        
//         rightDetailsY += 20;
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('PF Number:', rightColumnX, rightDetailsY);
//         doc.font('Helvetica').text(pfNo || 'N/A', rightColumnX + 100, rightDetailsY);
        
//         rightDetailsY += 20;
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('PAN Number:', rightColumnX, rightDetailsY);
//         doc.font('Helvetica').text(panNo || 'N/A', rightColumnX + 100, rightDetailsY);
        
//         // Move to next section - Attendance details
//         detailsY += 40; // Add some space after employee details
        
//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text('ATTENDANCE DETAILS', 50, detailsY);
        
//         doc.moveDown(0.5);
//         detailsY = doc.y;
        
//         // Attendance details in left column
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('Working Days:', leftColumnX, detailsY);
//         doc.font('Helvetica').text(workingDays.toString(), leftColumnX + 100, detailsY);
        
//         detailsY += 20;
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('LOP Days:', leftColumnX, detailsY);
//         doc.font('Helvetica').text(lopDays.toString(), leftColumnX + 100, detailsY);
        
//         detailsY += 20;
//         doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
//           .text('Payable Days:', leftColumnX, detailsY);
//         doc.font('Helvetica').text(effectiveWorkingDays.toString(), leftColumnX + 100, detailsY);
        
//         doc.moveDown(3); // Add space before earnings/deductions

//         /** -------------------- EARNINGS & DEDUCTIONS -------------------- **/
//         let earningsY = doc.y;
//         let totalEarnings = 0, totalDeductions = 0;

//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text('EARNINGS', 50, earningsY)
//           .text('DEDUCTIONS', 300, earningsY);

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

//         for (let i = 0; i < maxRows; i++) {
//           if (earnings[i]) {
//             doc.fontSize(10).fillColor('#333333')
//               .text(`${earnings[i].name}: ${formatCurrency(earnings[i].amount)}`, 50, earningsY + (i * 20));
//             totalEarnings += parseFloat(earnings[i].amount);
//           }
//           if (deductionsList[i]) {
//             doc.fontSize(10).fillColor('#333333')
//               .text(`${deductionsList[i].name}: ${formatCurrency(deductionsList[i].amount)}`, 300, earningsY + (i * 20));
//             totalDeductions += parseFloat(deductionsList[i].amount);
//           }
//         }

//         earningsY += maxRows * 20;

//         /** -------------------- TOTALS -------------------- **/
//         doc.moveDown(0.5)
//           .fontSize(12).fillColor('#000080').font('Helvetica-Bold')
//           .text(`Total Earnings: ${formatCurrency(totalEarnings)}`, 50, earningsY)
//           .text(`Total Deductions: ${formatCurrency(totalDeductions)}`, 300, earningsY);

//         /** -------------------- NET SALARY -------------------- **/
//         const netSalary = totalEarnings - totalDeductions;

//         doc.moveDown(1)
//           .fontSize(14).fillColor('#000080').font('Helvetica-Bold')
//           .text(`NET SALARY: ${formatCurrency(netSalary)}`, 50, earningsY + 40);

//         doc.end();
//         stream.on('finish', () => resolve(filePath));
//         stream.on('error', (err) => reject(err));
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }
// }



//...............attendance added in right side....................//

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
//         doc.fontSize(22).fillColor('#000080').font('Helvetica-Bold')
//           .text('DB4Cloud Technologies Pvt Ltd', { align: 'center' });

//         doc.moveDown(0.5)
//           .fontSize(16).fillColor('#333333').text('SALARY SLIP', { align: 'center' });

//         doc.moveDown(0.3)
//           .fontSize(12).fillColor('#555555')
//           .text(`For the month of ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`, { align: 'center' });

//         doc.moveDown(1);

//         /** -------------------- EMPLOYEE DETAILS SECTION -------------------- **/
//         // Section header
//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
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
        
//         // Left column - Employee details
//         leftY = addDetailRow('Employee ID:', empId, leftColumnX, leftY);
//         leftY = addDetailRow('Employee Name:', empName, leftColumnX, leftY);
//         leftY = addDetailRow('Department:', department, leftColumnX, leftY);
//         leftY = addDetailRow('Designation:', designation, leftColumnX, leftY);
        
//         // Right column - Bank and ID details
//         rightY = addDetailRow('Bank Name:', bankDetails?.bankName, rightColumnX, rightY);
//         rightY = addDetailRow('Bank A/C No.:', bankDetails?.accountNo, rightColumnX, rightY);
//         rightY = addDetailRow('PF Number:', pfNo, rightColumnX, rightY);
//         rightY = addDetailRow('PAN Number:', panNo, rightColumnX, rightY);
        
//         // Add attendance details below PAN number in right column
//         rightY = addDetailRow('Working Days:', workingDays.toString(), rightColumnX, rightY);
//         rightY = addDetailRow('LOP Days:', lopDays.toString(), rightColumnX, rightY);
//         rightY = addDetailRow('Payable Days:', effectiveWorkingDays.toString(), rightColumnX, rightY);
        
//         // Set the document Y position to the maximum of left and right columns
//         doc.y = Math.max(leftY, rightY) + 10;

//         /** -------------------- EARNINGS & DEDUCTIONS -------------------- **/
//         let earningsY = doc.y;
//         let totalEarnings = 0, totalDeductions = 0;

//         // Section headers
//         doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
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

//         for (let i = 0; i < maxRows; i++) {
//           if (earnings[i]) {
//             doc.fontSize(10).fillColor('#333333')
//               .text(`${earnings[i].name}:`, leftColumnX, earningsY + (i * 20), { width: 150, continued: false });
//             doc.text(formatCurrency(earnings[i].amount), leftColumnX + 150, earningsY + (i * 20), { align: 'right' });
//             totalEarnings += parseFloat(earnings[i].amount);
//           }
//           if (deductionsList[i]) {
//             doc.fontSize(10).fillColor('#333333')
//               .text(`${deductionsList[i].name}:`, rightColumnX, earningsY + (i * 20), { width: 150, continued: false });
//             doc.text(formatCurrency(deductionsList[i].amount), rightColumnX + 150, earningsY + (i * 20), { align: 'right' });
//             totalDeductions += parseFloat(deductionsList[i].amount);
//           }
//         }

//         earningsY += maxRows * 20 + 10;

//         /** -------------------- TOTALS -------------------- **/
//         doc.fontSize(11).fillColor('#000080').font('Helvetica-Bold')
//           .text('Total Earnings:', leftColumnX, earningsY, { width: 150, continued: false });
//         doc.text(formatCurrency(totalEarnings), leftColumnX + 150, earningsY, { align: 'right' });
        
//         doc.fontSize(11).fillColor('#000080').font('Helvetica-Bold')
//           .text('Total Deductions:', rightColumnX, earningsY, { width: 150, continued: false });
//         doc.text(formatCurrency(totalDeductions), rightColumnX + 150, earningsY, { align: 'right' });

//         /** -------------------- NET SALARY -------------------- **/
//         const netSalary = totalEarnings - totalDeductions;

//         doc.moveDown(2);
//         doc.fontSize(14).fillColor('#000080').font('Helvetica-Bold')
//           .text('NET SALARY:', leftColumnX, doc.y, { continued: false });
//         doc.text(formatCurrency(netSalary), leftColumnX + 150, doc.y, { align: 'left' });

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
        const { empId, empName, department, designation, bankDetails, basicPay, allowances, deductions, month, year, pfNo, panNo } = payslipData;
        
        // Calculate working days and LOP days
        const totalDaysInMonth = new Date(year, month, 0).getDate();
        const workingDays = payslipData.workingDays || totalDaysInMonth;
        const lopDays = payslipData.lopDays || 0;
        const effectiveWorkingDays = workingDays - lopDays;
        
        // Calculate per day salary
        const perDaySalary = parseFloat(basicPay) / workingDays;
        
        // Calculate salary after LOP deduction
        const salaryAfterLOP = parseFloat(basicPay) - (perDaySalary * lopDays);

        /** -------------------- HEADER -------------------- **/
        doc.fontSize(22).fillColor('#000080').font('Helvetica-Bold')
          .text('DB4Cloud Technologies Pvt Ltd', { align: 'center' });

        doc.moveDown(0.5)
          .fontSize(16).fillColor('#333333').text('SALARY SLIP', { align: 'center' });

        doc.moveDown(0.3)
          .fontSize(12).fillColor('#555555')
          .text(`For the month of ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`, { align: 'center' });

        doc.moveDown(1);

        /** -------------------- EMPLOYEE DETAILS SECTION -------------------- **/
        // Section header
        doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
          .text('EMPLOYEE DETAILS', { align: 'left' });
        
        doc.moveDown(0.5);
        
        // Define columns and layout
        const leftColumnX = 50;
        const rightColumnX = 320;
        const labelWidth = 100;
        let leftY = doc.y;
        let rightY = doc.y;
        
        // Helper function to add a detail row
        const addDetailRow = (label, value, x, y) => {
          doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
             .text(label, x, y);
          doc.font('Helvetica').text(value || 'N/A', x + labelWidth, y);
          return y + 20; // Return the next Y position
        };
        
        // Distribute details evenly - 6 items on left, 5 items on right
        
        // Left column - First 6 details
        leftY = addDetailRow('Employee ID:', empId, leftColumnX, leftY);
        leftY = addDetailRow('Employee Name:', empName, leftColumnX, leftY);
        leftY = addDetailRow('Department:', department, leftColumnX, leftY);
        leftY = addDetailRow('Designation:', designation, leftColumnX, leftY);
        leftY = addDetailRow('Bank Name:', bankDetails?.bankName, leftColumnX, leftY);
        leftY = addDetailRow('Working Days:', workingDays.toString(), leftColumnX, leftY);
        
        // Right column - Next 5 details
        rightY = addDetailRow('Bank A/C No.:', bankDetails?.accountNo, rightColumnX, rightY);
        rightY = addDetailRow('PF Number:', pfNo, rightColumnX, rightY);
        rightY = addDetailRow('PAN Number:', panNo, rightColumnX, rightY);
        rightY = addDetailRow('LOP Days:', lopDays.toString(), rightColumnX, rightY);
        rightY = addDetailRow('Payable Days:', effectiveWorkingDays.toString(), rightColumnX, rightY);
        
        // Set the document Y position to the maximum of left and right columns
        doc.y = Math.max(leftY, rightY) + 10;

        /** -------------------- EARNINGS & DEDUCTIONS -------------------- **/
        let earningsY = doc.y;
        let totalEarnings = 0, totalDeductions = 0;

        // Section headers
        doc.fontSize(12).fillColor('#000080').font('Helvetica-Bold')
          .text('EARNINGS', leftColumnX, earningsY);
        doc.text('DEDUCTIONS', rightColumnX, earningsY);

        earningsY += 20;

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

        // Fixed column widths for earnings and deductions
        const earningsLabelWidth = 120;
        const earningsValueWidth = 80;
        const deductionsLabelWidth = 120;
        const deductionsValueWidth = 80;

        for (let i = 0; i < maxRows; i++) {
          if (earnings[i]) {
            doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
              .text(earnings[i].name + ':', leftColumnX, earningsY + (i * 20), { width: earningsLabelWidth });
            doc.font('Helvetica')
              .text(formatCurrency(earnings[i].amount), leftColumnX + earningsLabelWidth, earningsY + (i * 20), { 
                width: earningsValueWidth, 
                align: 'right' 
              });
            totalEarnings += parseFloat(earnings[i].amount);
          }
          
          if (deductionsList[i]) {
            doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold')
              .text(deductionsList[i].name + ':', rightColumnX, earningsY + (i * 20), { width: deductionsLabelWidth });
            doc.font('Helvetica')
              .text(formatCurrency(deductionsList[i].amount), rightColumnX + deductionsLabelWidth, earningsY + (i * 20), { 
                width: deductionsValueWidth, 
                align: 'right' 
              });
            totalDeductions += parseFloat(deductionsList[i].amount);
          }
        }

        earningsY += maxRows * 20 + 10;

        /** -------------------- TOTALS -------------------- **/
        doc.fontSize(11).fillColor('#000080').font('Helvetica-Bold')
          .text('Total Earnings:', leftColumnX, earningsY, { width: earningsLabelWidth });
        doc.text(formatCurrency(totalEarnings), leftColumnX + earningsLabelWidth, earningsY, { 
          width: earningsValueWidth, 
          align: 'right' 
        });
        
        doc.fontSize(11).fillColor('#000080').font('Helvetica-Bold')
          .text('Total Deductions:', rightColumnX, earningsY, { width: deductionsLabelWidth });
        doc.text(formatCurrency(totalDeductions), rightColumnX + deductionsLabelWidth, earningsY, { 
          width: deductionsValueWidth, 
          align: 'right' 
        });

        /** -------------------- NET SALARY -------------------- **/
        const netSalary = totalEarnings - totalDeductions;

        doc.moveDown(2);
        doc.fontSize(14).fillColor('#000080').font('Helvetica-Bold')
          .text('NET SALARY:', leftColumnX, doc.y, { width: earningsLabelWidth });
        doc.text(formatCurrency(netSalary), leftColumnX + earningsLabelWidth, doc.y, { 
          width: earningsValueWidth + 50, 
          align: 'left' 
        });

        doc.end();
        stream.on('finish', () => resolve(filePath));
        stream.on('error', (err) => reject(err));
      } catch (error) {
        reject(error);
      }
    });
  }
}
