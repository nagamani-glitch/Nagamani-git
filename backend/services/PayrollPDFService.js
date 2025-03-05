// import PDFDocument from 'pdfkit';
// import fs from 'fs-extra';
// import path from 'path';
// import moment from 'moment';

// export class PayrollPDFService {
//     static async generatePayslipPDF(payslipData) {
//     console.log('Received payslip data:', payslipData); // Add this to check incoming data

//     const doc = new PDFDocument({
//       size: 'A4',
//       margin: 50
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

//     // Triple border design
//     doc.rect(15, 15, pageWidth - 30, doc.page.height - 30).strokeColor('#000080').lineWidth(0.5).stroke();
//     doc.rect(20, 20, pageWidth - 40, doc.page.height - 40).strokeColor('#000080').lineWidth(1).stroke();
//     doc.rect(25, 25, pageWidth - 50, doc.page.height - 50).strokeColor('#000080').lineWidth(0.5).stroke();

//     // Company header
//     const headerY = 50;
//     doc.fontSize(30)
//        .fillColor('#000080')
//        .font('Helvetica-Bold')
//        .text('DB4Cloud Technologies Pvt Ltd', leftMargin, headerY, {
//          align: 'center',
//          width: contentWidth
//        });

//     // Payslip header with month and year
//     const monthName = moment().month(payslipData.month - 1).format('MMMM');
//     doc.fontSize(24)
//        .fillColor('#1a1a1a')
//        .text('Salary Slip', leftMargin, doc.y + 20, {
//          align: 'center',
//          width: contentWidth
//        });

//     doc.fontSize(16)
//        .fillColor('#4d4d4d')
//        .text(`For the month of ${monthName} ${payslipData.year}`, leftMargin, doc.y + 10, {
//          align: 'center',
//          width: contentWidth
//        });

//     // Separator
//     const separatorY = doc.y + 20;
//     doc.moveTo(leftMargin, separatorY)
//        .lineTo(rightMargin, separatorY)
//        .strokeColor('#000080')
//        .lineWidth(2)
//        .stroke();

//     // Employee Details Section
//     const detailsBoxY = separatorY + 20;
//     const detailsBoxHeight = 160;
//     doc.rect(leftMargin, detailsBoxY, contentWidth, detailsBoxHeight)
//        .strokeColor('#000080')
//        .lineWidth(1)
//        .stroke();

//     // Employee details grid layout
//     const detailsStartY = detailsBoxY + 15;
//     const colWidth = contentWidth / 2;
//     let currentDetailY = detailsStartY;

//     // Helper function for detail rows
//     const addDetailRow = (label1, value1, label2, value2, y) => {
//       doc.font('Helvetica-Bold')
//          .fillColor('#000080')
//          .text(label1, leftMargin + 10, y)
//          .font('Helvetica')
//          .fillColor('#000000')
//          .text(value1 || 'N/A', leftMargin + 120, y)
//          .font('Helvetica-Bold')
//          .fillColor('#000080')
//          .text(label2, leftMargin + colWidth + 10, y)
//          .font('Helvetica')
//          .fillColor('#000000')
//          .text(value2 || 'N/A', leftMargin + colWidth + 120, y);
//     };

    
//     // Employee details rows with all fields
// addDetailRow('Employee ID:', payslipData.empId, 'Name:', payslipData.empName, currentDetailY);
// currentDetailY += detailRowHeight;

// addDetailRow('Department:', payslipData.department, 'Designation:', payslipData.designation, currentDetailY);
// currentDetailY += detailRowHeight;

// addDetailRow('PF No:', payslipData.pfNo, 'UAN No:', payslipData.uanNo, currentDetailY);
// currentDetailY += detailRowHeight;

// addDetailRow('PAN No:', payslipData.panNo, 'Bank Name:', payslipData.bankDetails.bankName, currentDetailY);
// currentDetailY += detailRowHeight;

// addDetailRow('Account No:', payslipData.bankDetails.accountNo, 'Basic Pay:', `Rs${payslipData.basicPay}`, currentDetailY);

//     // Attendance Details Section
//     const attendanceBoxY = detailsBoxY + detailsBoxHeight + 20;
//     const attendanceBoxHeight = 80;
    
//     doc.rect(leftMargin, attendanceBoxY, contentWidth, attendanceBoxHeight)
//        .fillColor('#f8f9fa')
//        .fill()
//        .strokeColor('#000080')
//        .stroke();

//     doc.fontSize(10)
//        .font('Helvetica-Bold')
//        .fillColor('#000080')
//        .text('Attendance Details', leftMargin + 10, attendanceBoxY + 10);

//     const attendanceStartY = attendanceBoxY + 35;
//     const attendanceColWidth = contentWidth / 4;

//     // Enhanced attendance information
//     const attendanceDetails = [
//       { label: 'Total Days:', value: payslipData.payableDays },
//       { label: 'LOP Days:', value: payslipData.lopDays },
//       { label: 'Working Days:', value: payslipData.payableDays - payslipData.lopDays },
//       { label: 'Per Day Pay:', value: `Rs${(payslipData.basicPay / payslipData.payableDays).toFixed(2)}` }
//     ];

//     attendanceDetails.forEach((detail, index) => {
//       doc.font('Helvetica-Bold')
//          .fillColor('#000080')
//          .text(detail.label, leftMargin + (attendanceColWidth * index) + 10, attendanceStartY)
//          .font('Helvetica')
//          .fillColor('#000000')
//          .text(detail.value, leftMargin + (attendanceColWidth * index) + 10, attendanceStartY + 20);
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

//     // Add basic pay as first earning
//     doc.rect(earningsX, currentY, columnWidth, rowHeight)
//        .fillColor('#f8f9fa')
//        .fill()
//        .strokeColor('#000080')
//        .stroke();

//     doc.fillColor('#000000')
//        .fontSize(12)
//        .font('Helvetica')
//        .text('Basic Pay', earningsX + 10, currentY + 8)
//        .text(`Rs${parseFloat(payslipData.basicPay).toFixed(2)}`, 
//              earningsX + columnWidth - 110, currentY + 8, {
//                width: 100,
//                align: 'right'
//              });

//     currentY += rowHeight;

//     // Other allowances
//     payslipData.allowances.forEach((allowance, index) => {
//       const rowY = currentY;
//       doc.rect(earningsX, rowY, columnWidth, rowHeight)
//          .fillColor(index % 2 === 0 ? '#f8f9fa' : '#ffffff')
//          .fill()
//          .strokeColor('#000080')
//          .stroke();

//       doc.fillColor('#000000')
//          .fontSize(12)
//          .font('Helvetica')
//          .text(`${allowance.name} (${allowance.percentage}%)`, earningsX + 10, rowY + 8)
//          .text(`Rs${parseFloat(allowance.amount).toFixed(2)}`, 
//                earningsX + columnWidth - 110, rowY + 8, {
//                  width: 100,
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
//          .fillColor(index % 2 === 0 ? '#f8f9fa' : '#ffffff')
//          .fill()
//          .strokeColor('#000080')
//          .stroke();

//       doc.fillColor('#000000')
//          .fontSize(12)
//          .font('Helvetica')
//          .text(`${deduction.name} (${deduction.percentage}%)`, deductionsX + 10, rowY + 8)
//          .text(`Rs${parseFloat(deduction.amount).toFixed(2)}`, 
//                deductionsX + columnWidth - 110, rowY + 8, {
//                  width: 100,
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
//        .text(`Rs${parseFloat(payslipData.grossSalary).toFixed(2)}`, summaryValueX, summaryY + 20);

//     doc.text('Total Deductions:', summaryTextX, summaryY + 55)
//        .text(`Rs${parseFloat(payslipData.totalDeductions).toFixed(2)}`, summaryValueX, summaryY + 55);

//     doc.fontSize(16)
//        .text('Net Salary:', summaryTextX, summaryY + 90)
//        .text(`Rs${parseFloat(payslipData.netSalary).toFixed(2)}`, summaryValueX, summaryY + 90);

//     // Footer with generation date
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

import PDFDocument from 'pdfkit';
import fs from 'fs-extra';
import path from 'path';
import moment from 'moment';

export class PayrollPDFService {
  static async generatePayslipPDF(payslipData) {
    const formatCurrency = (amount) => {
      return `Rs. ${parseFloat(amount).toFixed(2)}`;
    };

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true
    });

    // Layout constants
    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - 100;
    const leftMargin = 50;
    const rightMargin = pageWidth - 50;
    const columnWidth = (contentWidth - 20) / 2;
    const rowHeight = 30;
    const detailRowHeight = 25;

    const fileName = `payslip_${payslipData.empId}_${payslipData.month}_${payslipData.year}.pdf`;
    const filePath = path.join('uploads', 'payslips', fileName);

    await fs.ensureDir(path.dirname(filePath));
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Border design
    doc.rect(15, 15, pageWidth - 30, doc.page.height - 30).strokeColor('#000080').lineWidth(0.5).stroke();
    doc.rect(20, 20, pageWidth - 40, doc.page.height - 40).strokeColor('#000080').lineWidth(1).stroke();
    doc.rect(25, 25, pageWidth - 50, doc.page.height - 50).strokeColor('#000080').lineWidth(0.5).stroke();

    // Company header
    const headerY = 50;
    doc.fontSize(32)
       .fillColor('#000080')
       .font('Helvetica-Bold')
       .text('DB4Cloud Technologies Pvt Ltd', leftMargin, headerY, {
         align: 'center',
         width: contentWidth,
         characterSpacing: 0.5
       });

    // Payslip header
    const monthName = moment().month(payslipData.month - 1).format('MMMM');
    doc.fontSize(26)
       .fillColor('#1a1a1a')
       .text('Salary Slip', leftMargin, doc.y + 25, {
         align: 'center',
         width: contentWidth
       });

    doc.fontSize(18)
       .fillColor('#4d4d4d')
       .text(`For the month of ${monthName} ${payslipData.year}`, leftMargin, doc.y + 15, {
         align: 'center',
         width: contentWidth
       });

    // Separator
    const separatorY = doc.y + 25;
    doc.moveTo(leftMargin, separatorY)
       .lineTo(rightMargin, separatorY)
       .strokeColor('#000080')
       .lineWidth(2)
       .stroke();

    // Employee Details Section
    const detailsBoxY = separatorY + 20;
    const detailsBoxHeight = 160;
    doc.rect(leftMargin, detailsBoxY, contentWidth, detailsBoxHeight)
       .fillColor('#f8f9fa')
       .fill()
       .strokeColor('#000080')
       .lineWidth(1)
       .stroke();

    // Section header
    doc.fontSize(14)
       .fillColor('#000080')
       .font('Helvetica-Bold')
       .text('Employee Details', leftMargin + 10, detailsBoxY + 10);

    const detailsStartY = detailsBoxY + 35;
    const colWidth = contentWidth / 2;
    let currentDetailY = detailsStartY;

    // Helper function for detail rows
    const addDetailRow = (label1, value1, label2, value2, y) => {
      doc.font('Helvetica-Bold')
         .fillColor('#000080')
         .fontSize(11)
         .text(label1, leftMargin + 15, y, { width: 100 })
         .font('Helvetica')
         .fillColor('#000000')
         .text(value1 || 'N/A', leftMargin + 120, y, { width: 150 })
         .font('Helvetica-Bold')
         .fillColor('#000080')
         .text(label2, leftMargin + colWidth + 15, y, { width: 100 })
         .font('Helvetica')
         .fillColor('#000000')
         .text(value2 || 'N/A', leftMargin + colWidth + 120, y, { width: 150 });
    };

    // Employee details rows
    addDetailRow('Employee ID:', payslipData.empId, 'Name:', payslipData.empName, currentDetailY);
    currentDetailY += detailRowHeight;
    
    addDetailRow('Department:', payslipData.department, 'Designation:', payslipData.designation, currentDetailY);
    currentDetailY += detailRowHeight;
    
    addDetailRow('PF No:', payslipData.pfNo, 'UAN No:', payslipData.uanNo, currentDetailY);
    currentDetailY += detailRowHeight;
    
    addDetailRow('PAN No:', payslipData.panNo, 'Bank Name:', payslipData.bankDetails.bankName, currentDetailY);
    currentDetailY += detailRowHeight;
    
    addDetailRow('Account No:', payslipData.bankDetails.accountNo, 'Basic Pay:', formatCurrency(payslipData.basicPay), currentDetailY);

    // Attendance Details Section
    const attendanceBoxY = detailsBoxY + detailsBoxHeight + 20;
    const attendanceBoxHeight = 80;
    
    doc.rect(leftMargin, attendanceBoxY, contentWidth, attendanceBoxHeight)
       .fillColor('#f8f9fa')
       .fill()
       .strokeColor('#000080')
       .stroke();

    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#000080')
       .text('Attendance Details', leftMargin + 15, attendanceBoxY + 10);

    const attendanceStartY = attendanceBoxY + 35;
    const attendanceColWidth = contentWidth / 4;

    const attendanceDetails = [
      { label: 'Total Days:', value: payslipData.payableDays },
      { label: 'LOP Days:', value: payslipData.lopDays },
      { label: 'Working Days:', value: payslipData.payableDays - payslipData.lopDays },
      { label: 'Per Day Pay:', value: formatCurrency(payslipData.basicPay / payslipData.payableDays) }
    ];

    attendanceDetails.forEach((detail, index) => {
      doc.font('Helvetica-Bold')
         .fillColor('#000080')
         .fontSize(11)
         .text(detail.label, leftMargin + (attendanceColWidth * index) + 15, attendanceStartY)
         .font('Helvetica')
         .fillColor('#000000')
         .text(detail.value, leftMargin + (attendanceColWidth * index) + 15, attendanceStartY + 20);
    });

    // Earnings & Deductions tables
    const tableY = attendanceBoxY + attendanceBoxHeight + 20;
    const tableHeaderHeight = 35;

    // Earnings Table
    const earningsX = leftMargin;
    doc.rect(earningsX, tableY, columnWidth, tableHeaderHeight)
       .fillColor('#000080')
       .fill();
    
    doc.fillColor('#FFFFFF')
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('EARNINGS', earningsX, tableY + 10, {
         width: columnWidth,
         align: 'center'
       });

    let currentY = tableY + tableHeaderHeight;

    // Basic pay row
    doc.rect(earningsX, currentY, columnWidth, rowHeight)
       .fillColor('#f8f9fa')
       .fill()
       .strokeColor('#000080')
       .stroke();

    doc.fillColor('#000000')
       .fontSize(11)
       .font('Helvetica')
       .text('Basic Pay', earningsX + 15, currentY + 8)
       .text(formatCurrency(payslipData.basicPay), 
             earningsX + columnWidth - 80, currentY + 8, {
               width: 70,
               align: 'right'
             });

    currentY += rowHeight;

    // Allowances
    payslipData.allowances.forEach((allowance, index) => {
      const rowY = currentY;
      doc.rect(earningsX, rowY, columnWidth, rowHeight)
         .fillColor(index % 2 === 0 ? '#ffffff' : '#f8f9fa')
         .fill()
         .strokeColor('#000080')
         .stroke();

      doc.fillColor('#000000')
         .fontSize(11)
         .font('Helvetica')
         .text(`${allowance.name} (${allowance.percentage}%)`, earningsX + 15, rowY + 8)
         .text(formatCurrency(allowance.amount), 
               earningsX + columnWidth - 80, rowY + 8, {
                 width: 70,
                 align: 'right'
               });

      currentY += rowHeight;
    });

    // Deductions Table
    const deductionsX = leftMargin + columnWidth + 20;
    doc.rect(deductionsX, tableY, columnWidth, tableHeaderHeight)
       .fillColor('#000080')
       .fill();

    doc.fillColor('#FFFFFF')
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('DEDUCTIONS', deductionsX, tableY + 10, {
         width: columnWidth,
         align: 'center'
       });

    currentY = tableY + tableHeaderHeight;

    payslipData.deductions.forEach((deduction, index) => {
      const rowY = currentY;
      doc.rect(deductionsX, rowY, columnWidth, rowHeight)
         .fillColor(index % 2 === 0 ? '#ffffff' : '#f8f9fa')
         .fill()
         .strokeColor('#000080')
         .stroke();

      doc.fillColor('#000000')
         .fontSize(11)
         .font('Helvetica')
         .text(`${deduction.name} (${deduction.percentage}%)`, deductionsX + 15, rowY + 8)
         .text(formatCurrency(deduction.amount), 
               deductionsX + columnWidth - 80, rowY + 8, {
                 width: 70,
                 align: 'right'
               });

      currentY += rowHeight;
    });

    // Summary section
    const summaryY = currentY + 30;
    const summaryHeight = 130;
    doc.rect(leftMargin, summaryY, contentWidth, summaryHeight)
       .fillColor('#f8f9fa')
       .fill()
       .strokeColor('#000080')
       .lineWidth(2)
       .stroke();

    const summaryTextX = leftMargin + 20;
    const summaryValueX = leftMargin + 200;
    
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#000080')
       .text('Gross Salary:', summaryTextX, summaryY + 20)
       .text(formatCurrency(payslipData.grossSalary), summaryValueX, summaryY + 20);

    doc.text('Total Deductions:', summaryTextX, summaryY + 55)
       .text(formatCurrency(payslipData.totalDeductions), summaryValueX, summaryY + 55);

    doc.fontSize(16)
       .text('Net Salary:', summaryTextX, summaryY + 90)
       .text(formatCurrency(payslipData.netSalary), summaryValueX, summaryY + 90);

    // Footer
    const generationDate = moment().format('DD/MM/YYYY HH:mm:ss');
    doc.fontSize(10)
       .fillColor('#666666')
       .font('Helvetica-Oblique')
       .text(`Generated on: ${generationDate}`, leftMargin, doc.page.height - 70, {
         align: 'center',
         width: contentWidth
       })
       .text('This is a computer-generated document and does not require signature', 
             leftMargin, doc.page.height - 50, {
               align: 'center',
               width: contentWidth
             });

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    });
  }
}



