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
}, { timestamps: true });

export default mongoose.model('Asset', AssetSchema);
