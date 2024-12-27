import Employee from "../models/employeeModel.js";
import employeeRegisterModel from "../models/employeeRegisterModel.js";

const getEmployees = async (req, res) => {
    const employees = await Employee.find({}).lean();
    res.json(employees);
};

const createEmployee = async (req, res) => {
    const { name, email, dob, phone, location, role, department, Emp_ID } = req.body;

    // Check if all fields are provided except the image (handled separately)
    if (!name || !email || !dob || !phone || !location || !role || !department || !Emp_ID) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Get the image path (uploaded by multer)
    const img = `/uploads/${req.file.filename}`; // File path for the uploaded image

    try {
        const employee = new Employee({
            name,
            email,
            dob,
            img, // Store the image URL/path
            phone,
            location,
            role,
            department,
            Emp_ID,
        });

        const createdEmployee = await employee.save();
        res.status(201).json(createdEmployee);
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const registerEmployee =async(req, res)=>{
    try{
    console.log("body:", req.body)
    const {personalInfo, addressInfo, joiningDetails, trainingDetails, educationDetails, familyDetails, serviceHistory, nominationDetails} = req.body
    const newEmployee = new employeeRegisterModel({
        personalInfo, addressInfo, joiningDetails, educationDetails,trainingDetails, familyDetails, serviceHistory, nominationDetails
    })
   await newEmployee.save()
   console.log("new employee:", newEmployee)
   res.status(201).json({message:"Employee Registered successFully", employee: newEmployee})
}catch(error){
    console.log(error)
    res.status(500).json({message:"error registering employee", error:error.message})

}

}

export { getEmployees, createEmployee, registerEmployee};
