// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import axios from "axios";

// import PersonalInformationForm from "../forms/PersonalInformationForm";
// import AddressDetailsForm from "../forms/AddressDetailsForm";
// import JoiningDetailsForm from "../forms/JoiningDetailsForm";
// import EducationDetailsForm from "../forms/EducationDetailsForm";
// import FamilyDetailsForm from "../forms/FamilyDetailsForm";
// import ServiceHistoryForm from "../forms/ServiceHistoryForm";
// import NominationDetailsForm from "../forms/NominationDetailsForm";

// const RegisterScreen = () => {
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [employeeId, setEmployeeId] = useState(null);
//   const [savedData, setSavedData] = useState({});

//   useEffect(() => {
//     const storedEmpId = localStorage.getItem("Emp_ID");
//     if (storedEmpId) {
//       setEmployeeId(storedEmpId);
//     }
//   }, []);

//   const nextStep = () => {
//     console.log('Moving to next step from:', currentStep);
//     setCurrentStep(prevStep => prevStep + 1);
//   };

//   const prevStep = () => {
//     setCurrentStep(prevStep => Math.max(1, prevStep - 1));
//   };

//   const handleEmployeeIdUpdate = (id) => {
//     setEmployeeId(id);
//     localStorage.setItem("Emp_ID", id);
//   };

//   const handleSaveData = (formType, data) => {
//     setSavedData(prevData => ({
//       ...prevData,
//       [formType]: data
//     }));
//     if (formType !== "addressDetails") {
//       nextStep();
//     }
//   };

//   const handleComplete = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/employees/complete-registration",
//         { employeeId },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       if (response.data.success) {
//         const employeeData = await axios.get(
//           `http://localhost:5000/api/employees/get-employee/${employeeId}`
//         );
//         toast.success(
//           `Registration completed successfully! Employee Code: ${employeeData.data.data.Emp_ID}`
//         );
//         navigate("/dashboard");
//       }
//     } catch (error) {
//       toast.error("Error completing registration");
//     }
//   };

//   const renderForm = () => {
//     const formProps = {
//       nextStep,
//       prevStep,
//       employeeId,
//       setEmployeeId: handleEmployeeIdUpdate,
//       onSave: handleSaveData
//     };

//     const forms = {
//       1: <PersonalInformationForm {...formProps} savedData={savedData.personalInformation} />,
//       2: <AddressDetailsForm {...formProps} savedData={savedData.addressDetails} />,
//       3: <JoiningDetailsForm {...formProps} savedData={savedData.joiningDetails} />,
//       4: <EducationDetailsForm {...formProps} savedData={savedData.educationDetails} />,
//       5: <FamilyDetailsForm {...formProps} savedData={savedData.familyDetails} />,
//       6: <ServiceHistoryForm {...formProps} savedData={savedData.serviceHistory} />,
//       7: <NominationDetailsForm {...formProps} savedData={savedData.nominationDetails} onComplete={handleComplete} />
//     };
  
//     return forms[currentStep] || null;
//   };

//   return (
//     <div className="register-screen">
//       <div className="progress-indicator">
//         {employeeId && <div>Employee Code: {employeeId}</div>}
//         <div>Step {currentStep} of 7</div>
//       </div>
//       {renderForm()}
//     </div>
//   );
// };

// export default RegisterScreen;




// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import axios from "axios";

// import PersonalInformationForm from "../forms/PersonalInformationForm";
// import AddressDetailsForm from "../forms/AddressDetailsForm";
// import JoiningDetailsForm from "../forms/JoiningDetailsForm";
// import EducationDetailsForm from "../forms/EducationDetailsForm";
// import FamilyDetailsForm from "../forms/FamilyDetailsForm";
// import ServiceHistoryForm from "../forms/ServiceHistoryForm";
// import NominationDetailsForm from "../forms/NominationDetailsForm";

// const RegisterScreen = () => {
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [employeeId, setEmployeeId] = useState(null);
//   const [savedData, setSavedData] = useState({});

//   const nextStep = () => {
//     setCurrentStep(prev => prev + 1);
//   };

//   const prevStep = () => {
//     setCurrentStep(prev => prev - 1);
//   };  

//   const handleEmployeeIdUpdate = (id) => {
//     setEmployeeId(id);
//     localStorage.setItem('Emp_ID', id);
//     console.log('Employee ID updated:', id);
//   };

//   useEffect(() => {
//     const storedEmpId = localStorage.getItem('Emp_ID');
//     if (storedEmpId) {
//       setEmployeeId(storedEmpId);
//       console.log('Retrieved stored Employee ID:', storedEmpId);
//     }
//   }, []);

//   const handleComplete = async (formData) => {
//     try {
//       // First save the nomination details
//       const nominationResponse = await axios.post(
//         'http://localhost:5000/api/employees/nomination-details',
//         {
//           employeeId,
//           nominationDetails: formData
//         }
//       );
  
//       // Then complete the registration
//       const completeResponse = await axios.post(
//         'http://localhost:5000/api/employees/complete-registration',
//         {
//           employeeId,
//           registrationComplete: true,
//           allFormData: {
//             ...savedData,
//             nominationDetails: formData
//           }
//         },
//         {
//           headers: { 'Content-Type': 'application/json' }
//         }
//       );
  
//       if (completeResponse.data.success) {
//         // Get final employee data
//         const employeeData = await axios.get(
//           `http://localhost:5000/api/employees/get-employee/${employeeId}`
//         );
  
//         toast.success(`Registration completed successfully! Employee Code: ${employeeData.data.data.Emp_ID}`);
        
//         // Clear local storage
//         localStorage.removeItem('Emp_ID');
        
//         // Redirect to dashboard
//         navigate('/');
//       }
//     } catch (error) {
//       toast.error('Registration completion failed: ' + error.message);
//       console.error('Registration error:', error);
//     }
//   };
  

//   const renderForm = () => {
//     const commonProps = {
//       nextStep,
//       prevStep,
//       employeeId,
//       setEmployeeId: handleEmployeeIdUpdate
//     };

//     switch (currentStep) {
//       case 1:
//         return (
//           <PersonalInformationForm
//             {...commonProps}
//             savedData={savedData.personalInfo}
//             onSave={(id) => {
//               handleEmployeeIdUpdate(id);
//               setSavedData(prev => ({
//                 ...prev,
//                 employeeId: id
//               }));
//             }}
//           />
//         );
//       case 2:
//         return (
//           <AddressDetailsForm
//             {...commonProps}
//             savedData={savedData.addressInfo}
//           />
//         );
//       case 3:
//         return (
//           <JoiningDetailsForm
//             {...commonProps}
//             savedData={savedData.joiningDetails}
//           />
//         );
//       case 4:
//         return (
//           <EducationDetailsForm
//             {...commonProps}
//             savedData={savedData.educationDetails}
//           />
//         );
//       case 5:
//         return (
//           <FamilyDetailsForm
//             {...commonProps}
//             savedData={savedData.familyDetails}
//           />
//         );
//       case 6:
//         return (
//           <ServiceHistoryForm
//             {...commonProps}
//             savedData={savedData.serviceHistory}
//           />
//         );
//         case 7:
//   return (
//     <NominationDetailsForm
//       {...commonProps}
//       savedData={savedData.nominationDetails}
//       onComplete={handleComplete}
//     />
//   );

//       }
//     };
      

//   return (
//     <div className="register-screen">
//       <div className="progress-indicator">
//       {employeeId && <div>Employee Code: {employeeId}</div>}
//       Step {currentStep} of 7
//       </div>
//       {renderForm()}
//     </div>
//   );
// };


// export default RegisterScreen;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import PersonalInformationForm from "../forms/PersonalInformationForm";
import AddressDetailsForm from "../forms/AddressDetailsForm";
import JoiningDetailsForm from "../forms/JoiningDetailsForm";
import EducationDetailsForm from "../forms/EducationDetailsForm";
import FamilyDetailsForm from "../forms/FamilyDetailsForm";
import ServiceHistoryForm from "../forms/ServiceHistoryForm";
import NominationDetailsForm from "../forms/NominationDetailsForm";

const RegisterScreen = () => {
  const navigate = useNavigate();
  // Initialize currentStep from localStorage or default to 1
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem('currentRegistrationStep');
    return savedStep ? parseInt(savedStep) : 1;
  });
  const [employeeId, setEmployeeId] = useState(null);
  const [savedData, setSavedData] = useState({});

  // Update localStorage whenever currentStep changes
  useEffect(() => {
    localStorage.setItem('currentRegistrationStep', currentStep.toString());
  }, [currentStep]);

  const nextStep = () => {
    setCurrentStep(prev => {
      const newStep = prev + 1;
      localStorage.setItem('currentRegistrationStep', newStep.toString());
      return newStep;
    });
  };

  const prevStep = () => {
    setCurrentStep(prev => {
      const newStep = Math.max(1, prev - 1);
      localStorage.setItem('currentRegistrationStep', newStep.toString());
      return newStep;
    });
  };  

  const handleEmployeeIdUpdate = (id) => {
    setEmployeeId(id);
    localStorage.setItem('Emp_ID', id);
    console.log('Employee ID updated:', id);
  };

  useEffect(() => {
    const storedEmpId = localStorage.getItem('Emp_ID');
    if (storedEmpId) {
      setEmployeeId(storedEmpId);
      console.log('Retrieved stored Employee ID:', storedEmpId);
    }
    
    // Load saved form data from localStorage if available
    const savedFormData = localStorage.getItem('savedFormData');
    if (savedFormData) {
      setSavedData(JSON.parse(savedFormData));
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(savedData).length > 0) {
      localStorage.setItem('savedFormData', JSON.stringify(savedData));
    }
  }, [savedData]);

  const handleComplete = async (formData) => {
    try {
      // First save the nomination details
      const nominationResponse = await axios.post(
        'http://localhost:5000/api/employees/nomination-details',
        {
          employeeId,
          nominationDetails: formData
        }
      );
  
      // Then complete the registration
      const completeResponse = await axios.post(
        'http://localhost:5000/api/employees/complete-registration',
        {
          employeeId,
          registrationComplete: true,
          allFormData: {
            ...savedData,
            nominationDetails: formData
          }
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
  
      if (completeResponse.data.success) {
        // Get final employee data
        const employeeData = await axios.get(
          `http://localhost:5000/api/employees/get-employee/${employeeId}`
        );
  
        toast.success(`Registration completed successfully! Employee Code: ${employeeData.data.data.Emp_ID}`);
        
        // Clear all registration data from localStorage
        localStorage.removeItem('Emp_ID');
        localStorage.removeItem('currentRegistrationStep');
        localStorage.removeItem('savedFormData');
        
        // Redirect to dashboard
        navigate('/');
      }
    } catch (error) {
      toast.error('Registration completion failed: ' + error.message);
      console.error('Registration error:', error);
    }
  };
  
  // Add a function to save form data at each step
  const saveFormData = (formType, data) => {
    setSavedData(prev => {
      const updatedData = {
        ...prev,
        [formType]: data
      };
      localStorage.setItem('savedFormData', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const renderForm = () => {
    const commonProps = {
      nextStep,
      prevStep,
      employeeId,
      setEmployeeId: handleEmployeeIdUpdate
    };

    switch (currentStep) {
      case 1:
        return (
          <PersonalInformationForm
            {...commonProps}
            savedData={savedData.personalInfo}
            onSave={(id) => {
              handleEmployeeIdUpdate(id);
              setSavedData(prev => {
                const updatedData = {
                  ...prev,
                  employeeId: id
                };
                localStorage.setItem('savedFormData', JSON.stringify(updatedData));
                return updatedData;
              });
            }}
          />
        );
      case 2:
        return (
          <AddressDetailsForm
            {...commonProps}
            savedData={savedData.addressInfo}
            onSave={(data) => saveFormData('addressInfo', data)}
          />
        );
      case 3:
        return (
          <JoiningDetailsForm
            {...commonProps}
            savedData={savedData.joiningDetails}
            onSave={(data) => saveFormData('joiningDetails', data)}
          />
        );
      case 4:
        return (
          <EducationDetailsForm
            {...commonProps}
            savedData={savedData.educationDetails}
            onSave={(data) => saveFormData('educationDetails', data)}
          />
        );
      case 5:
        return (
          <FamilyDetailsForm
            {...commonProps}
            savedData={savedData.familyDetails}
            onSave={(data) => saveFormData('familyDetails', data)}
          />
        );
      case 6:
        return (
          <ServiceHistoryForm
            {...commonProps}
            savedData={savedData.serviceHistory}
            onSave={(data) => saveFormData('serviceHistory', data)}
          />
        );
      case 7:
        return (
          <NominationDetailsForm
            {...commonProps}
            savedData={savedData.nominationDetails}
            onComplete={handleComplete}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };
      
  return (
    <div className="register-screen">
      <div className="progress-indicator">
        {employeeId && <div>Employee Code: {employeeId}</div>}
        Step {currentStep} of 7
      </div>
      {renderForm()}
    </div>
  );
};

export default RegisterScreen;

