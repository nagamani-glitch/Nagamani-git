import express from 'express';
import Faq from '../models/Faq.js';
import FaqCategory from '../models/FaqCategory.js';

const router = express.Router();

// Get FAQs by category
router.get('/category/:categoryId', async (req, res) => {
    try {
        const faqs = await Faq.find({ category: req.params.categoryId });
        res.json(faqs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new FAQ to a category
router.post('/category/:categoryId', async (req, res) => {
    try {
        const newFaq = new Faq({
            category: req.params.categoryId,
            question: req.body.question,
            answer: req.body.answer
        });
        const savedFaq = await newFaq.save();
        res.status(201).json(savedFaq);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an FAQ
router.put('/:id', async (req, res) => {
    try {
        const updatedFaq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedFaq);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an FAQ
router.delete('/:id', async (req, res) => {
    try {
        await Faq.findByIdAndDelete(req.params.id);
        res.json({ message: 'FAQ deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




export default router;
