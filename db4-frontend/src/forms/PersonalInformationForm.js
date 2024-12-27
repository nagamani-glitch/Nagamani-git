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

const PersonalInformationForm = ({ nextStep, handleFormDataChange }) => {
  // State for Personal Info
  const [formData, setFormData] = useState({
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
  const [addressData, setAddressData] = useState({
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
          <div className="form-section">
            <h2 className="form-subtitle">Employee Personal Information</h2>
            <div className="form-grid">
              <div className="joiningFormElement">
                <label>First Name<span className='star'>*</span>:</label>
                <input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handlePersonalChange}
                  className={Formerrors.firstName ? 'error-input' : ''}
                  placeholder={Formerrors.firstName || "Your first name"}
                />
              </div>
              <div className="joiningFormElement">
                <label>Last Name<span className='star'>*</span>:</label>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handlePersonalChange}
                  className={Formerrors.lastName ? 'error-input' : ''}
                  placeholder={Formerrors.lastName || "Your last name"}
                />
              </div>
              <div className="joiningFormElement">
                <label>Date of Birth<span className='star'>*</span>:</label>
                <input
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handlePersonalChange}
                  className={Formerrors.dob ? 'error-input' : ''}
                  placeholder={Formerrors.dob || ""}
                />
              </div>
              <div className="joiningFormElement">
                <label>Gender<span className='star'>*</span>:</label>
                <div className="joiningFormElement">
                  <input type="radio" name="gender" className='radio' value="Male" onChange={handlePersonalChange} /> Male
                  <input type="radio" name="gender" className='radio' value="Female" onChange={handlePersonalChange} /> Female
                  <input type="radio" name="gender" className='radio' value="Other" onChange={handlePersonalChange} /> Other
                </div>
              </div>
              <div className="joiningFormElement">
                <label>Marital Status<span className='star'>*</span>:</label>
                <input
                  name="maritalStatus"
                  type="text"
                  value={formData.maritalStatus}
                  onChange={handlePersonalChange}
                  className={Formerrors.maritalStatus ? 'error-input' : ''}
                  placeholder={Formerrors.maritalStatus || "Your marital status"}
                />
              </div>
              <div className="joiningFormElement">
                <label>Caste<span className='star'>*</span>:</label>
                <input
                  name="caste"
                  type="text"
                  value={formData.caste}
                  onChange={handlePersonalChange}
                  className={Formerrors.caste ? 'error-input' : ''}
                  placeholder={Formerrors.caste || "Your caste"}
                />
              </div>
              <div className="joiningFormElement">
                <label>Category<span className='star'>*</span>:</label>
                <input
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handlePersonalChange}
                  className={Formerrors.category ? 'error-input' : ''}
                  placeholder={Formerrors.category || "Your category"}
                />
              </div>
              <div className="joiningFormElement">
                <label>Religion<span className='star'>*</span>:</label>
                <input
                  name="religion"
                  type="text"
                  value={formData.religion}
                  onChange={handlePersonalChange}
                  className={Formerrors.religion ? 'error-input' : ''}
                  placeholder={Formerrors.religion || "Your religion"}
                />
              </div>
              <div className="joiningFormElement">
                <label>Blood Group<span className='star'>*</span>:</label>
                <input
                  name="bloodGroup"
                  type="text"
                  value={formData.bloodGroup}
                  onChange={handlePersonalChange}
                  className={Formerrors.bloodGroup ? 'error-input' : ''}
                  placeholder={Formerrors.bloodGroup || "Your blood group"}
                />
              </div>
              <div className="joiningFormElement">
                <label>Home State:</label>
                <input
                  name="homeState"
                  type="text"
                  value={formData.homeState}
                  onChange={handlePersonalChange}
                  placeholder="Your home state"
                />
              </div>
              <div className="joiningFormElement">
                <label>Home District:</label>
                <input
                  name="homeDistrict"
                  type="text"
                  value={formData.homeDistrict}
                  onChange={handlePersonalChange}
                  placeholder="Your home district"
                />
              </div>
              <div className="joiningFormElement">
                <label>Employee Image:</label>
                <input type="file" name="employeeImage" className='file-input' onChange={handleImageChange} />
                {employeeImage && (
                  <div>
                    <p>Image uploaded: {employeeImage.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-section">
            <h2 className="form-subtitle">Address Information</h2>
            <div className="form-grid">
              <div className="joiningFormElement">
                <label>Present Address<span className='star'>*</span>:</label>
                <input
                  name="presentAddress"
                  type="text"
                  value={addressData.presentAddress}
                  onChange={handleAddressChange}
                  className={Formerrors.presentAddress ? 'error-input' : ''}
                  placeholder={Formerrors.presentAddress || "Your present address"}
                />
              </div>
              <div className="joiningFormElement">
                <label>District<span className='star'>*</span>:</label>
                <input
                  name="district"
                  type="text"
                  value={addressData.district}
                  onChange={handleAddressChange}
                  className={Formerrors.district ? 'error-input' : ''}
                  placeholder={Formerrors.district || "Your district"}
                />
              </div>
              <div className="joiningFormElement">
                <label>State<span className='star'>*</span>:</label>
                <input
                  name="state"
                  type="text"
                  value={addressData.state}
                  onChange={handleAddressChange}
                  className={Formerrors.state ? 'error-input' : ''}
                  placeholder={Formerrors.state || "Your state"}
                />
              </div>
              <div className="joiningFormElement">
                <label>Pin Code<span className='star'>*</span>:</label>
                <input
                  name="pinCode"
                  type="text"
                  value={addressData.pinCode}
                  onChange={handleAddressChange}
                  className={Formerrors.pinCode ? 'error-input' : ''}
                  placeholder={Formerrors.pinCode || "Your pin code"}
                />
              </div>
              <div className="joiningFormElement">
                <label>Phone Number<span className='star'>*</span>:</label>
                <input
                  name="phoneNumber"
                  type="text"
                  value={addressData.phoneNumber}
                  onChange={handleAddressChange}
                  className={Formerrors.phoneNumber ? 'error-input' : ''}
                  placeholder={Formerrors.phoneNumber || "Your phone number"}
                />
              </div>
            </div>
          </div>
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
