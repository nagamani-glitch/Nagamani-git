import EmployeeRegister from '../models/employeeRegisterModel.js';

// ✅ Generate Unique Employee Code
export const generateEmployeeCode = async () => {
  try {
    const latestEmployee = await EmployeeRegister.findOne().sort({ Emp_ID: -1 });
    if (!latestEmployee || !latestEmployee.Emp_ID) {
      return 'DB-0001';
    }
    const currentNumber = parseInt(latestEmployee.Emp_ID.split('-')[1], 10);
    return `DB-${String(currentNumber + 1).padStart(4, '0')}`;
  } catch (error) {
    throw new Error('Failed to generate employee code');
  }
};

// ✅ Centralized Error Handler
export const handleError = (error) => ({
  success: false,
  details: error.errors ? Object.values(error.errors).map(err => err.message) : [error.message || 'An error occurred']
});

// ✅ Save or Update Personal Info
export const savePersonalInfo = async (req, res) => {
  try {
    const data = JSON.parse(req.body.formData);
    let { Emp_ID, personalInfo } = data;

    if (!Emp_ID) {
      Emp_ID = await generateEmployeeCode();
    }

    let employee = await EmployeeRegister.findOneAndUpdate(
      { Emp_ID },
      { $set: { personalInfo, ...(req.file && { 'personalInfo.employeeImage': req.file.path }) } },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, employeeId: employee.Emp_ID, message: 'Personal info saved successfully' });
  } catch (error) {
    res.status(400).json(handleError(error));
  }
};

// ✅ Generic Function for Updating Employee Info
const updateEmployeeField = async (req, res, field) => {
  try {
    const { Emp_ID, formData } = req.body;
    if (!Emp_ID) return res.status(400).json({ success: false, message: 'Emp_ID is required' });

    const employee = await EmployeeRegister.findOneAndUpdate(
      { Emp_ID },
      { $set: { [field]: formData } },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({ success: true, message: `${field} updated successfully` });
  } catch (error) {
    res.status(500).json(handleError(error));
  }
};

// ✅ Save Address Info
export const saveAddressInfo = (req, res) => updateEmployeeField(req, res, 'addressInfo');

// ✅ Save Joining Details
export const saveJoiningDetails = (req, res) => updateEmployeeField(req, res, 'joiningDetails');

// ✅ Save Education Details
export const saveEducationDetails = (req, res) => updateEmployeeField(req, res, 'educationDetails');

// ✅ Save Family Details
export const saveFamilyDetails = (req, res) => updateEmployeeField(req, res, 'familyDetails');

// ✅ Save Service History
export const saveServiceHistory = (req, res) => updateEmployeeField(req, res, 'serviceHistory');

// ✅ Save Nomination Details
export const saveNominationDetails = (req, res) => updateEmployeeField(req, res, 'nominationDetails');

// ✅ Fetch Employee Data
export const getEmployeeData = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await EmployeeRegister.findOne({ Emp_ID: employeeId });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json(handleError(error));
  }
};

// import EmployeeRegister from '../models/employeeRegisterModel.js';

// export const generateEmployeeCode = async () => {
//   try {
//     const latestEmployee = await EmployeeRegister.findOne().sort({ Emp_ID: -1 });
//     if (!latestEmployee || !latestEmployee.Emp_ID) {
//       return 'DB-0001';
//     }
//     const currentNumber = parseInt(latestEmployee.Emp_ID.split('-')[1], 10);
//     const newCode = `DB-${String(currentNumber + 1).padStart(4, '0')}`;
//     return newCode;
//   } catch (error) {
//     throw new Error('Failed to generate employee code');
//   }
// };

// export const handleError = (error) => {
//     if (error.errors) {
//       return {
//         success: false,
//         details: Object.values(error.errors).map(err => err.message)
//       };
//     }
    
//     return {
//       success: false,
//       details: [error.message || 'An error occurred while saving personal information']
//     };
//   };

// // ✅ Save Personal Info (First Step)
//   export const savePersonalInfo = async (req, res) => {
//   try {
//     const data = JSON.parse(req.body.formData);
//     let { Emp_ID, personalInfo } = data;
//     console.log("Received Emp_ID:", Emp_ID);
//     console.log("Received Personal Info:", personalInfo);

//     // If no Emp_ID is provided, generate a new one
//     if (!Emp_ID) {
//       Emp_ID = `EMP${Date.now()}`;
//     }

//     // Check if employee already exists
//     let employee = await EmployeeRegister.findOne({ Emp_ID });

//     if (!employee) {
//       employee = new EmployeeRegister({ Emp_ID, personalInfo });
//     } else {
//       employee.personalInfo = personalInfo;
//     }

//     if (req.file) {
//       employee.personalInfo.employeeImage = req.file.path;
//     }

//     await employee.save();

//     res.status(200).json({
//       success: true,
//       employeeId: Emp_ID,
//       message: 'Personal information saved successfully'
//     });
//   } catch (error) {
//     console.error("Error in saving personal info:", error);
//     const errorResponse = handleError(error);
//     res.status(400).json(errorResponse);
//   }
// };


// // ✅ Save Address Info Separately (Ensuring Merging of Existing Data)
// export const saveAddressInfo = async (req, res) => {
//   try {
//     const { employeeId, formData } = req.body;
//     const employee = await EmployeeRegister.findOne({ Emp_ID: employeeId });
    
//     if (!employee) {
//       return res.status(404).json({ success: false, message: 'Employee not found' });
//     }

//     employee.addressInfo = { ...employee.addressInfo, ...formData }; // Merging data
//     await employee.save();

//     res.status(200).json({
//       success: true,
//       employeeId: employee.Emp_ID,
//       message: 'Address information updated successfully'
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ✅ Save Joining Details Separately (Ensuring Merging of Existing Data)
// export const saveJoiningDetails = async (req, res) => {
//   try {
//     const { employeeId, formData } = req.body;
//     const employee = await EmployeeRegister.findOne({ Emp_ID: employeeId });
    
//     if (!employee) {
//       return res.status(404).json({ success: false, message: 'Employee not found' });
//     }

//     employee.joiningDetails = { ...employee.joiningDetails, ...formData }; // Merging data
//     await employee.save();

//     res.status(200).json({
//       success: true,
//       employeeId: employee.Emp_ID,
//       message: 'Joining details updated successfully'
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ✅ Save Education Details
// export const saveEducationDetails = async (req, res) => {
//   try {
//     const { employeeId, formData } = req.body;
//     const employee = await EmployeeRegister.findOne({ Emp_ID: employeeId });

//     if (!employee) {
//       return res.status(404).json({ success: false, message: 'Employee not found' });
//     }

//     employee.educationDetails = formData;
//     await employee.save();

//     res.status(200).json({
//       success: true,
//       employeeId: employee.Emp_ID,
//       message: 'Education details updated successfully'
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ✅ Save Family Details
// export const saveFamilyDetails = async (req, res) => {
//   try {
//     const { employeeId, formData } = req.body;
//     const employee = await EmployeeRegister.findOne({ Emp_ID: employeeId });

//     if (!employee) {
//       return res.status(404).json({ success: false, message: 'Employee not found' });
//     }

//     employee.familyDetails = formData;
//     await employee.save();

//     res.status(200).json({
//       success: true,
//       employeeId: employee.Emp_ID,
//       message: 'Family details updated successfully'
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ✅ Save Service History
// export const saveServiceHistory = async (req, res) => {
//   try {
//     const { employeeId, formData } = req.body;
//     const employee = await EmployeeRegister.findOne({ Emp_ID: employeeId });

//     if (!employee) {
//       return res.status(404).json({ success: false, message: 'Employee not found' });
//     }

//     employee.serviceHistory = formData;
//     await employee.save();

//     res.status(200).json({
//       success: true,
//       employeeId: employee.Emp_ID,
//       message: 'Service history updated successfully'
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ✅ Save Nomination Details
// export const saveNominationDetails = async (req, res) => {
//   try {
//     const { employeeId, formData } = req.body;
//     const employee = await EmployeeRegister.findOne({ Emp_ID: employeeId });

//     if (!employee) {
//       return res.status(404).json({ success: false, message: 'Employee not found' });
//     }

//     employee.nominationDetails = formData;
//     await employee.save();

//     res.status(200).json({
//       success: true,
//       employeeId: employee.Emp_ID,
//       message: 'Nomination details updated successfully'
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ✅ Fetch Employee Data
// export const getEmployeeData = async (req, res) => {
//   try {
//     const { employeeId } = req.params;
//     const employee = await EmployeeRegister.findOne({ Emp_ID: employeeId });

//     if (!employee) {
//       return res.status(404).json({
//         success: false,
//         message: 'Employee not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: employee
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // import EmployeeRegister from '../models/employeeRegisterModel.js';

// // const generateEmployeeCode = async () => {
// //   try {
// //     const latestEmployee = await EmployeeRegister.findOne().sort({ Emp_ID: -1 });
// //     if (!latestEmployee || !latestEmployee.Emp_ID) {
// //       return 'DB-0001';
// //     }
// //     const currentNumber = parseInt(latestEmployee.Emp_ID.split('-')[1], 10);
// //     const newCode = `DB-${String(currentNumber + 1).padStart(4, '0')}`;
// //     return newCode;
// //   } catch (error) {
// //     throw new Error('Failed to generate employee code');
// //   }
// // };

// // const handleError = (error) => {
// //   if (error.errors) {
// //     return {
// //       success: false,
// //       details: Object.values(error.errors).map(err => err.message)
// //     };
// //   }
  
// //   return {
// //     success: false,
// //     details: [error.message || 'An error occurred while saving personal information']
// //   };
// // };
// // export const savePersonalInfo = async (req, res) => {
// //   try {
// //     const data = JSON.parse(req.body.formData);
// //     const employeeCode = await generateEmployeeCode();
    
// //     let employee = new EmployeeRegister({
// //       Emp_ID: employeeCode,
// //       personalInfo: data.personalInfo
// //     });

// //     if (req.file) {
// //       employee.personalInfo.employeeImage = req.file.path;
// //     }

// //     await employee.save();

// //     res.status(200).json({
// //       success: true,
// //       employeeId: employee.Emp_ID,
// //       message: 'Personal information saved successfully'
// //     });
// //   } catch (error) {
// //     const errorResponse = handleError(error);
// //     res.status(400).json(errorResponse);
// //   }
// // };




// // export const saveAddressInfo = async (req, res) => {
// //   try {
// //     const { employeeId, formData } = req.body;
// //     const employee = await EmployeeRegister.findOne({ Emp_ID: employeeId });
    
// //     if (!employee) {
// //       return res.status(404).json({ success: false, message: 'Employee not found' });
// //     }

// //     employee.addressInfo = formData;
// //     await employee.save();

// //     res.status(200).json({
// //       success: true,
// //       employeeId: employee.Emp_ID
// //     });
// //   } catch (error) {
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };

// // export const saveJoiningDetails = async (req, res) => {
// //   try {
// //     const { employeeId, formData } = req.body;
// //     const employee = await EmployeeRegister.findOne({ Emp_ID: employeeId });
    
// //     if (!employee) {
// //       return res.status(404).json({ success: false, message: 'Employee not found' });
// //     }

// //     employee.joiningDetails = formData;
// //     await employee.save();

// //     res.status(200).json({
// //       success: true,
// //       employeeId: employee.Emp_ID
// //     });
// //   } catch (error) {
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };

// // export const saveEducationDetails = async (req, res) => {
// //   try {
// //     const { employeeId, formData } = req.body;
// //     const employee = await EmployeeRegister.findOne({ Emp_ID: employeeId });
    
// //     if (!employee) {
// //       return res.status(404).json({ success: false, message: 'Employee not found' });
// //     }

// //     employee.educationDetails = formData;
// //     await employee.save();

// //     res.status(200).json({
// //       success: true,
// //       employeeId: employee.Emp_ID
// //     });
// //   } catch (error) {
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };

// // export const saveFamilyDetails = async (req, res) => {
// //   try {
// //     const { employeeId, formData } = req.body;
// //     const employee = await EmployeeRegister.findOne({ Emp_ID: employeeId });
    
// //     if (!employee) {
// //       return res.status(404).json({ success: false, message: 'Employee not found' });
// //     }

// //     employee.familyDetails = formData;
// //     await employee.save();

// //     res.status(200).json({
// //       success: true,
// //       employeeId: employee.Emp_ID
// //     });
// //   } catch (error) {
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };

// // export const saveServiceHistory = async (req, res) => {
// //   try {
// //     const { employeeId, formData } = req.body;
// //     const employee = await EmployeeRegister.findOne({ Emp_ID: employeeId });
    
// //     if (!employee) {
// //       return res.status(404).json({ success: false, message: 'Employee not found' });
// //     }

// //     employee.serviceHistory = formData;
// //     await employee.save();

// //     res.status(200).json({
// //       success: true,
// //       employeeId: employee.Emp_ID
// //     });
// //   } catch (error) {
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };

// // export const saveNominationDetails = async (req, res) => {
// //   try {
// //     const { employeeId, formData } = req.body;
// //     const employee = await EmployeeRegister.findOne({ Emp_ID: employeeId });
    
// //     if (!employee) {
// //       return res.status(404).json({ success: false, message: 'Employee not found' });
// //     }

// //     employee.nominationDetails = formData;
// //     await employee.save();

// //     res.status(200).json({
// //       success: true,
// //       employeeId: employee.Emp_ID
// //     });
// //   } catch (error) {
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };

// // export const getEmployeeData = async (req, res) => {
// //   try {
// //     const { employeeId } = req.params;
// //     const employee = await EmployeeRegister.findOne({ Emp_ID: employeeId });
    
// //     if (!employee) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Employee not found'
// //       });
// //     }

// //     res.status(200).json({
// //       success: true,
// //       data: employee
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       error: error.message
// //     });
// //   }
// // };
