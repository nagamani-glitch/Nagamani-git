// routes/restrictLeaveRoutes.js
import express from 'express';
import RestrictLeave from '../models/restrictLeave.js';
const router = express.Router();

// GET all restricted leaves
router.get('/', async (req, res) => {
    try {
        const restrictLeaves = await RestrictLeave.find();
        res.json(restrictLeaves);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single restricted leave by ID
router.get('/:id', async (req, res) => {
    try {
        const restrictLeave = await RestrictLeave.findById(req.params.id);
        if (!restrictLeave) return res.status(404).json({ message: 'Restricted leave not found' });
        res.json(restrictLeave);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new restricted leave
router.post('/', async (req, res) => {
    const restrictLeave = new RestrictLeave({
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        department: req.body.department,
        jobPosition: req.body.jobPosition,
        description: req.body.description
    });

    try {
        const newRestrictLeave = await restrictLeave.save();
        res.status(201).json(newRestrictLeave);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT to update an existing restricted leave by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedRestrictLeave = await RestrictLeave.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                department: req.body.department,
                jobPosition: req.body.jobPosition,
                description: req.body.description
            },
            { new: true, runValidators: true }
        );
        if (!updatedRestrictLeave) return res.status(404).json({ message: 'Restricted leave not found' });
        res.json(updatedRestrictLeave);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a restricted leave by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedRestrictLeave = await RestrictLeave.findByIdAndDelete(req.params.id);
        if (!deletedRestrictLeave) return res.status(404).json({ message: 'Restricted leave not found' });
        res.json({ message: 'Restricted leave deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
