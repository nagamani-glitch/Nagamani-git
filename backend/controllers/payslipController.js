import Payslip from '../models/Payslip.js';
import PDFDocument from 'pdfkit';

export const getAllPayslips = async (req, res) => {
  try {
    const payslips = await Payslip.find();
    res.status(200).json(payslips);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payslips', error: error.message });
  }
};

export const createPayslip = async (req, res) => {
  try {
    const { employee, startDate, endDate, grossPay, deduction } = req.body;
    const netPay = grossPay - deduction;

    const payslip = new Payslip({
      employee,
      startDate,
      endDate,
      grossPay,
      deduction,
      netPay
    });

    const savedPayslip = await payslip.save();
    res.status(201).json(savedPayslip);
  } catch (error) {
    res.status(400).json({ message: 'Error creating payslip', error: error.message });
  }
};

export const updatePayslip = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPayslip = await Payslip.findByIdAndUpdate(
            id,
            { ...req.body, netPay: req.body.grossPay - req.body.deduction },
            { new: true }
        );
        
        if (!updatedPayslip) {
            return res.status(404).json({ message: 'Payslip not found' });
        }
        
        res.status(200).json(updatedPayslip);
    } catch (error) {
        res.status(500).json({ message: 'Error updating payslip', error: error.message });
    }
};


export const deletePayslip = async (req, res) => {
  try {
    const deletedPayslip = await Payslip.findByIdAndDelete(req.params.id);
    if (!deletedPayslip) {
      return res.status(404).json({ message: 'Payslip not found' });
    }
    res.status(200).json({ message: 'Payslip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payslip', error: error.message });
  }
};

export const bulkDeletePayslips = async (req, res) => {
  try {
    const { ids } = req.body;
    await Payslip.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Payslips deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payslips', error: error.message });
  }
};

export const exportPayslips = async (req, res) => {
  try {
    const { ids } = req.body;
    const payslips = await Payslip.find({ _id: { $in: ids } });
    
    const doc = new PDFDocument({
      size: 'A4',
      margin: { top: 50, bottom: 50, left: 50, right: 50 },
      bufferPages: true
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=payslips.pdf');
    
    doc.pipe(res);
    
    payslips.forEach((payslip, index) => {
      if (index > 0) doc.addPage();

      // Decorative top border
      doc.rect(50, 40, 495, 5)
         .fillColor('#ff0000')
         .fill();

      // Company Header with enhanced styling
      doc.fontSize(28)
         .fillColor('#ff0000')
         .font('Helvetica-Bold')
         .text('DB4CLOUD TECHNOLOGIES', { align: 'center' });

      // Double underline effect
      const headerWidth = 400;
      const headerX = (doc.page.width - headerWidth) / 2;
      
      // First line (thick)
      doc.moveTo(headerX, doc.y + 2)
         .lineTo(headerX + headerWidth, doc.y + 2)
         .lineWidth(3)
         .strokeColor('#ff0000')
         .stroke();
      
      // Second line (thin)
      doc.moveTo(headerX, doc.y + 5)
         .lineTo(headerX + headerWidth, doc.y + 5)
         .lineWidth(1)
         .strokeColor('#ff0000')
         .stroke();

      // Company Details with enhanced styling
      doc.moveDown(1);
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('#333333')
         .text('123 Tech Street, Bangalore, India', { align: 'center' })
         .text('Phone: +91 1234567890 | Email: hr@db4cloud.com', { align: 'center' });

      // Decorative separator
      doc.moveDown(0.5);
      doc.rect(150, doc.y, 300, 1)
         .fillColor('#cccccc')
         .fill();

      // Payslip Title
      doc.moveDown(1);
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .fillColor('#333333')
         .text('SALARY SLIP', { align: 'center' });

      // Employee Details with box styling
      const gridStartY = doc.y + 20;
      doc.rect(50, gridStartY, 495, 120)
         .strokeColor('#cccccc')
         .lineWidth(1)
         .stroke();

      // Employee Details Content
      const leftColX = 70;
      const rightColX = 300;
      doc.fontSize(11)
         .font('Helvetica')
         .fillColor('#333333');

      const details = [
        ['Employee Name:', payslip.employee],
        ['Employee ID:', 'EMP001'],
        ['Department:', 'Engineering'],
        ['Pay Period:', `${payslip.startDate.toLocaleDateString()} - ${payslip.endDate.toLocaleDateString()}`]
      ];

      details.forEach((detail, i) => {
        doc.text(detail[0], leftColX, gridStartY + 20 + (i * 25))
           .font('Helvetica-Bold')
           .text(detail[1], rightColX, gridStartY + 20 + (i * 25))
           .font('Helvetica');
      });

      // Earnings Table with enhanced styling
      const tableY = gridStartY + 140;
      
      // Table Header
      doc.rect(50, tableY, 495, 30)
         .fillColor('#ff0000')
         .fill();

      doc.fillColor('#ffffff')
         .font('Helvetica-Bold')
         .text('Description', leftColX, tableY + 10)
         .text('Amount (ETB)', rightColX, tableY + 10);

      // Table Content with alternating row colors
      let currentY = tableY + 30;
      const earnings = [
        ['Basic Salary', (payslip.grossPay * 0.5).toLocaleString()],
        ['HRA', (payslip.grossPay * 0.2).toLocaleString()],
        ['Special Allowance', (payslip.grossPay * 0.3).toLocaleString()],
        ['Deductions', `-${payslip.deduction.toLocaleString()}`]
      ];

      earnings.forEach((row, i) => {
        // Alternating row background
        if (i % 2 === 0) {
          doc.rect(50, currentY, 495, 30)
             .fillColor('#f8f9fa')
             .fill();
        }

        doc.fillColor('#333333')
           .font('Helvetica')
           .text(row[0], leftColX, currentY + 10)
           .text(row[1], rightColX, currentY + 10);
        currentY += 30;
      });

      // Net Pay Box with proper containment
      const netPayY = currentY + 20;
      const netPayBoxWidth = 495;
      const netPayBoxHeight = 50;
      const netPayBoxX = 50;

      // Draw the containing box
      doc.rect(netPayBoxX, netPayY, netPayBoxWidth, netPayBoxHeight)
         .fillColor('#f8f9fa')
         .strokeColor('#ff0000')
         .lineWidth(2)
         .fillAndStroke();

      // Center the text vertically and horizontally inside the box
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .fillColor('#ff0000')
         .text(`Net Pay: ETB ${payslip.netPay.toLocaleString()}`, 
         netPayBoxX, 
         netPayY + (netPayBoxHeight - 16) / 2, // Centers text vertically
         {
           width: netPayBoxWidth,
           align: 'center',
           lineGap: 0
         });

      // Footer with styled separator
      const footerY = doc.page.height - 100;
      doc.rect(150, footerY - 20, 300, 1)
         .fillColor('#cccccc')
         .fill();

      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#666666')
         .text('This is a computer-generated document and does not require signature', 
               50, footerY, { width: 495, align: 'center' })
         .text(`Generated on: ${new Date().toLocaleString()}`, 
               50, footerY + 15, { width: 495, align: 'center' });
    });
    
    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Error exporting payslips', error: error.message });
  }
};
