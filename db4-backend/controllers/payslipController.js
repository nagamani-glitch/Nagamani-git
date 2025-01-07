import Payslip from '../models/Payslip.js';

export const payslipController = {
    // Get all payslips with comprehensive filtering
    getAllPayslips: async (req, res) => {
        try {
            const {
                startDate,
                endDate,
                status,
                batch,
                mailSent,
                grossPayLessThan,
                grossPayGreaterOrEqual,
                deductionLessThan,
                deductionGreaterOrEqual,
                netPayLessThan,
                netPayGreaterOrEqual,
                searchText
            } = req.query;

            let query = {};

            // Date filters
            if (startDate) query.startDate = { $gte: new Date(startDate) };
            if (endDate) query.endDate = { $lte: new Date(endDate) };
            
            // Status and batch filters
            if (status) query.status = status;
            if (batch) query.batch = batch;
            if (mailSent) query.mailSent = mailSent === 'true';

            // Numeric range filters
            if (grossPayLessThan) query.grossPay = { ...query.grossPay, $lte: parseFloat(grossPayLessThan) };
            if (grossPayGreaterOrEqual) query.grossPay = { ...query.grossPay, $gte: parseFloat(grossPayGreaterOrEqual) };
            if (deductionLessThan) query.deduction = { ...query.deduction, $lte: parseFloat(deductionLessThan) };
            if (deductionGreaterOrEqual) query.deduction = { ...query.deduction, $gte: parseFloat(deductionGreaterOrEqual) };
            if (netPayLessThan) query.netPay = { ...query.netPay, $lte: parseFloat(netPayLessThan) };
            if (netPayGreaterOrEqual) query.netPay = { ...query.netPay, $gte: parseFloat(netPayGreaterOrEqual) };

            // Text search
            if (searchText) {
                query.$or = [
                    { employee: { $regex: searchText, $options: 'i' } },
                    { batch: { $regex: searchText, $options: 'i' } }
                ];
            }

            const payslips = await Payslip.find(query).sort({ createdAt: -1 });
            res.json(payslips);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create new payslip
    createPayslip: async (req, res) => {
        try {
            const payslip = new Payslip(req.body);
            const savedPayslip = await payslip.save();
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
                { new: true, runValidators: true }
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
    },

    // Bulk delete payslips
    bulkDeletePayslips: async (req, res) => {
        try {
            const { ids } = req.body;
            await Payslip.deleteMany({ _id: { $in: ids } });
            res.json({ message: 'Payslips deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update mail sent status
    updateMailStatus: async (req, res) => {
        try {
            const updatedPayslip = await Payslip.findByIdAndUpdate(
                req.params.id,
                { mailSent: true },
                { new: true }
            );
            res.json(updatedPayslip);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};
