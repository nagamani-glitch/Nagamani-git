// import mongoose from 'mongoose';

// const AssetHistorySchema = new mongoose.Schema({
//   assetName: { type: String, required: true },
//   category: { type: String, required: true },
//   allottedDate: { type: Date, required: true },
//   returnDate: { type: Date },
//   status: { 
//     type: String, 
//     enum: ['In Use', 'Returned', 'Under Service', 'Available'], 
//     required: true 
//   },
//   batch: { type: String } // Add this field
// });

// export default mongoose.model('AssetHistory', AssetHistorySchema);

import mongoose from 'mongoose';

const AssetHistorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Changed from assetName to name
  category: { type: String, required: true },
  allottedDate: { type: Date, required: true },
  returnDate: { type: Date },
  status: { 
    type: String, 
    enum: ['In Use', 'Returned', 'Under Service', 'Available', 'Under Maintenance'], 
    required: true 
  },
  batch: { type: String },
  currentEmployee: { type: String },
  previousEmployees: [{ type: String }]
});

export default mongoose.model('AssetHistory', AssetHistorySchema);
