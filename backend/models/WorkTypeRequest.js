import mongoose from "mongoose";

const workTypeRequestSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    employeeCode: { 
      type: String, 
      required: true 
    },
    userId: {
      type: String,
      required: true
    },
    requestedWorktype: {
      type: String,
      required: true,
      enum: ["Full Time", "Part Time", "Contract", "Freelance", "Remote"],
    },
    currentWorktype: {
      type: String,
      default: "Full Time",
    },
    requestedDate: { 
      type: Date, 
      required: true 
    },
    requestedTill: { 
      type: Date, 
      required: true 
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    description: { 
      type: String 
    },
    isPermanentRequest: { 
      type: Boolean, 
      default: false 
    },
    reviewedBy: {
      type: String
    },
    reviewedAt: {
      type: Date
    }
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
