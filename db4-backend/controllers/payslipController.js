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

// export const exportPayslips = async (req, res) => {
//   try {
//     const { ids } = req.body;
//     const payslips = await Payslip.find({ _id: { $in: ids } });
    
//     const doc = new PDFDocument();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename=payslips.pdf');
    
//     doc.pipe(res);
    
//     payslips.forEach(payslip => {
//       doc.fontSize(16).text(`Payslip for ${payslip.employee}`);
//       doc.fontSize(12).text(`Start Date: ${payslip.startDate.toLocaleDateString()}`);
//       doc.text(`End Date: ${payslip.endDate.toLocaleDateString()}`);
//       doc.text(`Gross Pay: ${payslip.grossPay}`);
//       doc.text(`Deduction: ${payslip.deduction}`);
//       doc.text(`Net Pay: ${payslip.netPay}`);
//       doc.addPage();
//     });
    
//     doc.end();
//   } catch (error) {
//     res.status(500).json({ message: 'Error exporting payslips', error: error.message });
//   }
// };

export const exportPayslips = async (req, res) => {
    try {
      const { ids } = req.body;
      const payslips = await Payslip.find({ _id: { $in: ids } });
      
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=payslips.pdf');
      
      doc.pipe(res);
      
      payslips.forEach(payslip => {
        // Header with styling
        doc.fontSize(24)
           .fillColor('#2c3e50')
           .text('COMPANY NAME', { align: 'center' });
        doc.moveDown();
        
        doc.fontSize(20)
           .fillColor('#34495e')
           .text('Payslip Details', { align: 'center' });
        doc.moveDown();
  
        // Employee Info Section with styling
        doc.fontSize(16)
           .fillColor('#2980b9')
           .text('Employee Information');
        
        doc.fontSize(12)
           .fillColor('#333')
           .text(`Employee Name: ${payslip.employee}`)
           .text(`Period: ${payslip.startDate.toLocaleDateString()} to ${payslip.endDate.toLocaleDateString()}`);
        doc.moveDown();
  
        // Salary Breakdown with styling
        doc.fontSize(16)
           .fillColor('#27ae60')
           .text('Salary Breakdown');
        
        doc.fontSize(12)
           .fillColor('#333')
           .text(`Gross Pay: ETB ${payslip.grossPay.toLocaleString()}`)
           .text(`Deductions: ETB ${payslip.deduction.toLocaleString()}`);
        doc.moveDown();
  
        // Net Pay with styling and box
        doc.rect(doc.x, doc.y, 250, 40)
           .fillAndStroke('#f9f9f9', '#bdc3c7');
        
        doc.fontSize(16)
           .fillColor('#e74c3c')
           .text(`Net Pay: ETB ${payslip.netPay.toLocaleString()}`, 
                 doc.x + 10, doc.y - 30);
        
        // Footer with styling
        doc.moveDown(2);
        doc.fontSize(10)
           .fillColor('#7f8c8d')
           .text('This is a computer-generated document', { align: 'center' })
           .text('No signature required', { align: 'center' });
  
        doc.addPage();
      });
      
      doc.end();
    } catch (error) {
      res.status(500).json({ message: 'Error exporting payslips', error: error.message });
    }
  };
  