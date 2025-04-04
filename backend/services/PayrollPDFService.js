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
        doc.fontSize(20).fillColor('#f70505').font('Helvetica-Bold')
          .text('DB4Cloud Technologies Pvt Ltd', { align: 'center' });

        doc.moveDown(0.5)
          .fontSize(10).fillColor('#333333').text('#24-361, Satyanarayana puram, KongaReddy Palli, Chittor Andhra Pradesh - 517001', { align: 'center' });

        doc.moveDown(0.8)
          .fontSize(12).fillColor('#555555')
          .text(`Payslip for the month of ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`, { align: 'center' });

        doc.moveDown(1);

        /** -------------------- EMPLOYEE DETAILS SECTION -------------------- **/
        // Section header
        doc.fontSize(12).fillColor('#f70505').font('Helvetica-Bold')
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
        leftY = addDetailRow('PF Number:', pfNo, leftColumnX, leftY);
        leftY = addDetailRow('Working Days:', workingDays.toString(), leftColumnX, leftY);
        
        
        // Right column - Next 5 details
        
        rightY = addDetailRow('Bank Name:', bankDetails?.bankName, rightColumnX, rightY);
        rightY = addDetailRow('Bank A/C No.:', bankDetails?.accountNo, rightColumnX, rightY);
        rightY = addDetailRow('PAN Number:', panNo, rightColumnX, rightY);
        rightY = addDetailRow('LOP Days:', lopDays.toString(), rightColumnX, rightY);
        rightY = addDetailRow('Payable Days:', effectiveWorkingDays.toString(), rightColumnX, rightY);
        
        // Set the document Y position to the maximum of left and right columns
        doc.y = Math.max(leftY, rightY) + 10;

        /** -------------------- EARNINGS & DEDUCTIONS -------------------- **/
        let earningsY = doc.y;
        let totalEarnings = 0, totalDeductions = 0;

        // Section headers
        doc.fontSize(12).fillColor('#f70505').font('Helvetica-Bold')
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
        doc.fontSize(11).fillColor('#f70505').font('Helvetica-Bold')
          .text('Total Earnings:', leftColumnX, earningsY, { width: earningsLabelWidth });
        doc.text(formatCurrency(totalEarnings), leftColumnX + earningsLabelWidth, earningsY, { 
          width: earningsValueWidth, 
          align: 'right' 
        });
        
        doc.fontSize(11).fillColor('#f70505').font('Helvetica-Bold')
          .text('Total Deductions:', rightColumnX, earningsY, { width: deductionsLabelWidth });
        doc.text(formatCurrency(totalDeductions), rightColumnX + deductionsLabelWidth, earningsY, { 
          width: deductionsValueWidth, 
          align: 'right' 
        });

        /** -------------------- NET SALARY -------------------- **/
        const netSalary = totalEarnings - totalDeductions;

        doc.moveDown(2);
        doc.fontSize(14).fillColor('#f70505').font('Helvetica-Bold')
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


