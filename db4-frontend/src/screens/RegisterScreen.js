import React, { useState } from "react";
import PersonalInformationForm from "../forms/PersonalInformationForm";
import JoiningDetailsForm from "../forms/JoiningDetailsForm";
import EducationDetailsForm from "../forms/EducationDetailsForm";
import FamilyDetailsForm from "../forms/FamilyDetailsForm";
import ServiceHistoryForm from "../forms/ServiceHistoryForm";
import NominationDetailsForm from "../forms/NominationDetailsForm";
import axios from "axios";

const RegisterScreen = () => {
  const [currentStep, setCurrentStep] = useState(1); // Tracks the current form page

  // Consolidated form data for all steps
  const [formData, setFormData] = useState({
    personalInfo: {},
    addressInfo: {},
    joiningDetails: {},
    educationDetails: {},
    trainingDetails:{},
    trainingInIndia:{},
    trainingInAbroad:{},
    familyDetails: [],
    serviceHistory: {},
    nominationDetails: {},
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

  // Submit final data
  const handleSubmit = async () => {
    try {
      const formDataToSubmit = {
        personalInfo: formData.personalInfo,
        addressInfo: formData.addressInfo,
        joiningDetails: formData.joiningDetails,
        educationDetails: formData.educationDetails,
        trainingDetails: formData.trainingDetails,
        familyDetails: formData.familyDetails,
        serviceHistory: formData.serviceHistory,
        nominationDetails: formData.nominationDetails
      };
  
      const response = await axios.post('http://localhost:5000/api/employees/register', formDataToSubmit, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
  
      console.log('Registration successful:', response.data);
      
    } catch (error) {
      if (error.response) {
        console.error('Server error:', error.response.data);
      } else if (error.request) {
        console.error('Network error:', error.message);
      } else {
        console.error('Error:', error.message);
      }
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
