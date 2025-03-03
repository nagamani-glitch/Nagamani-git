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

    // Company Header
    doc.fontSize(20)
       .text('Your Company Name', { align: 'center' })
       .fontSize(16)
       .text('Salary Slip', { align: 'center' })
       .fontSize(12)
       .text(`For the month of ${payslipData.month} ${payslipData.year}`, { align: 'center' })
       .moveDown();

    // Employee Details
    doc.text(`Employee ID: ${payslipData.empId}`)
       .text(`Name: ${payslipData.empName}`)
       .text(`Bank Name: ${payslipData.bankDetails.bankName}`)
       .text(`Account No: ${payslipData.bankDetails.accountNo}`)
       .moveDown();

    // Salary Details
    doc.text('Earnings:')
       .moveDown(0.5);
    
    payslipData.allowances.forEach(allowance => {
      doc.text(`${allowance.name}: ₹${allowance.amount}`);
    });

    doc.moveDown()
       .text('Deductions:')
       .moveDown(0.5);

    payslipData.deductions.forEach(deduction => {
      doc.text(`${deduction.name}: ₹${deduction.amount}`);
    });

    // Summary
    doc.moveDown()
       .text(`Gross Salary: ₹${payslipData.grossSalary}`)
       .text(`Total Deductions: ₹${payslipData.totalDeductions}`)
       .text(`Net Salary: ₹${payslipData.netSalary}`);

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    });
  }
}
