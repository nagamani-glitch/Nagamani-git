// // // import React, { useState } from 'react';
// // // import axios from 'axios';
// // // import './JoiningDetails.css'; // Custom styles for this page

// // import Footer from "../components/Footer";

// // const JoiningDetailsForm = ({joiningDetails, setJoiningDetails, goToNextForm}) => {
// // //   // State for form data
// // //   const [joiningDetails, setJoiningDetails] = useState({
// // //     employeeId: '',
// // //     dateOfJoining: '',
// // //     department: '',
// // //     designation: '',
// // //   });

// //   // Handle input change
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setJoiningDetails((prevDetails) => ({
// //       ...prevDetails,
// //       [name]: value,
// //     }));
// //   };

// //   // Handle form submit
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       // Sending data to backend
// //       // await axios.post('https://your-backend-api-url/joining-details', joiningDetails);
      
// //       goToNextForm()
// //     } catch (error) {
// //       console.error('Error submitting joining details:', error);
// //     }
// //   };

// //   return (
// //     <div className="joining-container">
// //       <form onSubmit={handleSubmit}>
// //         {/* Employment Details */}
// //         <div className="form-section">
// //           <h4 className="form-subtitle">Joining Details</h4>
// //           <div className="form-grid">
// //             <div className="joiningFormElement">
// //             <label>
// //               Date of Appointment:
// //             </label>
// //               <input
// //                 type="date"
// //                 name="dateOfAppointment"
// //                 value={joiningDetails.dateOfAppointment}
// //                 onChange={handleChange}
// //                 required
// //               />
// //               </div>
// //             <div className="joiningFormElement">
// //             <label>
// //               Office name at the time of initial joining in Dept:
// //               </label>
// //               <input
// //                 type="text"
// //                 name="officeName"
// //                 value={joiningDetails.officeName}
// //                 onChange={handleChange}
// //                 required
// //               />
// //             </div>
// //             <div className="joiningFormElement">
// //             <label>
// //               Date of Joining in the Dept:
// //               </label>
// //               <input
// //                 type="date"
// //                 name="dateOfJoining"
// //                 value={joiningDetails.dateOfJoining}
// //                 onChange={handleChange}
// //                 required
// //               />
// //             </div>
// //             <div className="joiningFormElement">
// //             <label>
// //               Initial Designation:
// //               </label>
// //               <input
// //                 type="text"
// //                 name="initialDesignation"
// //                 value={joiningDetails.initialDesignation}
// //                 onChange={handleChange}
// //                 required
// //               />
// //               </div>
// //             <div className="joiningFormElement">
// //             <label>
// //               Mode of Recruitment:
// //               </label>
// //               <input
// //                 type="text"
// //                 name="modeOfRecruitment"
// //                 value={joiningDetails.modeOfRecruitment}
// //                 onChange={handleChange}
// //                 required
// //               />
// //               </div>
// //             <div className="joiningFormElement">
// //             <label>
// //               Employee Type:
// //             </label>  
// //               <input
// //                 type="text"
// //                 name="employeeType"
// //                 value={joiningDetails.employeeType}
// //                 onChange={handleChange}
// //                 required
// //               />
// //             </div>
// //           </div>
// //         </div>
// //         <div>
// //         <hr style={{borderColor:"black"}}/>
// //         <button type="submit" className="submit-btn" >Next &gt; </button>
// //         </div>
// //       </form>
// //       <Footer />
// //     </div>
// //   );
// // };

// // export default JoiningDetailsForm;

// import React, { useState } from 'react';
// import Footer from "../components/Footer";

// const JoiningDetailsForm = ({ joiningDetails, setJoiningDetails, goToNextForm }) => {
//   // State to track errors for each field
//   const [errors, setErrors] = useState({});

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setJoiningDetails((prevDetails) => ({
//       ...prevDetails,
//       [name]: value,
//     }));

//     // Clear error when the user starts typing in a field
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [name]: value ? '' : 'Required',
//     }));
//   };

//   // Validate fields
//   const validateFields = () => {
//     const newErrors = {};
//     if (!joiningDetails.dateOfAppointment) newErrors.dateOfAppointment = 'Required';
//     if (!joiningDetails.officeName) newErrors.officeName = 'Required';
//     if (!joiningDetails.dateOfJoining) newErrors.dateOfJoining = 'Required';
//     if (!joiningDetails.initialDesignation) newErrors.initialDesignation = 'Required';
//     if (!joiningDetails.modeOfRecruitment) newErrors.modeOfRecruitment = 'Required';
//     if (!joiningDetails.employeeType) newErrors.employeeType = 'Required';
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Validate all fields before submission
//     if (validateFields()) {
//       goToNextForm(); // Proceed to the next form if validation is successful
//     }
//   };

//   return (
//     <div className="joining-container">
//       <form onSubmit={handleSubmit}>
//         {/* Employment Details */}
//         <div className="form-section">
//           <h4 className="form-subtitle">Joining Details</h4>
//           <div className="form-grid">
//             <div className="joiningFormElement">
//               <label>Date of Appointment:</label>
//               <input
//                 type="date"
//                 name="dateOfAppointment"
//                 value={joiningDetails.dateOfAppointment}
//                 onChange={handleChange}
                
//               />
//               {errors.dateOfAppointment && <p className="error">{errors.dateOfAppointment}</p>}
//             </div>
//             <div className="joiningFormElement">
//               <label>Office Name at the time of Initial Joining in Dept:</label>
//               <input
//                 type="text"
//                 name="officeName"
//                 value={joiningDetails.officeName}
//                 onChange={handleChange}
                
//               />
//               {errors.officeName && <span className="error">{errors.officeName}</span>}
//             </div>
//             <div className="joiningFormElement">
//               <label>Date of Joining in the Dept:</label>
//               <input
//                 type="date"
//                 name="dateOfJoining"
//                 value={joiningDetails.dateOfJoining}
//                 onChange={handleChange}
                
//               />
//               {errors.dateOfJoining && <span className="error">{errors.dateOfJoining}</span>}
//             </div>
//             <div className="joiningFormElement">
//               <label>Initial Designation:</label>
//               <input
//                 type="text"
//                 name="initialDesignation"
//                 value={joiningDetails.initialDesignation}
//                 onChange={handleChange}
                
//               />
//               {errors.initialDesignation && <span className="error">{errors.initialDesignation}</span>}
//             </div>
//             <div className="joiningFormElement">
//               <label>Mode of Recruitment:</label>
//               <input
//                 type="text"
//                 name="modeOfRecruitment"
//                 value={joiningDetails.modeOfRecruitment}
//                 onChange={handleChange}
                
//               />
//               {errors.modeOfRecruitment && <span className="error">{errors.modeOfRecruitment}</span>}
//             </div>
//             <div className="joiningFormElement">
//               <label>Employee Type:</label>
              
//               <input
//                 type="text"
//                 name="employeeType"
//                 value={joiningDetails.employeeType}
//                 onChange={handleChange}
                
//               />
//               {errors.employeeType && <span className="error">{errors.employeeType}</span>}
//             </div>
//           </div>
//         </div>
//         <div>
//           <hr style={{ borderColor: "black" }} />
//           <button type="submit" className="submit-btn">Next &gt; </button>
//         </div>
//       </form>
//       <Footer />
//     </div>
//   );
// };

// export default JoiningDetailsForm;

import React, { useState } from 'react';
import Footer from "../components/Footer";

const JoiningDetailsForm = ({ nextStep, prevStep, handleFormDataChange }) => {
  // State to track errors for each field
  const [errors, setErrors] = useState({});
  const [joiningDetails, setJoiningDetails] = useState({
    dateOfAppointment:"",
    officeName:"",
    dateOfJoining:"",
    initialDesignation:"",
    modeOfRecruitment:"",
    employeeType:""
  })

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJoiningDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    // Clear error when the user starts typing in a field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '', // Clear the error for the field
    }));
  };

  // Validate fields
  const validateFields = () => {
    const newErrors = {};
    if (!joiningDetails.dateOfAppointment) newErrors.dateOfAppointment = '*Required';
    if (!joiningDetails.officeName) newErrors.officeName = '*Required';
    if (!joiningDetails.dateOfJoining) newErrors.dateOfJoining = '*Required';
    if (!joiningDetails.initialDesignation) newErrors.initialDesignation = '*Required';
    if (!joiningDetails.modeOfRecruitment) newErrors.modeOfRecruitment = '*Required';
    if (!joiningDetails.employeeType) newErrors.employeeType = '*Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all fields before submission
    if (validateFields()) {
      handleFormDataChange("joiningDetails", joiningDetails)
      console.log("Joining details:", joiningDetails)
      nextStep(); // Proceed to the next form if validation is successful
    }
  };

  return (
    <div className="joining-container">
      <form onSubmit={handleSubmit}>
        {/* Employment Details */}
        <div className="form-section">
          <h4 className="form-subtitle">Joining Details</h4>
          <div className="form-grid">
            <div className="joiningFormElement">
              <label>Date of Appointment:</label>
              <input
                type="date"
                name="dateOfAppointment"
                value={joiningDetails.dateOfAppointment}
                onChange={handleChange}
                placeholder={errors.dateOfAppointment || ""}
                className={errors.dateOfAppointment ? 'error-input' : ''}
                
              />
            </div>
            <div className="joiningFormElement">
              <label>Office Name at the time of Initial Joining in Dept:</label>
              <input
                type="text"
                name="officeName"
                value={joiningDetails.officeName}
                onChange={handleChange}
                placeholder={errors.officeName || ""}
                className={errors.officeName ? 'error-input' : ''}
                
              />
            </div>
            <div className="joiningFormElement">
              <label>Date of Joining in the Dept:</label>
              <input
                type="date"
                name="dateOfJoining"
                value={joiningDetails.dateOfJoining}
                onChange={handleChange}
                placeholder={errors.dateOfJoining || ""}
                className={errors.dateOfJoining ? 'error-input' : ''}
                
              />
            </div>
            <div className="joiningFormElement">
              <label>Initial Designation:</label>
              <input
                type="text"
                name="initialDesignation"
                value={joiningDetails.initialDesignation}
                onChange={handleChange}
                placeholder={errors.initialDesignation || ""}
                className={errors.initialDesignation ? 'error-input' : ''}
              />
            </div>
            <div className="joiningFormElement">
              <label>Mode of Recruitment:</label>
              <input
                type="text"
                name="modeOfRecruitment"
                value={joiningDetails.modeOfRecruitment}
                onChange={handleChange}
                placeholder={errors.modeOfRecruitment || ""}
                className={errors.modeOfRecruitment ? 'error-input' : ''}
              />
            </div>
            <div className="joiningFormElement">
              <label>Employee Type:</label>
              <input
                type="text"
                name="employeeType"
                value={joiningDetails.employeeType}
                onChange={handleChange}
                placeholder={errors.employeeType || ""}
                className={errors.employeeType ? 'error-input' : ''}
              />
            </div>
          </div>
        </div>
        <div>
          <hr style={{ borderColor: "black" }} />
          <button type="button" onClick={prevStep} className="submit-btn">Prev &lt; </button>
          <button type="submit" className="submit-btn">Next &gt; </button>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default JoiningDetailsForm;

