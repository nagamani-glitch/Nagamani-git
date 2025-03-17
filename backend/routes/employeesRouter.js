
import express from 'express';
import Employee from '../models/employeeRegisterModel.js';
import uploads from '../config/multerConfig.js';

const router = express.Router();

router.post('/personal-info', uploads.single('employeeImage'), async (req, res) => {
  try {
    const { personalInfo } = JSON.parse(req.body.formData);
    
    // Validate required fields
    if (!personalInfo.firstName || !personalInfo.lastName) {
      return res.status(400).json({ 
        success: false, 
        error: 'First name and last name are required' 
      });
    }
    
    // Clean up empty fields to avoid unique constraint issues
    const cleanPersonalInfo = { ...personalInfo };
    if (!cleanPersonalInfo.aadharNumber) delete cleanPersonalInfo.aadharNumber;
    if (!cleanPersonalInfo.panNumber) delete cleanPersonalInfo.panNumber;
    if (!cleanPersonalInfo.email) delete cleanPersonalInfo.email;
    
    // Create a new employee instance
    const employee = new Employee({
      personalInfo: {
        ...cleanPersonalInfo,
        employeeImage: req.file ? `/uploads/${req.file.filename}` : null
      }
    });
    
    // Generate an employee ID if not already set
    if (!employee.Emp_ID) {
      employee.Emp_ID = await Employee.generateEmployeeNumber();
    }
    
    // Save the employee
    await employee.save();
    
    console.log('Saved employee with ID:', employee.Emp_ID);
    res.json({ success: true, employeeId: employee.Emp_ID });
  } catch (error) {
    console.error('Error saving employee:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/address-info', async (req, res) => {
  try {
    const { currentAddress, permanentAddress } = req.body;
    
    const updatedEmployee = await Employee.findOneAndUpdate(
      { Emp_ID: req.body.employeeId },
      { 
        $set: { 
          addressDetails: {
            presentAddress: {
              address: currentAddress.street || '',
              city: currentAddress.city || '',
              district: currentAddress.district || '',
              state: currentAddress.state || '',
              pinCode: currentAddress.pincode || '',
              country: currentAddress.country || ''
            },
            permanentAddress: {
              address: permanentAddress.street || '',
              city: permanentAddress.city || '',
              district: permanentAddress.district || '',
              state: permanentAddress.state || '',
              pinCode: permanentAddress.pincode || '',
              country: permanentAddress.country || ''
            }
          }
        }
      },
      { new: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.log('Error details:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/education-details', async (req, res) => {
  try {
    const { employeeId, educationDetails, trainingStatus, trainingDetails } = req.body;
    
    const updatedEmployee = await Employee.findOneAndUpdate(
      { Emp_ID: employeeId },
      { 
        $set: { 
          educationDetails,
          trainingStatus,
          trainingDetails
        }
      },
      { new: true }
    );

    res.json({ 
      success: true, 
      message: 'Education and training details saved successfully',
      data: updatedEmployee 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.post('/joining-details', async (req, res) => {
  try {
    const { employeeId, formData } = req.body;
    await Employee.findOneAndUpdate(
      { Emp_ID: employeeId },
      { joiningDetails: formData }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/family-details', async (req, res) => {
  try {
    const { employeeId, familyDetails } = req.body;
    
    const updatedEmployee = await Employee.findOneAndUpdate(
      { Emp_ID: employeeId },
      { 
        $set: { familyDetails }
      },
      { new: true }
    );

    res.json({ 
      success: true, 
      message: 'Family details saved successfully',
      data: updatedEmployee 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.post('/service-history', async (req, res) => {
  try {
    const { employeeId, hasServiceHistory, serviceHistory } = req.body;
    
    const updateData = hasServiceHistory ? 
      { serviceHistory } : 
      { serviceHistory: [] };
    
    const updatedEmployee = await Employee.findOneAndUpdate(
      { Emp_ID: employeeId },
      { $set: updateData },
      { new: true }
    );

    res.json({ 
      success: true, 
      message: 'Service history saved successfully',
      data: updatedEmployee 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Add this route to fetch complete profile data
router.get('/profile/:employeeId', async (req, res) => {
  try {
    const employee = await Employee.findOne({ Emp_ID: req.params.employeeId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({
      success: true,
      data: {
        personalInfo: employee.personalInfo,
        addressDetails: employee.addressDetails,
        joiningDetails: employee.joiningDetails,
        educationDetails: employee.educationDetails,
        familyDetails: employee.familyDetails,
        serviceHistory: employee.serviceHistory,
        nominationDetails: employee.nominationDetails,
        trainingDetails: employee.trainingDetails
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile data' });
  }
});


router.get('/get-employee/:employeeId', async (req, res) => {
  try {
    const employee = await Employee.findOne({ Emp_ID: req.params.employeeId });
    res.json({ 
      success: true, 
      data: employee 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/nomination-details', async (req, res) => {
  try {
    const { employeeId, nominationDetails } = req.body;
    
    const updatedEmployee = await Employee.findOneAndUpdate(
      { Emp_ID: employeeId },
      { $set: { nominationDetails } },
      { new: true }
    );

    res.json({ 
      success: true, 
      message: 'Nomination details saved successfully',
      data: updatedEmployee 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.post('/complete-registration', async (req, res) => {
  try {
    const { employeeId, registrationComplete, allFormData } = req.body;
    console.log('Received data:', { employeeId, allFormData });
    
    const updatedEmployee = await Employee.findOneAndUpdate(
      { Emp_ID: employeeId },
      { 
        $set: {
          ...allFormData,
          registrationComplete: true
        }
      },
      { new: true, upsert: true } // Added upsert option to create if not exists
    );

    console.log('Saved employee:', updatedEmployee);
    res.json({ success: true, data: updatedEmployee });
  } catch (error) {
    console.log('Error saving:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/registered', async (req, res) => {
  try {
    const employees = await Employee.find({})
      .select('personalInfo addressDetails joiningDetails Emp_ID')
      .sort('-createdAt');
    
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error });
  }
});

// Bank info routes
router.get('/bank-info/:employeeId', async (req, res) => {
  try {
    const employee = await Employee.findOne({ Emp_ID: req.params.employeeId });
    res.json(employee.bankInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bank info' });
  }
});

router.put('/bank-info/:employeeId', async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { Emp_ID: req.params.employeeId },
      { bankInfo: req.body },
      { new: true }
    );
    res.json(employee.bankInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error updating bank info' });
  }
});

export default router;

