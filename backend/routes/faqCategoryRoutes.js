import express from 'express';
const router = express.Router();
import FaqCategory from '../models/FaqCategory.js';
import Faq from '../models/Faq.js';



// Get all FAQ categories with counts
router.get('/', async (req, res) => {
    try {
        const categories = await FaqCategory.find();
        
        // Get counts for each category
        const categoriesWithCounts = await Promise.all(
            categories.map(async (category) => {
                const count = await Faq.countDocuments({ category: category._id });
                return {
                    ...category.toObject(),
                    faqCount: count
                };
            })
        );
        
        res.json(categoriesWithCounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get FAQ category by ID


router.get('/:id', async (req, res) => {
    try {
        const category = await FaqCategory.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        // Get count for this category
        const count = await Faq.countDocuments({ category: category._id });
        const categoryWithCount = {
            ...category.toObject(),
            faqCount: count
        };
        
        res.json(categoryWithCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const category = await FaqCategory.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        // Get count for this category
        const count = await Faq.countDocuments({ category: category._id });
        const categoryWithCount = {
            ...category.toObject(),
            faqCount: count
        };
        
        res.json(categoryWithCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Create new FAQ category
router.post('/', async (req, res) => {
    const category = new FaqCategory({
        title: req.body.title,
        description: req.body.description
    });

    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



// // Update FAQ category
router.put('/:id', async (req, res) => {
    try {
        const updatedCategory = await FaqCategory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// // Delete FAQ category
router.delete('/:id', async (req, res) => {
    try {
        await FaqCategory.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
