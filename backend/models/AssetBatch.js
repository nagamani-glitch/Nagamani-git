import mongoose from 'mongoose';

const assetBatchSchema = new mongoose.Schema({
  batchNumber: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  numberOfAssets: { type: Number, required: true }
});

export default mongoose.model('AssetBatch', assetBatchSchema);
