import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'In Use', 'Under Maintenance', 'Under Service', 'Disposed'],
    default: 'Available'
  },
  currentEmployee: {
    type: String,
    trim: true
  },
  previousEmployees: [{
    type: String,
    trim: true
  }],
  allottedDate: {
    type: Date
  },
  returnDate: {
    type: Date
  },
  batch: {
    type: String,
    trim: true,
    ref: 'AssetBatch' // Reference to the AssetBatch model
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Asset = mongoose.model('Asset', assetSchema);

export default Asset;
