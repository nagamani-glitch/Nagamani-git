import Payslip from '../models/Payslip.js';

export const payslipController = {
  // Get all payslips with filters
  getAllPayslips: async (req, res) => {
    try {
      const query = {};
      const { startDate, endDate, status, batch, grossPayLessThan, grossPayGreaterOrEqual } = req.query;

      if (startDate) query.startDate = { $gte: new Date(startDate) };
      if (endDate) query.endDate = { $lte: new Date(endDate) };
      if (status) query.status = status;
      if (batch) query.batch = batch;
      if (grossPayLessThan) query.grossPay = { $lte: parseFloat(grossPayLessThan) };
      if (grossPayGreaterOrEqual) query.grossPay = { $gte: parseFloat(grossPayGreaterOrEqual) };

      const payslips = await Payslip.find(query);
      res.json(payslips);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new payslip
  createPayslip: async (req, res) => {
    try {
      const { employee, startDate, endDate, grossPay, deduction } = req.body;
      const netPay = grossPay - (deduction || 0);
      
      const newPayslip = new Payslip({
        ...req.body,
        netPay
      });
      
      const savedPayslip = await newPayslip.save();
      res.status(201).json(savedPayslip);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update payslip
  updatePayslip: async (req, res) => {
    try {
      const updatedPayslip = await Payslip.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedPayslip);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete payslip
  deletePayslip: async (req, res) => {
    try {
      await Payslip.findByIdAndDelete(req.params.id);
      res.json({ message: 'Payslip deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
