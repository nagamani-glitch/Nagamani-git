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
    
    const pageWidth = doc.page.width - 100; // Adjusted width for margins
    const leftMargin = 50;

    payslips.forEach((payslip, index) => {
      if (index > 0) doc.addPage();

      // Header Section (Top of page)
      doc.fontSize(24)
         .fillColor('#1a237e')
         .text('DB4CLOUD TECHNOLOGIES', { align: 'center' });
      
      // Company Details
      doc.moveDown(0.5);
      doc.fontSize(10)
         .fillColor('#455a64')
         .text('123 Tech Street, Bangalore, India', { align: 'center' })
         .text('Phone: +91 1234567890 | Email: hr@db4cloud.com', { align: 'center' });

      // Employee Details Grid (Starting at fixed position)
      const gridStartY = 150;
      const leftColX = 50;
      const rightColX = 300;
      const lineHeight = 25;

      // Employee Details
      doc.fontSize(10)
         .fillColor('#000000');
      
      const details = [
        ['Employee Name:', payslip.employee],
        ['Employee ID:', 'EMP001'],
        ['Department:', 'Engineering'],
        ['Pay Period:', `${payslip.startDate.toLocaleDateString()} - ${payslip.endDate.toLocaleDateString()}`]
      ];

      details.forEach((detail, i) => {
        doc.text(detail[0], leftColX, gridStartY + (i * lineHeight))
           .text(detail[1], rightColX, gridStartY + (i * lineHeight));
      });

      // Earnings Table (Starting after employee details)
      const tableY = gridStartY + (details.length * lineHeight) + 30;
      
      // Table Headers
      doc.fillColor('#2196f3')
         .rect(leftColX, tableY, 500, 30)
         .fill();

      doc.fillColor('#ffffff')
         .text('Description', leftColX + 10, tableY + 10)
         .text('Amount (ETB)', rightColX + 10, tableY + 10);

      // Table Content
      let currentY = tableY + 30;
      const earnings = [
        ['Basic Salary', (payslip.grossPay * 0.5).toLocaleString()],
        ['HRA', (payslip.grossPay * 0.2).toLocaleString()],
        ['Special Allowance', (payslip.grossPay * 0.3).toLocaleString()],
        ['Deductions', `-${payslip.deduction.toLocaleString()}`]
      ];

      earnings.forEach(row => {
        doc.fillColor('#000000')
           .text(row[0], leftColX + 10, currentY + 10)
           .text(row[1], rightColX + 10, currentY + 10);
        currentY += 30;
      });

      // Net Pay Box with adjusted width and positioning
      const netPayY = currentY + 20;
      const netPayWidth = pageWidth;
      
      // Background rectangle for net pay
      doc.rect(leftMargin, netPayY, netPayWidth, 40)
         .fillAndStroke('#f3f4f6', '#000000');
      
      // Net Pay text with proper alignment
      doc.fontSize(14)
         .fillColor('#000000')
         .text(`Net Pay: ETB ${payslip.netPay.toLocaleString()}`, 
           leftMargin, 
           netPayY + 10, 
           {
             width: netPayWidth,
             align: 'center',
             lineGap: 0
           }
         );

      // Footer (Fixed at bottom of page)
      const footerY = doc.page.height - 100;
      doc.fontSize(8)
         .fillColor('#666666')
         .text('This is a computer-generated document and does not require signature', 
               leftColX, footerY, { width: 500, align: 'center' })
         .text(`Generated on: ${new Date().toLocaleString()}`, 
               leftColX, footerY + 15, { width: 500, align: 'center' });
    });
    
    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Error exporting payslips', error: error.message });
  }
};
