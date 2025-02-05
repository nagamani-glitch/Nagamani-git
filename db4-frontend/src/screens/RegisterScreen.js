import React, { useState } from "react";
import PersonalInformationForm from "../forms/PersonalInformationForm";
import AddressDetailsForm from "../forms/AddressDetailsForm";
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
    console.log('Image uploaded:', file);
  };

  
    // Submit final data
    const handleSubmit = async () => {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('img', profileImage);
    
        // Robust date formatting function
        const formatDate = (dateString) => {
          if (!dateString) return null;
          try {
            const date = new Date(dateString);
            return date.toISOString();
          } catch {
            return null;
          }
        };
    
        // Format training dates safely
        const formatTrainingArray = (trainings = []) => {
          return trainings.map(training => ({
            type: String(training.type || ''),
            topic: String(training.topic || ''),
            institute: String(training.institute || ''),
            sponsor: String(training.sponsor || ''),
            from: training.from ? new Date(training.from).toISOString() : null,
            to: training.to ? new Date(training.to).toISOString() : null
          }));
        };
    
        const mappedData = {
          Emp_ID: generateEmployeeId(),
          name: `${formData.personalInfo?.firstName || ''} ${formData.personalInfo?.lastName || ''}`.trim(),
          email: formData.personalInfo?.email || '',
          phone: formData.personalInfo?.mobileNumber || '',
          department: formData.joiningDetails?.officeName || '',
          role: formData.joiningDetails?.initialDesignation || '',
          location: formData.addressInfo?.presentAddress || '',
          dob: formatDate(formData.personalInfo?.dob),
          personalInfo: formData.personalInfo,
          addressInfo: formData.addressInfo,
          joiningDetails: formData.joiningDetails,
          educationDetails: formData.educationDetails || {},
          trainingDetails: {
            trainingInIndia: formatTrainingArray(formData.trainingDetails?.trainingInIndia),
            trainingAbroad: formatTrainingArray(formData.trainingDetails?.trainingAbroad)
          },        
          familyDetails: formData.familyDetails || [],
          serviceHistory: formData.serviceHistory || [],
          nominationDetails: formData.nominationDetails || {}
        };
    
        formDataToSend.append('data', JSON.stringify(mappedData));
        
        const response = await axios.post(
          `http://localhost:5000/api/employees/register`,
          formDataToSend,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
          }
        );
    
        toast.success('Registration successful!');
        navigate('/');
    
      } catch (error) {
        console.log('Form Data:', formData);
        console.log('Profile Image:', profileImage);
        console.log('Error Response:', error.response?.data);
        toast.error(`Registration failed: ${error.response?.data?.error || error.message}`);
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
            handleImageUpload={handleImageUpload}
            savedPersonalInfo={formData.personalInfo}            
    />
        );
        case 2:
          return (
            <AddressDetailsForm
              prevStep={prevStep}
              nextStep={nextStep}
              handleFormDataChange={handleFormDataChange}                            
              savedAddressinfo={formData.addressInfo}
      />
          );
      case 3:
        return (
          <JoiningDetailsForm
            nextStep={nextStep}
            prevStep={prevStep}
            handleFormDataChange={handleFormDataChange}
            savedJoiningDetails={formData.joiningDetails} // Send saved data
          />
        );
      case 4:
        return (
          <EducationDetailsForm
            nextStep={nextStep}
            prevStep={prevStep}
            handleFormDataChange={handleFormDataChange}
            savedEducationDetails={formData.educationDetails} // Send saved data
          />
        );
      case 5:
        return (
          <FamilyDetailsForm
            nextStep={nextStep}
            prevStep={prevStep}
            handleFormDataChange={handleFormDataChange}
            savedFamilyDetails={formData.familyDetails} // Send saved data
          />
        );
      case 6:
        return (
          <ServiceHistoryForm
            nextStep={nextStep}
            prevStep={prevStep}
            handleFormDataChange={handleFormDataChange}
            savedServiceHistory={formData.serviceHistory} // Send saved data
          />
        );
      case 7:
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
