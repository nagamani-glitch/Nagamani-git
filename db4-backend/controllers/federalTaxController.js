import FederalTax from '../models/FederalTax.js';

export const federalTaxController = {
    getAllTaxes: async (req, res) => {
        try {
            const { search } = req.query;
            let query = {};
            
            if (search) {
                query = {
                    $or: [
                        { taxRate: { $regex: search, $options: 'i' } },
                        { minIncome: { $regex: search, $options: 'i' } },
                        { maxIncome: { $regex: search, $options: 'i' } }
                    ]
                };
            }
            
            const taxes = await FederalTax.find(query);
            res.status(200).json(taxes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createTax: async (req, res) => {
        try {
            const newTax = new FederalTax(req.body);
            const savedTax = await newTax.save();
            res.status(201).json(savedTax);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    updateTax: async (req, res) => {
        try {
            const updatedTax = await FederalTax.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.status(200).json(updatedTax);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteTax: async (req, res) => {
        try {
            await FederalTax.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Tax entry deleted successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};
