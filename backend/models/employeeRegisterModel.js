import mongoose from 'mongoose';

const employeeRegisterSchema = new mongoose.Schema({
  Emp_ID: String,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, required: true },
  location: String,  
  dob: Date,
  img: { type: String, required: true },


  // Update the personalInfo section in employeeRegisterSchema
personalInfo: {
  prefix: { type: String, required: true, enum: ['Mr.', 'Ms.', 'Dr.'] },
  firstName: { type: String, required: true, trim: true },
  middleName: { type: String, trim: true },
  lastName: { type: String, required: true, trim: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  maritalStatus: { type: String, required: true, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  nationality: { type: String, required: true, trim: true },
  aadharNumber: {
    type: String,
    required: true,
    validate: {
      validator: v => /^[0-9]{12}$/.test(v),
      message: 'Aadhar number must be 12 digits'
    }
  },
  panNumber: {
    type: String,
    required: true,
    validate: {
      validator: v => /^[A-Z0-9]{10}$/.test(v),
      message: 'PAN number must be 10 characters'
    }
  },
  mobileNumber: {
    type: String,
    required: true,
    validate: {
      validator: v => /^[0-9]{10}$/.test(v),
      message: 'Mobile number must be 10 digits'
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Invalid email format'
    }
  },
  employeeImage: { type: String, required: true }
},

  
  // personalInfo: {
  //   firstName: { type: String, required: true },
  //   lastName: { type: String, required: true },
  //   dob: { type: Date, required: true },
  //   gender: { type: String, required: true },
  //   maritalStatus: { type: String, required: true },
  //   bloodGroup: { type: String, required: true },
  //   nationality: { type: String, required: true },
  //   aadharNumber: { type: String, required: true },
  //   panNumber: { type: String, required: true },
  //   mobileNumber: { type: String, required: true },
  //   email: { type: String, required: true }
  // },

  addressInfo: {
    presentAddress: { type: String, required: true },
    presentCity: { type: String, required: true },
    presentDistrict: { type: String, required: true },
    presentState: { type: String, required: true },
    presentPinCode: { type: String, required: true },
    presentCountry: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    permanentCity: { type: String, required: true },
    permanentDistrict: { type: String, required: true },
    permanentState: { type: String, required: true },
    permanentPinCode: { type: String, required: true },
    permanentCountry: { type: String, required: true }
  },

  joiningDetails: {
    dateOfAppointment: { type: Date, required: true },
    department: { type: String, required: true },
    dateOfJoining: { type: Date, required: true },
    initialDesignation: { type: String, required: true },
    modeOfRecruitment: { type: String, required: true },
    employeeType: { type: String, required: true }
  },

  educationDetails: {
    basic: [{
      education: { type: String, required: true },
      board: { type: String, required: true },
      marks: { type: String, required: true },
      year: { type: String, required: true },
      stream: { type: String, required: true },
      grade: { type: String, required: true }
    }],
    technical: [{
      education: { type: String },
      board: { type: String },
      marks: { type: String },
      year: { type: String },
      stream: { type: String },
      grade: { type: String }
    }],
    professional: [{
      education: { type: String },
      board: { type: String },
      marks: { type: String },
      year: { type: String },
      stream: { type: String },
      grade: { type: String }
    }]
  },

  trainingDetails: {
    trainingInIndia: [{
      type: { type: String },
      topic: { type: String },
      institute: { type: String },
      sponsor: { type: String },
      from: { type: Date },
      to: { type: Date }
    }],
    trainingAbroad: [{
      type: { type: String },
      topic: { type: String },
      institute: { type: String },
      sponsor: { type: String },
      from: { type: Date },
      to: { type: Date }
    }]
  },


  familyDetails: [{
    name: { type: String, required: true },
    relation: { type: String, required: true },
    dob: { type: Date, required: true },
    dependent: { type: String, required: true },
    employed: { type: String, required: true },
    sameDept: { type: String },
    empCode: { type: String },
    department: { type: String },
    eSalaryCode: { type: String }
  }],

  serviceHistory: [{
    transactionType: { type: String, required: true },
    office: { type: String, required: true },
    post: { type: String, required: true },
    orderNumber: { type: String, required: true },
    orderDate: { type: Date, required: true },
    incrementDate: { type: Date, required: true },
    payScale: { type: String, required: true },
    otherDept: { type: String },
    areaType: { type: String }
  }],

  nominationDetails: {
    name: { type: String, required: true },
    relation: { type: String, required: true },
    typeOfNomination: { type: String, required: true },
    nominationPercentage: { type: Number, required: true },
    nomineeAge: { type: Number, required: true },
    presentAddress: { type: String, required: true },
    city: { type: String, required: true },    
    district: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    phoneNumber: { type: String, required: true }
  },

  bankInfo: {
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    branchName: { type: String },
    branchAddress: { type: String },
    accountType: { type: String }
  },
  
}, {
  timestamps: true
});

export default mongoose.model('EmployeeRegister', employeeRegisterSchema);

