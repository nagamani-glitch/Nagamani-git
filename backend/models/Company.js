import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  companyCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  logo: {
    type: String // URL to company logo
  },
  industry: {
    type: String,
    trim: true
  },
//   subscriptionPlan: {
//     type: String,
//     enum: ['free', 'basic', 'premium', 'enterprise'],
//     default: 'free'
//   },
//   subscriptionStatus: {
//     type: String,
//     enum: ['active', 'trial', 'expired', 'cancelled'],
//     default: 'trial'
//   },
//   trialEndsAt: {
//     type: Date
//   },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    leavePolicy: {
      casualLeavePerYear: { type: Number, default: 12 },
      sickLeavePerYear: { type: Number, default: 12 },
      earnedLeavePerYear: { type: Number, default: 12 }
    },
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '18:00' }
    },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  adminUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registrationNumber: {
    type: String,
    required: true,
    default: function() {
      // Generate a unique value, e.g., using company code and timestamp
      return `REG-${this.companyCode}-${Date.now()}`;
    },
    unique: true
  }
  
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);

export default Company;
