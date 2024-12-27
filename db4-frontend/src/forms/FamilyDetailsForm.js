import React, { useState } from 'react';
import Footer from '../components/Footer';

const FamilyDetailsForm = ({ nextStep, prevStep, handleFormDataChange }) => {
  const [familyMembers, setFamilyMembers] = useState([
    { name: '', relation: '', dob: '', dependent: 'No', employed: 'unemployed', sameDept: 'No', empCode: '', department: '', eSalaryCode: '' },
  ]);
  const [errors, setErrors] = useState([]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedMembers = [...familyMembers];
    updatedMembers[index][name] = value;
    setFamilyMembers(updatedMembers);
  };

  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      { name: '', relation: '', dob: '', dependent: 'No', employed: 'unemployed', sameDept: 'No', empCode: '', department: '', eSalaryCode: '' },
    ]);
  };

  const removeFamilyMember = (index) => {
    const updatedMembers = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(updatedMembers);
  };

  const validateForm = () => {
    const newErrors = familyMembers.map((member) => {
      let error = {};
      if (!member.name) error.name = 'Name is required';
      if (!member.relation) error.relation = 'Relation is required';
      if (!member.dob) error.dob = 'Date of birth is required';
      return error;
    });

    setErrors(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleFormDataChange("familyDetails", familyMembers)
      console.log("familyDetails", familyMembers)
      nextStep();
    }
  };

  return (
    <div>
      <h2>FORM-5:EMPLOYEE FAMILY INFORMATION</h2>
      <table border="1" style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Family Member Name</th>
            <th>Relation</th>
            <th>Date of Birth</th>
            <th>Dependent</th>
            <th>Employment Status</th>
            <th>In Same Department?</th>
            <th>Employee Code</th>
            <th>Department</th>
            <th>E-Salary Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          { familyMembers.map((member, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  name="name"
                  value={member.name}
                  onChange={(e) => handleInputChange(index, e)}
                />
                {errors[index]?.name && <span style={{ color: 'red' }}>{errors[index].name}</span>}
              </td>
              <td>
                <input
                  type="text"
                  name="relation"
                  value={member.relation}
                  onChange={(e) => handleInputChange(index, e)}
                />
                {errors[index]?.relation && <span style={{ color: 'red' }}>{errors[index].relation}</span>}
              </td>
              <td>
                <input
                  type="date"
                  name="dob"
                  value={member.dob}
                  onChange={(e) => handleInputChange(index, e)}
                />
                {errors[index]?.dob && <span style={{ color: 'red' }}>{errors[index].dob}</span>}
              </td>
              <td>
                <select name="dependent" value={member.dependent} onChange={(e) => handleInputChange(index, e)}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </td>
              <td>
                <select name="employed" value={member.employed} onChange={(e) => handleInputChange(index, e)} >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                </select>
              </td>
              <td>
                <select name="sameDept" value={member.sameDept} onChange={(e) => handleInputChange(index, e)} >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                </select>
              </td>
              <td>
                <input type="text" name="empCode" value={member.empCode} onChange={(e) => handleInputChange(index, e)} />
              </td>
              <td>
                <input type="text" name="department" value={member.department} onChange={(e) => handleInputChange(index, e)} />
              </td>
              <td>
                <input type="text" name="eSalaryCode" value={member.eSalaryCode} onChange={(e) => handleInputChange(index, e)} />
              </td>
              <td>
                <button onClick={() => removeFamilyMember(index)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addFamilyMember} style={{ marginTop: '10px' }}>
        Add Family Member
      </button>
      <div style={{ marginTop: '20px' }}>
        <button onClick={prevStep}> &lt; Previous</button>
        <button onClick={handleSubmit}>Next &gt; </button>
      </div>
      <Footer />
    </div>
  );
};

export default FamilyDetailsForm;