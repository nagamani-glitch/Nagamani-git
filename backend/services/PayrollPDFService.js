// import PDFDocument from 'pdfkit';
// import fs from 'fs-extra';
// import path from 'path';
// import moment from 'moment';

// export class PayrollPDFService {

// static async generatePayslipPDF(payslipData) {
//   const doc = new PDFDocument({
//     size: 'A4',
//     margin: 50
//   });

//   const fileName = `payslip_${payslipData.empId}_${payslipData.month}_${payslipData.year}.pdf`;
//   const filePath = path.join('uploads', 'payslips', fileName);

//   await fs.ensureDir(path.dirname(filePath));
//   const stream = fs.createWriteStream(filePath);
//   doc.pipe(stream);

//   // Add page border
//   doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

//   // Company Header with enhanced styling
//   doc.fontSize(26)
//      .fillColor('#FF0000')
//      .text('DB4Cloud Technologies Pvt Ltd', { align: 'center' })
//      .moveDown(0.3)
//      .fontSize(20)
//      .text('Salary Slip', { align: 'center' })
//      .fontSize(14)
//      .text(`For the month of ${payslipData.month} ${payslipData.year}`, { align: 'center' })
//      .moveDown(1);

//   // Horizontal line
//   doc.moveTo(50, doc.y)
//      .lineTo(545, doc.y)
//      .stroke('#FF0000');
//   doc.moveDown(1);

//   // Employee Details in a box
//   doc.fillColor('#000000')
//      .fontSize(12)
//      .rect(50, doc.y, 495, 80)
//      .stroke();

//   const startY = doc.y + 10;
//   doc.text(`Employee ID: ${payslipData.empId}`, 60, startY)
//      .text(`Name: ${payslipData.empName}`, 300, startY)
//      .text(`Bank Name: ${payslipData.bankDetails.bankName}`, 60, startY + 25)
//      .text(`Account No: ${payslipData.bankDetails.accountNo}`, 300, startY + 25);

//   doc.moveDown(5);

//   // Earnings Section
//   const tableTop = doc.y;
//   const tableLeft = 50;
//   const tableRight = 545;
//   const rowHeight = 25;

//   // Earnings Header
//   doc.fillColor('#FF0000')
//      .fontSize(14)
//      .text('EARNINGS', tableLeft, tableTop, { width: 495, align: 'center' })
//      .moveDown(0.5);

//   // Earnings Table
//   doc.fillColor('#000000')
//      .fontSize(12);

//   let currentY = doc.y;
//   payslipData.allowances.forEach(allowance => {
//     const amount = parseFloat(allowance.amount).toFixed(2);
//     doc.text(allowance.name, tableLeft, currentY)
//        .text(`Rs. ${amount}`, tableRight - 100, currentY, { align: 'right' });
//     currentY += rowHeight;
//   });

//   doc.moveDown(2);

//   // Deductions Section
//   doc.fillColor('#FF0000')
//      .fontSize(14)
//      .text('DEDUCTIONS', { width: 495, align: 'center' })
//      .moveDown(0.5);

//   // Deductions Table
//   doc.fillColor('#000000')
//      .fontSize(12);

//   currentY = doc.y;
//   payslipData.deductions.forEach(deduction => {
//     const amount = parseFloat(deduction.amount).toFixed(2);
//     doc.text(deduction.name, tableLeft, currentY)
//        .text(`Rs. ${amount}`, tableRight - 100, currentY, { align: 'right' });
//     currentY += rowHeight;
//   });

//   doc.moveDown(2);

//   // Summary Section with box
//   const summaryTop = doc.y;
//   doc.rect(50, summaryTop, 495, 100).stroke();

//   // Summary content
//   const grossSalary = parseFloat(payslipData.grossSalary).toFixed(2);
//   const totalDeductions = parseFloat(payslipData.totalDeductions).toFixed(2);
//   const netSalary = parseFloat(payslipData.netSalary).toFixed(2);

//   doc.fontSize(12)
//      .text(`Gross Salary: Rs. ${grossSalary}`, 60, summaryTop + 20)
//      .text(`Total Deductions: Rs. ${totalDeductions}`, 60, summaryTop + 45)
//      .fontSize(16)
//      .fillColor('#FF0000')
//      .text(`Net Salary: Rs. ${netSalary}`, 60, summaryTop + 70);

//   // Footer
//   doc.fontSize(10)
//      .fillColor('#666666')
//      .text('This is a computer-generated document and does not require signature', 
//            50, doc.page.height - 50, { align: 'center' });

//   doc.end();

//   return new Promise((resolve, reject) => {
//     stream.on('finish', () => resolve(filePath));
//     stream.on('error', reject);
//   });
// }


// }

import PDFDocument from 'pdfkit';
import fs from 'fs-extra';
import path from 'path';
import moment from 'moment';

export class PayrollPDFService {
  static async generatePayslipPDF(payslipData) {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    const fileName = `payslip_${payslipData.empId}_${payslipData.month}_${payslipData.year}.pdf`;
    const filePath = path.join('uploads', 'payslips', fileName);

    await fs.ensureDir(path.dirname(filePath));
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Page Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .strokeColor('#FF0000')
       .stroke();

    // Company Header
    doc.fontSize(26)
       .fillColor('#FF0000')
       .text('DB4Cloud Technologies Pvt Ltd', { align: 'center' })
       .moveDown(0.3);

    // Payslip Title
    doc.fontSize(20)
       .text('Salary Slip', { align: 'center' })
       .fontSize(14)
       .text(`For the month of ${payslipData.month} ${payslipData.year}`, { align: 'center' })
       .moveDown(1);

    // Decorative Line
    doc.moveTo(50, doc.y)
       .lineTo(545, doc.y)
       .strokeColor('#FF0000')
       .stroke()
       .moveDown(1);

    // Employee Details Box
    const employeeBoxY = doc.y;
    doc.rect(50, employeeBoxY, 495, 80)
       .stroke();

    // Employee Details Content
    doc.fillColor('#000000')
       .fontSize(12)
       .text(`Employee ID: ${payslipData.empId}`, 60, employeeBoxY + 10)
       .text(`Name: ${payslipData.empName}`, 300, employeeBoxY + 10)
       .text(`Bank Name: ${payslipData.bankDetails.bankName}`, 60, employeeBoxY + 35)
       .text(`Account No: ${payslipData.bankDetails.accountNo}`, 300, employeeBoxY + 35)
       .moveDown(5);

    // Two Column Layout Setup
    const columnWidth = 240;
    const leftMargin = 50;
    const rightMargin = leftMargin + columnWidth + 15;
    const startY = doc.y;

    // Left Column - Earnings
    doc.fontSize(16)
       .fillColor('#FF0000')
       .text('EARNINGS', leftMargin, startY, { width: columnWidth, align: 'center' })
       .moveDown(0.5);

    let currentY = doc.y;
    let maxY = currentY;

    // Earnings Content
    doc.fillColor('#000000')
       .fontSize(12);

    payslipData.allowances.forEach(allowance => {
      const amount = parseFloat(allowance.amount).toFixed(2);
      doc.text(allowance.name, leftMargin, currentY)
         .text(`Rs. ${amount}`, leftMargin + columnWidth - 80, currentY, { align: 'right' });
      currentY += 25;
      maxY = Math.max(maxY, currentY);
    });

    // Right Column - Deductions
    doc.fontSize(16)
       .fillColor('#FF0000')
       .text('DEDUCTIONS', rightMargin, startY, { width: columnWidth, align: 'center' })
       .moveDown(0.5);

    currentY = startY + 30;

    // Deductions Content
    doc.fillColor('#000000')
       .fontSize(12);

    payslipData.deductions.forEach(deduction => {
      const amount = parseFloat(deduction.amount).toFixed(2);
      doc.text(deduction.name, rightMargin, currentY)
         .text(`Rs. ${amount}`, rightMargin + columnWidth - 80, currentY, { align: 'right' });
      currentY += 25;
      maxY = Math.max(maxY, currentY);
    });

    // Summary Section
    doc.y = maxY + 30;
    
    // Summary Box
    const summaryBoxY = doc.y;
    doc.rect(50, summaryBoxY, 495, 100)
       .stroke();

    // Summary Content
    const grossSalary = parseFloat(payslipData.grossSalary).toFixed(2);
    const totalDeductions = parseFloat(payslipData.totalDeductions).toFixed(2);
    const netSalary = parseFloat(payslipData.netSalary).toFixed(2);

    doc.fontSize(12)
       .text(`Gross Salary: Rs. ${grossSalary}`, 60, summaryBoxY + 20)
       .text(`Total Deductions: Rs. ${totalDeductions}`, 60, summaryBoxY + 45);

    // Net Salary (Highlighted)
    doc.fontSize(16)
       .fillColor('#FF0000')
       .text(`Net Salary: Rs. ${netSalary}`, 60, summaryBoxY + 70);

    // Footer
    doc.fontSize(10)
       .fillColor('#666666')
       .text('This is a computer-generated document and does not require signature', 
             50, doc.page.height - 50, { align: 'center' });

    // Add page break for multiple payslips
    if (doc.page && doc.page.pageNumber > 1) {
      doc.addPage();
      doc.moveDown(4);
    }

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    });
  }
}






