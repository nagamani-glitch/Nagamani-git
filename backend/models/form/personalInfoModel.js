import mongoose from 'mongoose';

const personalInfoSchema = new mongoose.Schema({
  employeeId: { 
    type: String, 
    unique: true 
  },
  prefix: { 
    type: String,
    required: [true, 'Prefix is required'],
    enum: ['Mr.', 'Ms.', 'Dr.']
  },
  firstName: { 
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  middleName: { 
    type: String,
    trim: true
  },
  lastName: { 
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  dob: { 
    type: Date,
    required: [true, 'Date of birth is required']
  },
  dobDay: String,
  dobMonth: String,
  dobYear: String,
  gender: { 
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other']
  },
  maritalStatus: { 
    type: String,
    required: [true, 'Marital status is required'],
    enum: ['Single', 'Married', 'Divorced', 'Widowed']
  },
  bloodGroup: { 
    type: String,
    required: [true, 'Blood group is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  nationality: { 
    type: String,
    required: [true, 'Nationality is required'],
    trim: true
  },
  aadharNumber: { 
    type: String,
    required: [true, 'Aadhar number is required'],
    validate: {
      validator: v => /^[0-9]{12}$/.test(v),
      message: 'Aadhar number must be 12 digits'
    }
  },
  panNumber: { 
    type: String,
    required: [true, 'PAN number is required'],
    validate: {
      validator: v => /^[A-Z0-9]{10}$/.test(v),
      message: 'PAN number must be 10 characters'
    }
  },
  mobileNumber: { 
    type: String,
    required: [true, 'Mobile number is required'],
    validate: {
      validator: v => /^[0-9]{10}$/.test(v),
      message: 'Mobile number must be 10 digits'
    }
  },
  email: { 
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Invalid email format'
    }
  },
  profileImage: { 
    type: String,
    required: [true, 'Profile image is required']
  }
}, {
  timestamps: true
});

const PersonalInfo = mongoose.model('PersonalInfo', personalInfoSchema);
export default PersonalInfo;
