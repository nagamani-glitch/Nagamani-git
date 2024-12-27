import React, { useState } from 'react';
// import axios from 'axios';
import Footer from '../components/Footer';

const EducationTrainingDetailsForm = ({ nextStep, prevStep, handleFormDataChange }) => {
  // State to manage education details
  const [educationDetails, setEducationDetails] = useState({
    basic: [
      { education: '', board: '', marks: '', year: '', stream: '', grade: '' },
    ],
    technical: [
      { education: '', board: '', marks: '', year: '', stream: '', grade: '' },
    ],
    professional: [
      { education: '', board: '', marks: '', year: '', stream: '', grade: '' },
    ],
  });

  // State to manage training details
  const [trainingInIndia, setTrainingInIndia] = useState([
    { type: '', topic: '', institute: '', sponsor: '', from: '', to: '' },
  ]);

  const [trainingAbroad, setTrainingAbroad] = useState([
    { type: '', topic: '', institute: '', sponsor: '', from: '', to: '' },
  ]);

  // Validation state
  const [errors, setErrors] = useState({});

  // Validate education fields
  const validateEducation = () => {
    const newErrors = {};
    ['basic', 'technical', 'professional'].forEach((category) => {
      educationDetails[category].forEach((edu, index) => {
        if (!edu.education) newErrors[`${category}_education_${index}`] = 'Education is required';
        if (!edu.board) newErrors[`${category}_board_${index}`] = 'Board is required';
        if (!edu.marks || isNaN(edu.marks)) newErrors[`${category}_marks_${index}`] = 'Valid marks are required';
        if (!edu.year || isNaN(edu.year)) newErrors[`${category}_year_${index}`] = 'Valid year is required';
        if (!edu.stream) newErrors[`${category}_stream_${index}`] = 'Stream is required';
        if (!edu.grade) newErrors[`${category}_grade_${index}`] = 'Grade is required';
      });
    });
    return newErrors;
  };

  // Validate training fields
  const validateTraining = () => {
    const newErrors = {};
    trainingInIndia.forEach((train, index) => {
      if (!train.type) newErrors[`training_in_india_type_${index}`] = 'Type is required';
      if (!train.topic) newErrors[`training_in_india_topic_${index}`] = 'Topic is required';
      if (!train.institute) newErrors[`training_in_india_institute_${index}`] = 'Institute is required';
      if (!train.from) newErrors[`training_in_india_from_${index}`] = 'From date is required';
      if (!train.sponsor) newErrors[`training_in_india_sponsor_${index}`] = 'Sponsor is required';
      if (!train.to) newErrors[`training_in_india_to_${index}`] = 'To date is required';
    });
    trainingAbroad.forEach((train, index) => {
      if (!train.type) newErrors[`training_abroad_type_${index}`] = 'Type is required';
      if (!train.topic) newErrors[`training_abroad_topic_${index}`] = 'Topic is required';
      if (!train.institute) newErrors[`training_abroad_institute_${index}`] = 'Institute is required';
      if (!train.sponsor) newErrors[`training_abroad_sponsor_${index}`] = 'Sponsor is required';
      if (!train.from) newErrors[`training_abroad_from_${index}`] = 'From date is required';
      if (!train.to) newErrors[`training_abroad_to_${index}`] = 'To date is required';
    });
    return newErrors;
  };

  // Handle input change for education
  const handleEducationChange = (category, index, e) => {
    const { name, value } = e.target;
    const newEducationDetails = { ...educationDetails };
    newEducationDetails[category][index][name] = value;
    setEducationDetails(newEducationDetails);
  };

  // Handle input change for training in India
  const handleTrainingInIndiaChange = (index, e) => {
    const { name, value } = e.target;
    const newTrainingDetails = [...trainingInIndia];
    newTrainingDetails[index][name] = value;
    setTrainingInIndia(newTrainingDetails);
  };

  // Handle input change for training abroad
  const handleTrainingAbroadChange = (index, e) => {
    const { name, value } = e.target;
    const newTrainingDetails = [...trainingAbroad];
    newTrainingDetails[index][name] = value;
    setTrainingAbroad(newTrainingDetails);
  };

  // Add a new education row
  const addEducationRow = (category) => {
    const newRow = { education: '', board: '', marks: '', year: '', stream: '', grade: '' };
    setEducationDetails((prevDetails) => ({
      ...prevDetails,
      [category]: [...prevDetails[category], newRow],
    }));
  };

  // Remove an education row
  const removeEducationRow = (category, index) => {
    const newRows = educationDetails[category].filter((_, idx) => idx !== index);
    setEducationDetails((prevDetails) => ({
      ...prevDetails,
      [category]: newRows,
    }));
  };

  // Add a new training row for Training in India
  const addTrainingInIndiaRow = () => {
    const newRow = { type: '', topic: '', institute: '', sponsor: '', from: '', to: '' };
    setTrainingInIndia((prevRows) => [...prevRows, newRow]);
  };

  // Remove a training row for Training in India
  const removeTrainingInIndiaRow = (index) => {
    const newRows = trainingInIndia.filter((_, idx) => idx !== index);
    setTrainingInIndia(newRows);
  };

  // Add a new training row for Training Abroad
  const addTrainingAbroadRow = () => {
    const newRow = { type: '', topic: '', institute: '', sponsor: '', from: '', to: '' };
    setTrainingAbroad((prevRows) => [...prevRows, newRow]);
  };

  // Remove a training row for Training Abroad
  const removeTrainingAbroadRow = (index) => {
    const newRows = trainingAbroad.filter((_, idx) => idx !== index);
    setTrainingAbroad(newRows);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const educationErrors = validateEducation();
    const trainingErrors = validateTraining();
    const allErrors = { ...educationErrors, ...trainingErrors };
    const trainingDetails = {trainingInIndia, trainingAbroad}

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors); // Set validation errors
      alert('Please fix the errors before submitting');
      return;
    }
    console.log("Education Details:", educationDetails)
    handleFormDataChange("educationDetails", educationDetails)
    console.log("trainingInIndia", trainingInIndia)
    handleFormDataChange("trainingInIndia", trainingInIndia)
    console.log("trainingInAbroad", trainingAbroad)
    handleFormDataChange("trainingInAbroad", trainingAbroad)
    console.log(trainingDetails)
    handleFormDataChange("trainingDetails", trainingDetails)
    nextStep()
    // Clear any previous errors
    setErrors({});
  };

  return (
    <div className="education-training-container">
      <form onSubmit={handleSubmit}>
        {/* Education Details */}
        <div className="form-section">
          <h4 className="form-subtitle">Education Details</h4>
          
          {/* Basic Education */}
          
          <table className="education-table">
            <thead>
           <tr>
             <th colSpan="7" style={{textAlign:"center", fontStyle:"italic"}}>Basic</th>
           </tr>
             <tr>
                <th>Education</th>
                <th>Name of Board/University</th>
                <th>Marks Obtained (In %)</th>
                <th>Passing Year</th>
                <th>Stream</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {educationDetails.basic.map((edu, index) => (
                <tr key={index}>
                  <td>
                    <input type="text" name="education" value={edu.education} onChange={(e) => handleEducationChange('basic', index, e)} />
                    {errors[`basic_education_${index}`] && <span className="error">{errors[`basic_education_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="board" value={edu.board} onChange={(e) => handleEducationChange('basic', index, e)} />
                    {errors[`basic_board_${index}`] && <span className="error">{errors[`basic_board_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="marks" value={edu.marks} onChange={(e) => handleEducationChange('basic', index, e)} />
                    {errors[`basic_marks_${index}`] && <span className="error">{errors[`basic_marks_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="year" value={edu.year} onChange={(e) => handleEducationChange('basic', index, e)} />
                    {errors[`basic_year_${index}`] && <span className="error">{errors[`basic_year_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="stream" value={edu.stream} onChange={(e) => handleEducationChange('basic', index, e)} />
                    {errors[`basic_stream_${index}`] && <span className="error">{errors[`basic_stream_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="grade" value={edu.grade} onChange={(e) => handleEducationChange('basic', index, e)} />
                    {errors[`basic_grade_${index}`] && <span className="error">{errors[`basic_grade_${index}`]}</span>}
                  </td>
                  <td>
                    <button type="button" className='remvingButton' onClick={() => removeEducationRow('basic', index)}>x</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className='addingButton' onClick={() => addEducationRow('basic')}>+Add Basic Education</button>

          {/* Technical Education */}
          
          <table className="education-table">
            <thead>
           <tr>
             <th colSpan="7" style={{textAlign:"center", fontStyle:"italic"}}>Technical</th>
           </tr>
              <tr>
                <th>Education</th>
                <th>Name of Board/University</th>
                <th>Marks Obtained (In %)</th>
                <th>Passing Year</th>
                <th>Stream</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {educationDetails.technical.map((edu, index) => (
                <tr key={index}>
                  <td>
                    <input type="text" name="education" value={edu.education} onChange={(e) => handleEducationChange('technical', index, e)} />
                    {errors[`technical_education_${index}`] && <span className="error">{errors[`technical_education_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="board" value={edu.board} onChange={(e) => handleEducationChange('technical', index, e)} />
                    {errors[`technical_board_${index}`] && <span className="error">{errors[`technical_board_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="marks" value={edu.marks} onChange={(e) => handleEducationChange('technical', index, e)} />
                    {errors[`technical_marks_${index}`] && <span className="error">{errors[`technical_marks_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="year" value={edu.year} onChange={(e) => handleEducationChange('technical', index, e)} />
                    {errors[`technical_year_${index}`] && <span className="error">{errors[`technical_year_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="stream" value={edu.stream} onChange={(e) => handleEducationChange('technical', index, e)} />
                    {errors[`technical_stream_${index}`] && <span className="error">{errors[`technical_stream_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="grade" value={edu.grade} onChange={(e) => handleEducationChange('technical', index, e)} />
                    {errors[`technical_grade_${index}`] && <span className="error">{errors[`technical_grade_${index}`]}</span>}
                  </td>
                  <td>
                    <button type="button" className='remvingButton' onClick={() => removeEducationRow('technical', index)}>x</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className='addingButton' onClick={() => addEducationRow('technical')}>+Add Technical Education</button>

          {/* Professional Education */}
          
          <table className="education-table">
            <thead>
           <tr>
             <th colSpan="7" style={{textAlign:"center", fontStyle:"italic"}}>Professional</th>
           </tr>
              <tr>
                <th>Education</th>
                <th>Name of Board/University</th>
                <th>Marks Obtained (In %)</th>
                <th>Passing Year</th>
                <th>Stream</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {educationDetails.professional.map((edu, index) => (
                <tr key={index}>
                  <td>
                    <input type="text" name="education" value={edu.education} onChange={(e) => handleEducationChange('professional', index, e)} />
                    {errors[`professional_education_${index}`] && <span className="error">{errors[`professional_education_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="board" value={edu.board} onChange={(e) => handleEducationChange('professional', index, e)} />
                    {errors[`professional_board_${index}`] && <span className="error">{errors[`professional_board_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="marks" value={edu.marks} onChange={(e) => handleEducationChange('professional', index, e)} />
                    {errors[`professional_marks_${index}`] && <span className="error">{errors[`professional_marks_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="year" value={edu.year} onChange={(e) => handleEducationChange('professional', index, e)} />
                    {errors[`technical_year_${index}`] && <span className="error">{errors[`technical_year_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="stream" value={edu.stream} onChange={(e) => handleEducationChange('professional', index, e)} />
                    {errors[`professional_stream_${index}`] && <span className="error">{errors[`professional_stream_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="grade" value={edu.grade} onChange={(e) => handleEducationChange('professional', index, e)} />
                    {errors[`professional_grade_${index}`] && <span className="error">{errors[`professional_grade_${index}`]}</span>}
                  </td>
                  <td>
                    <button type="button" className='remvingButton'  onClick={() => removeEducationRow('professional', index)}>x</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className='addingButton' onClick={() => addEducationRow('professional')}>+Add Professional Education</button>
        </div>

        {/* Training Details */}
        <div className="form-section">
          <h4 className="form-subtitle">Training Details</h4>

          {/* Training in India */}
      
          <table className="training-table">
            <thead>
           <tr>
             <th colSpan="7" style={{textAlign:"center", fontStyle:"italic"}}>In India</th>
           </tr>
              <tr>
                <th>Training Type</th>
                <th>Topic Name</th>
                <th>Name of Institute</th>
                <th>Sponsored by</th>
                <th>Date From</th>
                <th>Date To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainingInIndia.map((train, index) => (
                <tr key={index}>
                  <td>
                    <input type="text" name="type" value={train.type} onChange={(e) => handleTrainingInIndiaChange(index, e)} />
                    {errors[`training_in_india_type_${index}`] && <span className="error">{errors[`training_in_india_type_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="topic" value={train.topic} onChange={(e) => handleTrainingInIndiaChange(index, e)} />
                    {errors[`training_in_india_topic_${index}`] && <span className="error">{errors[`training_in_india_topic_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="institute" value={train.institute} onChange={(e) => handleTrainingInIndiaChange(index, e)} />
                    {errors[`training_in_india_institute_${index}`] && <span className="error">{errors[`training_in_india_institute_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="sponsor" value={train.sponsor} onChange={(e) => handleTrainingInIndiaChange(index, e)} />
                    {errors[`training_in_india_sponsor_${index}`] && <span className="error">{errors[`training_in_india_sponsor_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="from" value={train.from} onChange={(e) => handleTrainingInIndiaChange(index, e)} />
                    {errors[`training_in_india_from_${index}`] && <span className="error">{errors[`training_in_india_from_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="to" value={train.to} onChange={(e) => handleTrainingInIndiaChange(index, e)} />
                    {errors[`training_in_india_to_${index}`] && <span className="error">{errors[`training_in_india_to_${index}`]}</span>}
                  </td>
                  <td>
                    <button type="button" className='remvingButton' onClick={() => removeTrainingInIndiaRow(index)}>x</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className='addingButton' onClick={addTrainingInIndiaRow}>+Add Training in India</button>

          {/* Training Abroad */}
          
          <table className="training-table">
            <thead>
           <tr>
             <th colSpan="7" style={{textAlign:"center", fontStyle:"italic"}}>Abroad</th>
           </tr>
              <tr>
                <th>Training Type</th>
                <th>Topic Name</th>
                <th>Name of Institute</th>
                <th>Sponsored by</th>
                <th>Date From</th>
                <th>Date To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainingAbroad.map((train, index) => (
                <tr key={index}>
                  <td>
                    <input type="text" name="type" value={train.type} onChange={(e) => handleTrainingAbroadChange(index, e)} />
                    {errors[`training_abroad_type_${index}`] && <span className="error">{errors[`training_abroad_type_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="topic" value={train.topic} onChange={(e) => handleTrainingAbroadChange(index, e)} />
                    {errors[`training_abroad_topic_${index}`] && <span className="error">{errors[`training_abroad_topic_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="institute" value={train.institute} onChange={(e) => handleTrainingAbroadChange(index, e)} />
                    {errors[`training_abroad_institute_${index}`] && <span className="error">{errors[`training_abroad_institute_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="sponsor" value={train.sponsor} onChange={(e) => handleTrainingAbroadChange(index, e)} />
                    {errors[`training_abroad_sponsor_${index}`] && <span className="error">{errors[`training_abroad_sponsor_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="from" value={train.from} onChange={(e) => handleTrainingAbroadChange(index, e)} />
                    {errors[`training_abroad_from_${index}`] && <span className="error">{errors[`training_abroad_from_${index}`]}</span>}
                  </td>
                  <td>
                    <input type="text" name="to" value={train.to} onChange={(e) => handleTrainingAbroadChange(index, e)} />
                    {errors[`training_abroad_to_${index}`] && <span className="error">{errors[`training_abroad_to_${index}`]}</span>}
                  </td>
                  <td>
                    <button type="button" className='remvingButton' onClick={() => removeTrainingAbroadRow(index)}>x</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className='addingButton' onClick={addTrainingAbroadRow}>+Add Training Abroad</button>
        </div>

        <div className="form-actions">
        <button type='button' onClick={prevStep} className="submit-btn" > &lt; Previous </button>
        <button type="submit" className="submit-btn">Next &gt; </button>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default EducationTrainingDetailsForm;
