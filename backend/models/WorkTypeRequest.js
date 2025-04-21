// import mongoose from "mongoose";

// const workTypeRequestSchema = new mongoose.Schema(
//   {
//     employee: { type: String, required: true },
//     employeeCode: { type: String, required: true }, // Add this field
//     requestedShift: {
//       type: String,
//       required: true,
//       enum: ["Full Time", "Part Time", "Contract", "Freelance", "Remote"],
//     },
//     currentWorktype: {
//       type: String,
//       default: "Regular Shift",
//     },
//     requestedDate: { type: Date, required: true },
//     requestedTill: { type: Date, required: true },
//     status: {
//       type: String,
//       enum: ["Pending", "Approved", "Rejected"],
//       default: "Pending",
//     },
//     description: { type: String },
//     isPermanentRequest: { type: Boolean, default: false },
//   },
//   {
//     timestamps: true,
//   }
// );

// const WorkTypeRequest = mongoose.model(
//   "WorkTypeRequest",
//   workTypeRequestSchema
// );
// export default WorkTypeRequest;

import mongoose from "mongoose";

const workTypeRequestSchema = new mongoose.Schema(
  {
    employee: { type: String, required: true },
    employeeCode: { type: String, required: true },
    requestedShift: {
      type: String,
      required: true,
      enum: ["Full Time", "Part Time", "Contract", "Freelance", "Remote"],
    },
    currentWorktype: {  // Rename from currentShift to currentWorktype
      type: String,
      default: "Full Time",  // Change default from "Regular Shift" to "Full Time"
    },
    requestedDate: { type: Date, required: true },
    requestedTill: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    description: { type: String },
    isPermanentRequest: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const WorkTypeRequest = mongoose.model(
  "WorkTypeRequest",
  workTypeRequestSchema
);
export default WorkTypeRequest;
