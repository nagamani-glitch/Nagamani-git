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
  const [formData, setFormData] = useState({
    personalInfo: {},
    addressInfo: {},
    joiningDetails: {},
    educationDetails: {},
    trainingDetails:{},
    trainingInIndia:{},
    trainingInAbroad:{},
    familyDetails: {},
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
      const response = await axios.post('/api/employees/register', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(formData)
      console.log('Data submitted:', response.data);
      alert("Data Submitted Successfully")
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  // Conditionally render the form based on current step
  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInformationForm nextStep={nextStep} handleFormDataChange={handleFormDataChange} />;
      // case 1:
      //   return <AddressForm nextStep={nextStep} prevStep={prevStep} handleFormDataChange={handleFormDataChange} />;
      case 2:
        return <JoiningDetailsForm nextStep={nextStep} prevStep={prevStep} handleFormDataChange={handleFormDataChange} />;
      case 3:
        return <EducationDetailsForm nextStep={nextStep} prevStep={prevStep} handleFormDataChange={handleFormDataChange} />;
      case 4:
        return <FamilyDetailsForm nextStep={nextStep} prevStep={prevStep} handleFormDataChange={handleFormDataChange} />;
      case 5:
        return <ServiceHistoryForm nextStep={nextStep} prevStep={prevStep} handleFormDataChange={handleFormDataChange} />;
      case 6:
        return <NominationDetailsForm prevStep={prevStep} handleFormDataChange={handleFormDataChange} handleSubmit={handleSubmit} />;
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