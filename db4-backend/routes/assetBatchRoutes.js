import express from 'express';
import AssetBatch from '../models/AssetBatch.js';
const router = express.Router();

// Get all asset batches
router.get('/', async (req, res) => {
  try {
    const assetBatches = await AssetBatch.find();
    res.json(assetBatches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search asset batches by query
router.get('/search', async (req, res) => {
  const query = req.query.q;
  try {
    const assetBatches = await AssetBatch.find({
      $or: [
        { batchNumber: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(assetBatches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new asset batch
router.post('/', async (req, res) => {
  const assetBatch = new AssetBatch({
    batchNumber: req.body.batchNumber,
    description: req.body.description,
    numberOfAssets: req.body.numberOfAssets
  });
  try {
    const newBatch = await assetBatch.save();
    res.status(201).json(newBatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an asset batch by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedBatch = await AssetBatch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedBatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an asset batch by ID
router.delete('/:id', async (req, res) => {
  try {
    await AssetBatch.findByIdAndDelete(req.params.id);
    res.json({ message: 'Asset batch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
