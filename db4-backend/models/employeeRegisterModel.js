import mongoose from "mongoose";

const registerSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    personalInfo:{
        firstname:{type:String, },
        middlename:{type:String},
        lastname:{type:String, },
        dob:{type:Date, },
        parentName:{type:String,},
        gender:{type:String,},
        maritalStatus:{type:String, },
        caste:{type:String,},
        category:{type:String,},
        religion:{type:String,},
        bloodgroup:{type:String,},
        homeState:{type:String,},
        homeDistrict:{type:String,}
    },
    addressInfo:{
        presentAddress:{type:String,},
        block:{type:String,},
        panchayat:{type:String,},
        district:{type:String,},
        state:{type:String, },
        pincode:{type:Number,},
        phoneNumber:{type:Number, },
        permanentAddress:{type:String,},
        permanentBlock:{type:String,},
        permanentPanchayat:{type:String,},
        permanentDistrict:{type:String, },
        permanentState:{type:String,},
        permanentPincode:{type:Number,}
    },
    joiningDetails:{
        dateOfAppointment:{type:Date,},
        officeName:{type:String, },
        dateOfJoining:{type:Date,},
        initialDesignation:{type:String,},
        modeOfRecruitment:{type:String,},
        employeeType:{type:String,}
    },
    educationDetails:{
        basic: [
            {
                education: {type: String,},
                board: {type: String,},
                marks: {type: String,},
                year: {type: String,},
                stream: {type: String,},
                grade: {type: String,},
            }
        ],
        technical: [
            {
                education: {type: String},
                board: {type: String, },
                marks: {type: String, },
                year: {type: String, },
                stream: {type: String,},
                grade: {type: String, },
            }
        ],
        professional: [
            {
                education: {type: String, },
                board: {type: String, },
                marks: {type: String, },
                year: {type: String, },
                stream: {type: String, },
                grade: {type: String, },
            }
        ]
    },
    trainingDetails: {
        trainingInIndia: [
            {
                type: {type: String, },
                topic: {type: String, },
                institute: {type: String, },
                sponsor: {type: String, },
                from: {type: String, },
                to: {type: String, },
            }
        ],
        trainingAbroad: [
            {
                type: {type: String, },
                topic: {type: String, },
                institute: {type: String, },
                sponsor: {type: String, },
                from: {type: String, },
                to: {type: String, },
            }
        ]
    },
    familyDetails:[{
        name:{type:String},
        relation:{type:String,},
        dob:{type:Date},
        dependent:{type:String, },
        employed:{type:String, },
        sameDept:{type:String, },
        empCode:{type:String, },
        department:{type:String, },
        eSalaryCode:{type:String, }
    }],
    serviceHistory:[
        {transactionType:{type:String, },
        office:{type:String, },
        post:{type:String,},
        orderNumber:{type:String,},
        orderDate:{type:String,},
        incrementDate:{type:String,},
        payScale:{type:String,},
        otherDept:{type:String,},
        areaType:{type:String,},}
    ],
    nominationDetails:{
        name:{type:String, },
        relation:{type:String, },
        typeOfNomination:{type:String,},
        nominationPercentage:{type:Number, },
        nomineeAge:{type:Number},
        presentAddress:{type:String,},
        block:{type:String,},
        panchayatMandal:{type:String},
        district:{type:String},
        state:{type:String},
        pincode:{type:String},
        phoneNumber:{type:String},
    }
});

const employeeRegisterModel = mongoose.model("employeeRegisterModel", registerSchema);

export default employeeRegisterModel;
