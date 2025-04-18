import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  currentEmployee: {
    type: String,
    default: null,
  },
  previousEmployees: {
    type: [String],
    default: [],
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssetBatch',
    default: null,
  },
  allottedDate: {
    type: Date,
    default: null,
  },
  returnDate: {
    type: Date,
    default: null,
  }
}, { timestamps: true });

export default mongoose.model('Asset', AssetSchema);