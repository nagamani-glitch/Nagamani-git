import express from 'express';
import FaqCategory from '../models/FaqCategory.js';

const router = express.Router();

// Get all FAQ categories
router.get('/', async (req, res) => {
    try {
        const categories = await FaqCategory.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new FAQ category
router.post('/', async (req, res) => {
    try {
        const newCategory = new FaqCategory({
            title: req.body.title,
            description: req.body.description
        });
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedCategory = await FaqCategory.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                description: req.body.description
            },
            { new: true }
        );
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ error: 'Error updating category' });
    }
});



// Delete an FAQ category
router.delete('/:id', async (req, res) => {
    try {
        await FaqCategory.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
