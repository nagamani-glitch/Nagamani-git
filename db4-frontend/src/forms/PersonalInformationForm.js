// import React, { useState } from 'react';
// import Footer from '../components/Footer';

// const PersonalInformationForm = ({nextStep, handleFormDataChange}) => {
//   // State for Personal Info
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     dob: '',
//     gender: '',
//     maritalStatus: '',
//     caste: '',
//     category: '',
//     religion: '',
//     bloodGroup: '',
//     homeState: '',
//     homeDistrict: '',
//   });

//   // State for Address Info
//   const [addressData, setAddressData] = useState({
//     presentAddress: '',
//     block: '',
//     panchayat: '',
//     district: '',
//     state: '',
//     pinCode: '',
//     phoneNumber: '',
//     permanentAddress: '',
//     permanentBlock: '',
//     permanentPanchayat: '',
//     permanentDistrict: '',
//     permanentState: '',
//     permanentPinCode: ''
//   });

//   // State for Image Upload
//   const [employeeImage, setEmployeeImage] = useState(null);

//   // State to manage form steps
//   const [step, setStep] = useState(1); // 1 for personal info, 2 for address info

//   // Validation state
//   const [Formerrors, setErrors] = useState({});

//   // Handle input changes for both personal and address info
//   const handlePersonalChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleAddressChange = (e) => {
//     setAddressData({
//       ...addressData,
//       [e.target.name]: e.target.value
//     });
//   };

//   // Handle image upload
//   const handleImageChange = (e) => {
//     setEmployeeImage(e.target.files[0]);
//   };

//   // Validate fields
//   const validateForm = () => {
//     let newErrors = {};
//     if (step === 1) {
//       // Personal info validation
//       if (!formData.firstName) newErrors.firstName = '*required';
//       if (!formData.lastName) newErrors.lastName = '*required';
//       if (!formData.dob) newErrors.dob = '*required';
//       if (!formData.gender) newErrors.gender = '*required';
//       if (!formData.maritalStatus) newErrors.maritalStatus = '*required';
//       if (!formData.caste) newErrors.caste = '*required';
//       if (!formData.category) newErrors.category = '*required';
//       if (!formData.religion) newErrors.religion = '*required';
//       if (!formData.bloodGroup) newErrors.bloodGroup = '*required';
//     } else if (step === 2) {
//       // Address info validation
//       if (!addressData.presentAddress) newErrors.presentAddress = '*required';
//       if (!addressData.district) newErrors.district = '*required';
//       if (!addressData.state) newErrors.state = '*required';
//       if (!addressData.pinCode) newErrors.pinCode = '*required';
//       if (!addressData.phoneNumber) newErrors.phoneNumber = '*required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (validateForm()) {
//       // Submit the form data
//       console.log('Personal Info:', formData);
//       console.log('Address Info:', addressData);
//       if (employeeImage) {
//         console.log('Employee Image:', employeeImage);
//         handleFormDataChange("addressInfo", addressData)
//         nextStep()
//       }
//     }
//   };

//   // Handle moving to the next or previous step
//   const handleNext = () => {
//     if (validateForm()) {
//       setStep((prevStep) => prevStep + 1);
//       handleFormDataChange("personalInfo", formData)
//       console.log("Personal Information:", formData)
//     }
//   };

//   const handlePrevious = () => {
//     setStep((prevStep) => prevStep - 1);
//   };

  
//   return (
//     <div className="joining-container">
//     <form onSubmit={handleSubmit} >
//       {step === 1 && (
//         <div className="form-section">
//           <h2 className="form-subtitle">Employee Personal Information</h2>
//           <div className="form-grid">
//           <div className="joiningFormElement">
//             <label >First Name<span className='star'>*</span>:</label>
//             <input name="firstName" type="text" onChange={handlePersonalChange} />
//             {Formerrors.firstName && <p className='error'>{Formerrors.firstName}</p>}
//           </div>
//           <div className="joiningFormElement">
//             <label>Last Name<span className='star'>*</span>:</label>
//             <input name="lastName" type="text"  onChange={handlePersonalChange} />
//             {Formerrors.lastName && <p className='error'>{Formerrors.lastName}</p>}
//           </div>
//           <div className="joiningFormElement">
//             <label >Date of Birth<span className='star'>*</span>:</label>
//             <input name="dob" type="date"  onChange={handlePersonalChange} />
//             {Formerrors.dob && <p className='error' >{Formerrors.dob}</p>}
//           </div>
//           <div>
//             <label >Gender<span className='star'>*</span>:</label>
//             <div className="joiningFormElement">
//               <input type="radio" name="gender" value="Male" onChange={handlePersonalChange} /> Male
//               <input type="radio" name="gender" value="Female" onChange={handlePersonalChange} /> Female
//               <input type="radio" name="gender" value="Other" onChange={handlePersonalChange} /> Other
//             </div>
//             {Formerrors.gender && <p className='error'>{Formerrors.gender}</p>}
//           </div>
//           <div className="joiningFormElement">
//             <label >Marital Status<span className='star'>*</span>:</label>
//             <input name="maritalStatus" type="text"  onChange={handlePersonalChange} />
//             {Formerrors.maritalStatus && <p className='error'>{Formerrors.maritalStatus}</p>}
//           </div>
//           <div className="joiningFormElement">
//             <label >Caste<span className='star'>*</span>:</label>
//             <input name="caste" type="text"  onChange={handlePersonalChange} />
//             {Formerrors.caste && <p className='error'>{Formerrors.caste}</p>}
//           </div>
//           <div className="joiningFormElement">
//             <label >Category<span className='star'>*</span>:</label>
//             <input name="category" type="text"  onChange={handlePersonalChange} />
//             {Formerrors.category && <p className='error'>{Formerrors.category}</p>}
//           </div>
//           <div className="joiningFormElement">
//             <label >Religion <span className='star'>*</span>:</label>
//             <input name="religion" type="text" onChange={handlePersonalChange} />
//             {Formerrors.religion && <p className='error'>{Formerrors.religion}</p>}
//           </div>
//           <div className="joiningFormElement">
//             <label>Blood Group <span className='star'>*</span>:</label>
//             <input name="bloodGroup" type="text" onChange={handlePersonalChange} />
//             {Formerrors.bloodGroup && <p className='error'>{Formerrors.bloodGroup}</p>}
//           </div>
//           <div className="joiningFormElement">
//             <label>Home State<span className='star'>*</span>:</label>
//             <input name="homeState" type="text" onChange={handlePersonalChange} />
//           </div>
//           <div className="joiningFormElement">
//             <label>Home District<span className='star'>*</span>:</label>
//             <input name="homeDistrict" type="text" onChange={handlePersonalChange} />
//           </div>
//           <div className="joiningFormElement">
//             <label >Employee Image<span className='star'>*</span>:</label>
//             <input type="file" name="employeeImage"  onChange={handleImageChange} />
//             {employeeImage &&(
//               <div>
//                 <img src={URL.createObjectURL(employeeImage)} alt='' style={{ maxWidth: '150px', maxHeight: '150px' }} />
//                 </div>
//             )}
//           </div>
//           </div>
//         </div>
//       )}

//       {step === 2 && (
//         <div>
//           <h2 >Employee Address Information</h2>
//           <div className="form-grid">
//           <div className="joiningFormElement">
//             <label >Present Address<span className='star'>*</span>:</label>
//             <input name="presentAddress" type="text" onChange={handleAddressChange} />
//             {Formerrors.presentAddress && <p className='error'>{Formerrors.presentAddress}</p>}
//           </div>
//           <div className="joiningFormElement">
//             <label >Block:</label>
//             <input name="block" type="text" onChange={handleAddressChange} />
//           </div>
//           <div className="joiningFormElement">
//             <label >Panchayat<span className='star'>*</span>:</label>
//             <input name="panchayat" type="text" onChange={handleAddressChange} />
//           </div>
//           <div className="joiningFormElement">
//             <label >District<span className='star'>*</span>:</label>
//             <input name="district" type="text"  onChange={handleAddressChange} />
//             {Formerrors.district && <p className='error'>{Formerrors.district}</p>}
//           </div>
//           <div className="joiningFormElement">
//             <label>State<span className='star'>*</span>:</label>
//             <input name="state" type="text"  onChange={handleAddressChange} />
//             {Formerrors.state && <p className='error'>{Formerrors.state}</p>}
//           </div>
//           <div className="joiningFormElement">
//             <label >Pin Code<span className='star'>*</span>:</label>
//             <input name="pinCode" type="text" onChange={handleAddressChange} />
//             {Formerrors.pinCode && <p className='error'>{Formerrors.pinCode}</p>}
//           </div>
//           <div className="joiningFormElement">
//             <label >Phone Number<span className='star'>*</span>:</label>
//             <input name="phoneNumber" type="text" onChange={handleAddressChange} />
//             {Formerrors.phoneNumber && <p className='error'>{Formerrors.phoneNumber}</p>}
//           </div>
//           <div className="joiningFormElement">
//             <label >Permanent Address<span className='star'>*</span>:</label>
//             <input name="permanentAddress" type='text' onChange={handleAddressChange} />
//           </div>
//           <div className="joiningFormElement">
//             <label >Permanent Block<span className='star'>*</span>:</label>
//             <input name="permanentBlock" type="text" onChange={handleAddressChange} />
//           </div>
//           <div className="joiningFormElement">
//             <label >Permanent Panchayat<span className='star'>*</span>:</label>
//             <input name="permanentPanchayat" type="text" onChange={handleAddressChange} />
//           </div>
//           <div className="joiningFormElement">
//             <label >Permanent District<span className='star'>*</span>:</label>
//             <input name="permanentDistrict" type="text"  onChange={handleAddressChange} />
//           </div>
//           <div className="joiningFormElement">
//             <label >Permanent State<span className='star'>*</span>:</label>
//             <input name="permanentState" type="text" onChange={handleAddressChange} />
//           </div>
//           <div className="joiningFormElement">
//             <label >Permanent Pin Code<span className='star'>*</span>:</label>
//             <input name="permanentPinCode" type="text" onChange={handleAddressChange} />
//           </div>
//           </div>
//         </div>
//       )}

//            <div >
//              {step > 1 && <button type="button"  onClick={handlePrevious}>Previous</button>}
//              {step < 2 && <button type="button"  onClick={handleNext}>Next</button>}
//              {step === 2 && <button type="submit">Next</button>}
//           </div>
      
//     </form>
//     <Footer />
//     </div>
//   );
// };

// export default PersonalInformationForm


import React, { useState } from 'react';
import Footer from '../components/Footer';
import { TextField, RadioGroup, FormControlLabel, Radio, Paper, FormControl, Button, Typography, Grid, InputLabel, FormHelperText } from '@mui/material';
import { motion } from 'framer-motion';

const PersonalInformationForm = ({ nextStep, handleFormDataChange, savedPersonalInfo, savedAddressinfo }) => {
  // State for Personal Info
  const [formData, setFormData] = useState(savedPersonalInfo || {
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    caste: '',
    category: '',
    religion: '',
    bloodGroup: '',
    homeState: '',
    homeDistrict: '',
  });

  // State for Address Info
  const [addressData, setAddressData] = useState(savedAddressinfo ||{
    presentAddress: '',
    block: '',
    panchayat: '',
    district: '',
    state: '',
    pinCode: '',
    phoneNumber: '',
    permanentAddress: '',
    permanentBlock: '',
    permanentPanchayat: '',
    permanentDistrict: '',
    permanentState: '',
    permanentPinCode: ''
  });

  // State for Image Upload
  const [employeeImage, setEmployeeImage] = useState(null);

  // State to manage form steps
  const [step, setStep] = useState(1); // 1 for personal info, 2 for address info

  // Validation state
  const [Formerrors, setErrors] = useState({});

  // Handle input changes for both personal and address info
  const handlePersonalChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddressChange = (e) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value
    });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setEmployeeImage(e.target.files[0]);
  };

  // Validate fields
  const validateForm = () => {
    let newErrors = {};
    if (step === 1) {
      // Personal info validation
      if (!formData.firstName) newErrors.firstName = '*required';
      if (!formData.lastName) newErrors.lastName = '*required';
      if (!formData.dob) newErrors.dob = '*required';
      if (!formData.gender) newErrors.gender = '*required';
      if (!formData.maritalStatus) newErrors.maritalStatus = '*required';
      if (!formData.caste) newErrors.caste = '*required';
      if (!formData.category) newErrors.category = '*required';
      if (!formData.religion) newErrors.religion = '*required';
      if (!formData.bloodGroup) newErrors.bloodGroup = '*required';
    } else if (step === 2) {
      // Address info validation
      if (!addressData.presentAddress) newErrors.presentAddress = '*required';
      if (!addressData.district) newErrors.district = '*required';
      if (!addressData.state) newErrors.state = '*required';
      if (!addressData.pinCode) newErrors.pinCode = '*required';
      if (!addressData.phoneNumber) newErrors.phoneNumber = '*required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Submit the form data
      console.log('Personal Info:', formData);
      console.log('Address Info:', addressData);
      if (employeeImage) {
        console.log('Employee Image:', employeeImage);
        handleFormDataChange("addressInfo", addressData);
        nextStep();
      }
    }
  };

  // Handle moving to the next or previous step
  const handleNext = () => {
    if (validateForm()) {
      setStep((prevStep) => prevStep + 1);
      handleFormDataChange("personalInfo", formData);
      console.log("Personal Information:", formData);
    }
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="joining-container">
      <form onSubmit={handleSubmit} className='personalForm' >
        {step === 1 && (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Employee Personal Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                required
                name="firstName"
                value={formData.firstName}
                onChange={handlePersonalChange}
                error={!!Formerrors.firstName}
                helperText={Formerrors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                required
                name="lastName"
                value={formData.lastName}
                onChange={handlePersonalChange}
                error={!!Formerrors.lastName}
                helperText={Formerrors.lastName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                required
                InputLabelProps={{ shrink: true }}
                name="dob"
                value={formData.dob}
                onChange={handlePersonalChange}
                error={!!Formerrors.dob}
                helperText={Formerrors.dob}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <Typography variant="body1" sx={{ mb: 1 }}>Gender<span className="star">*</span>:</Typography>
                <RadioGroup row name="gender" value={formData.gender} onChange={handlePersonalChange}>
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                  <FormControlLabel value="Other" control={<Radio />} label="Other" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Marital Status"
                required
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handlePersonalChange}
                error={!!Formerrors.maritalStatus}
                helperText={Formerrors.maritalStatus}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Caste"
                required
                name="caste"
                value={formData.caste}
                onChange={handlePersonalChange}
                error={!!Formerrors.caste}
                helperText={Formerrors.caste}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                required
                name="category"
                value={formData.category}
                onChange={handlePersonalChange}
                error={!!Formerrors.category}
                helperText={Formerrors.category}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Religion"
                required
                name="religion"
                value={formData.religion}
                onChange={handlePersonalChange}
                error={!!Formerrors.religion}
                helperText={Formerrors.religion}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Blood Group"
                required
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handlePersonalChange}
                error={!!Formerrors.bloodGroup}
                helperText={Formerrors.bloodGroup}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Home State"
                name="homeState"
                value={formData.homeState}
                onChange={handlePersonalChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Home District"
                name="homeDistrict"
                value={formData.homeDistrict}
                onChange={handlePersonalChange}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Employee Image:</InputLabel>
              <Button variant="contained" component="label">
                Upload File
                <input type="file" hidden name="employeeImage" onChange={handleImageChange} />
              </Button>
              {employeeImage && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Image uploaded: {employeeImage.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    )}

{step === 2 && (
  <motion.div 
    initial={{ opacity: 0, y: 50 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.5 }}
    className="form-section"
  >
    <Typography variant="h6" gutterBottom className="form-subtitle">
      Address Information
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Present Address"
          name="presentAddress"
          variant="outlined"
          required
          value={addressData.presentAddress}
          onChange={handleAddressChange}
          error={Boolean(Formerrors.presentAddress)}
          helperText={Formerrors.presentAddress || "Your present address"}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="District"
          name="district"
          variant="outlined"
          required
          value={addressData.district}
          onChange={handleAddressChange}
          error={Boolean(Formerrors.district)}
          helperText={Formerrors.district || "Your district"}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="State"
          name="state"
          variant="outlined"
          required
          value={addressData.state}
          onChange={handleAddressChange}
          error={Boolean(Formerrors.state)}
          helperText={Formerrors.state || "Your state"}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Pin Code"
          name="pinCode"
          variant="outlined"
          required
          value={addressData.pinCode}
          onChange={handleAddressChange}
          error={Boolean(Formerrors.pinCode)}
          helperText={Formerrors.pinCode || "Your pin code"}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Phone Number"
          name="phoneNumber"
          variant="outlined"
          required
          value={addressData.phoneNumber}
          onChange={handleAddressChange}
          error={Boolean(Formerrors.phoneNumber)}
          helperText={Formerrors.phoneNumber || "Your phone number"}
        />
      </Grid>
    </Grid>
  </motion.div>
)}

        <div>
          {step > 1 && <button type="button" onClick={handlePrevious}>Previous</button>}
          {step < 2 && <button type="button" onClick={handleNext}>Next</button>}
          {step === 2 && <button type="submit">Next</button>}
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default PersonalInformationForm;
