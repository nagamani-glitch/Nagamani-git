import React, { useState } from "react";
import PersonalInformationForm from "../forms/PersonalInformationForm";
import JoiningDetailsForm from "../forms/JoiningDetailsForm";
import EducationDetailsForm from "../forms/EducationDetailsForm";
import FamilyDetailsForm from "../forms/FamilyDetailsForm";
import ServiceHistoryForm from "../forms/ServiceHistoryForm";
import NominationDetailsForm from "../forms/NominationDetailsForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // Tracks the current form page

  // Consolidated form data for all steps
  const [formData, setFormData] = useState({
    personalInfo: {},
    addressInfo: {},
    joiningDetails: {},
    educationDetails: {},
    trainingDetails: {},
    trainingInIndia: {},
    trainingInAbroad: {},
    familyDetails: [],
    serviceHistory: {},
    nominationDetails: {}
  });

  // Move to next form page
  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  // Move to previous form page
  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  // Update formData with current form data
  const handleFormDataChange = (section, data) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: data, // Update the specific section data
    }));
  };

  const generateEmployeeId = () => {
    // Generate a unique employee ID, for example:
    return 'EMP' + Date.now().toString().slice(-6);
  };

  const [profileImage, setProfileImage] = useState('null'); 

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
  };

  
    // Submit final data
    const handleSubmit = async () => {
      try {
        const formDataToSend = new FormData();
        
        if (profileImage) {
          formDataToSend.append('img', profileImage);
        }
    
        const mappedData = {
          Emp_ID: `EMP${Date.now().toString().slice(-6)}`,
          name: formData.personalInfo?.firstName ? `${formData.personalInfo.firstName} ${formData.personalInfo.lastName || ''}` : '',
          email: formData.addressInfo?.email || '',
          phone: formData.addressInfo?.phoneNumber || '',
          department: formData.joiningDetails?.officeName || '',
          role: formData.joiningDetails?.initialDesignation || '',
          location: formData.addressInfo?.presentAddress || '',
          dob: formData.personalInfo?.dob ? new Date(formData.personalInfo.dob) : null,
          ...formData
        };
    
        formDataToSend.append('data', JSON.stringify(mappedData));
    
        const response = await axios.post('http://localhost:5000/api/employees/register', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        });
    
        toast.success('Onboarding completed successfully');
        setTimeout(() => {
          navigate('/');
        }, 2000);
  
      } catch (error) {
        toast.error('Registration failed: ' + error.message);
      }
    };
    
  // Conditionally render the form based on current step
  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInformationForm
            nextStep={nextStep}
            handleFormDataChange={handleFormDataChange}
            savedPersonalInfo={formData.personalInfo} // Send saved data
            savedAddressinfo={formData.addressInfo}
          />
        );
      case 2:
        return (
          <JoiningDetailsForm
            nextStep={nextStep}
            prevStep={prevStep}
            handleFormDataChange={handleFormDataChange}
            savedJoiningDetails={formData.joiningDetails} // Send saved data
          />
        );
      case 3:
        return (
          <EducationDetailsForm
            nextStep={nextStep}
            prevStep={prevStep}
            handleFormDataChange={handleFormDataChange}
            savedEducationDetails={formData.educationDetails} // Send saved data
          />
        );
      case 4:
        return (
          <FamilyDetailsForm
            nextStep={nextStep}
            prevStep={prevStep}
            handleFormDataChange={handleFormDataChange}
            savedFamilyDetails={formData.familyDetails} // Send saved data
          />
        );
      case 5:
        return (
          <ServiceHistoryForm
            nextStep={nextStep}
            prevStep={prevStep}
            handleFormDataChange={handleFormDataChange}
            savedServiceHistory={formData.serviceHistory} // Send saved data
          />
        );
      case 6:
        return (
          <NominationDetailsForm
            prevStep={prevStep}
            handleFormDataChange={handleFormDataChange}
            handleSubmit={handleSubmit}
            savedNominationDetails={formData.nominationDetails} // Send saved data
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Registration Form</h1>
      {renderForm()}
    </div>
  );
};

export default RegisterScreen;
