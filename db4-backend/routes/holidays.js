import express from 'express';
import Holiday from '../models/Holiday.js';
const router = express.Router();


// Get all holidays
router.get('/', async (req, res) => {
    try {
        const holidays = await Holiday.find();
        res.status(200).json(holidays);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching holidays', error });
    }
});

// Create a new holiday
router.post('/', async (req, res) => {
    const { name, startDate, endDate, recurring } = req.body;
    try {
        const holiday = new Holiday({ name, startDate, endDate, recurring });
        await holiday.save();
        res.status(201).json(holiday);
    } catch (error) {
        res.status(500).json({ message: 'Error creating holiday', error });
    }
});

// Update a holiday by ID
router.put('/:id', async (req, res) => {
    const { name, startDate, endDate, recurring } = req.body;
    try {
        const holiday = await Holiday.findByIdAndUpdate(req.params.id, { name, startDate, endDate, recurring }, { new: true });
        res.status(200).json(holiday);
    } catch (error) {
        res.status(500).json({ message: 'Error updating holiday', error });
    }
});

// Delete a holiday by ID
router.delete('/:id', async (req, res) => {
    try {
        await Holiday.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Holiday deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting holiday', error });
    }
});

// Filter holidays by date range and recurring status
router.get('/filter', async (req, res) => {
    const { fromDate, toDate, recurring } = req.query;
    const filter = {};

    if (fromDate && toDate) {
        filter.startDate = { $gte: new Date(fromDate) };
        filter.endDate = { $lte: new Date(toDate) };
    }

    if (recurring !== undefined) {
        filter.recurring = recurring === 'true';
    }

    try {
        const holidays = await Holiday.find(filter);
        res.status(200).json(holidays);
    } catch (error) {
        res.status(500).json({ message: 'Error filtering holidays', error });
    }
});

export default router;