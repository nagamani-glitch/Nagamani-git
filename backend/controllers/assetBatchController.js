import AssetBatch from '../models/AssetBatch.js';
import Asset from '../models/Asset.js';

// Get all asset batches
export const getAllAssetBatches = async (req, res) => {
  try {
    const batches = await AssetBatch.find().sort({ createdAt: -1 });
    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single batch by ID
export const getAssetBatchById = async (req, res) => {
  try {
    const batch = await AssetBatch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.status(200).json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single batch by batch number
export const getAssetBatchByNumber = async (req, res) => {
  try {
    const batch = await AssetBatch.findOne({ batchNumber: req.params.batchNumber });
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.status(200).json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new asset batch
export const createAssetBatch = async (req, res) => {
  try {
    const newBatch = new AssetBatch(req.body);
    const savedBatch = await newBatch.save();
    res.status(201).json(savedBatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an asset batch
export const updateAssetBatch = async (req, res) => {
  try {
    const updatedBatch = await AssetBatch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBatch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.status(200).json(updatedBatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an asset batch
export const deleteAssetBatch = async (req, res) => {
  try {
    // Check if any assets are using this batch
    const assetsUsingBatch = await Asset.findOne({ batch: req.params.id });
    if (assetsUsingBatch) {
      return res.status(400).json({ 
        message: 'Cannot delete batch because it is associated with one or more assets' 
      });
    }
    
    const deletedBatch = await AssetBatch.findByIdAndDelete(req.params.id);
    if (!deletedBatch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.status(200).json({ message: 'Batch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get assets by batch
export const getAssetsByBatch = async (req, res) => {
  try {
    const assets = await Asset.find({ batch: req.params.batchNumber });
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};