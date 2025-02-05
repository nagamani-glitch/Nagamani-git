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
  
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    maritalStatus: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    nationality: { type: String, required: true },
    aadharNumber: { type: String, required: true },
    panNumber: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true }
  },

  addressInfo: {
    presentAddress: { type: String, required: true },
    presentCity: { type: String, required: true },
    presentState: { type: String, required: true },
    presentPinCode: { type: String, required: true },
    presentCountry: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    permanentCity: { type: String, required: true },
    permanentState: { type: String, required: true },
    permanentPinCode: { type: String, required: true },
    permanentCountry: { type: String, required: true }
  },

  joiningDetails: {
    dateOfAppointment: { type: Date, required: true },
    officeName: { type: String, required: true },
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
    block: { type: String },
    panchayatMandal: { type: String },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    phoneNumber: { type: String, required: true }
  }
}, {
  timestamps: true
});

export default mongoose.model('EmployeeRegister', employeeRegisterSchema);

// import mongoose from 'mongoose';

// const employeeRegisterSchema = new mongoose.Schema({
//   Emp_ID: String,
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true },
//   department: { type: String, required: true },
//   role: { type: String, required: true },
//   location: String,  
//   dob: Date,
//   img: { 
//     type: String,
//     required: true 
//   },
//   personalInfo: {
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     dob: { type: Date, required: true },
//     gender: { type: String, required: true },
//     maritalStatus: { type: String, required: true },
//     bloodGroup: { type: String, required: true },
//     nationality: { type: String, required: true },
//     aadharNumber: { type: String, required: true },
//     panNumber: { type: String, required: true },
//     mobileNumber: { type: String, required: true },
//     email: { type: String, required: true }
//   },
//   addressInfo: {
//     presentAddress: { type: String, required: true },
//     presentCity: { type: String, required: true },
//     presentState: { type: String, required: true },
//     presentPinCode: { type: String, required: true },
//     presentCountry: { type: String, required: true },
//     permanentAddress: { type: String, required: true },
//     permanentCity: { type: String, required: true },
//     permanentState: { type: String, required: true },
//     permanentPinCode: { type: String, required: true },
//     permanentCountry: { type: String, required: true }
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.model('EmployeeRegister', employeeRegisterSchema);

// import mongoose from 'mongoose';

// const employeeRegisterSchema = new mongoose.Schema({
//   Emp_ID: String,
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true },
//   department: { type: String, required: true },
//   role: { type: String, required: true },
//   img: { type: String }, 
//   location: String,  
//   dob: Date,
//   personalInfo: {type: Object,default: {}},
//   addressInfo: {type: Object,default: {}},
//   joiningDetails: {type: Object,default: {}},
//   educationDetails: {type: Object,default: {}},
//   trainingDetails: {type: Object,default: {}},
//   trainingInIndia: {type: Object,default: {}},
//   trainingInAbroad: {type: Object,default: {}},
//   familyDetails: {type: Object,default: {}},
//   serviceHistory: {type: Object,default: {}},
//   nominationDetails: {type: Object,default: {}},
//   img: {
//     type: String,
//     required: true
//   }
// }, {
//   timestamps: true,
//   strict: false
// });

// export default mongoose.model('EmployeeRegister', employeeRegisterSchema);



// import mongoose from 'mongoose';

// const registerSchema = new mongoose.Schema({
//   personalInfo: {
//     firstName: String,
//     lastName: String,
//     dob: Date,
//     gender: String,
//     maritalStatus: String,
//     caste: String,
//     category: String,
//     religion: String,
//     bloodGroup: String,
//     homeState: String,
//     homeDistrict: String
//   },
//   addressInfo: {
//     presentAddress: String,
//     block: String,
//     panchayat: String,
//     district: String,
//     state: String,
//     pinCode: String,
//     phoneNumber: String,
//     permanentAddress: String,
//     permanentBlock: String,
//     permanentPanchayat: String,
//     permanentDistrict: String,
//     permanentState: String,
//     permanentPinCode: String
//   },
//   joiningDetails: {
//     dateOfAppointment: Date,
//     officeName: String,
//     dateOfJoining: Date,
//     initialDesignation: String,
//     modeOfRecruitment: String,
//     employeeType: String
//   },
//   educationDetails: {
//     basic: [{
//       education: String,
//       board: String,
//       marks: String,
//       year: String,
//       stream: String,
//       grade: String
//     }],
//     technical: [{
//       education: String,
//       board: String,
//       marks: String,
//       year: String,
//       stream: String,
//       grade: String
//     }],
//     professional: [{
//       education: String,
//       board: String,
//       marks: String,
//       year: String,
//       stream: String,
//       grade: String
//     }]
//   },
//   trainingDetails: {
//     trainingInIndia: [{
//       type: String,
//       topic: String,
//       institute: String,
//       sponsor: String,
//       from: Date,
//       to: Date
//     }],
//     trainingAbroad: [{
//       type: String,
//       topic: String,
//       institute: String,
//       sponsor: String,
//       from: Date,
//       to: Date
//     }]
//   },
//   serviceHistory: [{
//     transactionType: String,
//     office: String,
//     post: String,
//     orderNumber: String,
//     orderDate: Date,
//     incrementDate: Date,
//     payScale: String,
//     otherDept: String,
//     areaType: String
//   }],
//   nominationDetails: {
//     name: String,
//     relation: String,
//     typeOfNomination: String,
//     nominationPercentage: Number,
//     nomineeAge: Number,
//     presentAddress: String,
//     block: String,
//     panchayatMandal: String,
//     district: String,
//     state: String,
//     pinCode: String,
//     phoneNumber: String
//   },
//   profileImage: String,
//   employeeId: {
//     type: String,
//     unique: true,
//     required: true
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.model('employeeRegisterModel', registerSchema);



// import mongoose from "mongoose";

// const registerSchema = mongoose.Schema({
//     user:{
//         type:mongoose.Schema.Types.ObjectId,
//         required:true,
//         ref:"User"
//     },
//     personalInfo:{
//         firstname:{type:String, },
//         middlename:{type:String},
//         lastname:{type:String, },
//         dob:{type:Date, },
//         parentName:{type:String,},
//         gender:{type:String,},
//         maritalStatus:{type:String, },
//         caste:{type:String,},
//         category:{type:String,},
//         religion:{type:String,},
//         bloodgroup:{type:String,},
//         homeState:{type:String,},
//         homeDistrict:{type:String,}
//     },
//     addressInfo:{
//         presentAddress:{type:String,},
//         block:{type:String,},
//         panchayat:{type:String,},
//         district:{type:String,},
//         state:{type:String, },
//         pincode:{type:Number,},
//         phoneNumber:{type:Number, },
//         permanentAddress:{type:String,},
//         permanentBlock:{type:String,},
//         permanentPanchayat:{type:String,},
//         permanentDistrict:{type:String, },
//         permanentState:{type:String,},
//         permanentPincode:{type:Number,}
//     },
//     joiningDetails:{
//         dateOfAppointment:{type:Date,},
//         officeName:{type:String, },
//         dateOfJoining:{type:Date,},
//         initialDesignation:{type:String,},
//         modeOfRecruitment:{type:String,},
//         employeeType:{type:String,}
//     },
//     educationDetails:{
//         basic: [
//             {
//                 education: {type: String,},
//                 board: {type: String,},
//                 marks: {type: String,},
//                 year: {type: String,},
//                 stream: {type: String,},
//                 grade: {type: String,},
//             }
//         ],
//         technical: [
//             {
//                 education: {type: String},
//                 board: {type: String, },
//                 marks: {type: String, },
//                 year: {type: String, },
//                 stream: {type: String,},
//                 grade: {type: String, },
//             }
//         ],
//         professional: [
//             {
//                 education: {type: String, },
//                 board: {type: String, },
//                 marks: {type: String, },
//                 year: {type: String, },
//                 stream: {type: String, },
//                 grade: {type: String, },
//             }
//         ]
//     },
//     trainingDetails: {
//         trainingInIndia: [
//             {
//                 type: {type: String, },
//                 topic: {type: String, },
//                 institute: {type: String, },
//                 sponsor: {type: String, },
//                 from: {type: String, },
//                 to: {type: String, },
//             }
//         ],
//         trainingAbroad: [
//             {
//                 type: {type: String, },
//                 topic: {type: String, },
//                 institute: {type: String, },
//                 sponsor: {type: String, },
//                 from: {type: String, },
//                 to: {type: String, },
//             }
//         ]
//     },
//     familyDetails:[{
//         name:{type:String},
//         relation:{type:String,},
//         dob:{type:Date},
//         dependent:{type:String, },
//         employed:{type:String, },
//         sameDept:{type:String, },
//         empCode:{type:String, },
//         department:{type:String, },
//         eSalaryCode:{type:String, }
//     }],
//     serviceHistory:[
//         {transactionType:{type:String, },
//         office:{type:String, },
//         post:{type:String,},
//         orderNumber:{type:String,},
//         orderDate:{type:String,},
//         incrementDate:{type:String,},
//         payScale:{type:String,},
//         otherDept:{type:String,},
//         areaType:{type:String,},}
//     ],
//     nominationDetails:{
//         name:{type:String, },
//         relation:{type:String, },
//         typeOfNomination:{type:String,},
//         nominationPercentage:{type:Number, },
//         nomineeAge:{type:Number},
//         presentAddress:{type:String,},
//         block:{type:String,},
//         panchayatMandal:{type:String},
//         district:{type:String},
//         state:{type:String},
//         pincode:{type:String},
//         phoneNumber:{type:String},
//     }
// });

// const employeeRegisterModel = mongoose.model("employeeRegisterModel", registerSchema);

// export default employeeRegisterModel;
