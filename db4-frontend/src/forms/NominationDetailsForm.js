import React, { useState } from 'react';
import Footer from '../components/Footer';

const NominationDetailsForm = ({ handleSubmit, prevStep, handleFormDataChange }) => {
  const [nominee, setNominee] = useState({
    name: '',
    relation: '',
    typeOfNomination: '',
    nominationPercentage: '',
    nomineeAge:'' ,
    presentAddress: '',
    block: '',
    panchayatMandal: '',
    district: '',
    state: '',
    pinCode: '',
    phoneNumber: '',
  });


  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNominee({ ...nominee, [name]: value });
  };

  const validateForm = () => {
    let validationErrors = {};
    if (!nominee.name) validationErrors.name = 'Nominee name is required';
    if (!nominee.relation) validationErrors.relation = 'Relation is required';
    if (!nominee.typeOfNomination) validationErrors.typeOfNomination = 'Type of nomination is required';
    if (!nominee.nominationPercentage) validationErrors.nominationPercentage = 'Nomination percentage is required';
    if (!nominee.nomineeAge) validationErrors.nomineeAge = 'Enter Age';
    if (!nominee.presentAddress) validationErrors.presentAddress = 'Present address is required';
    if (!nominee.district) validationErrors.district = 'District is required';
    if (!nominee.state) validationErrors.state = 'State is required';
    if (!nominee.pinCode) validationErrors.pinCode = 'Pin Code is required';
    if (!nominee.phoneNumber) validationErrors.phoneNumber = 'Phone number is required';

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleFinalSubmit  = (e) => {
    e.preventDefault()
    if (validateForm()) {
      handleFormDataChange("nominationDetails", nominee)
      console.log("nominationDetails", nominee)
      handleSubmit()
    }
  };

  return (
    <div className="container">
      <h2>FORM-7:EMPLOYEE NOMINATION DETAILS</h2>
      <form onSubmit={handleFinalSubmit}>
        <div className="form-group">
          <label>Nominee Name:</label>
          <input
            type="text"
            name="name"
            value={nominee.name}
            onChange={handleInputChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Relation with Employee:</label>
          <input
            type="text"
            name="relation"
            value={nominee.relation}
            onChange={handleInputChange}
          />
          {errors.relation && <span className="error">{errors.relation}</span>}
        </div>
        <div className="form-group">
          <label>Type of Nomination:</label>
          <input
            type="text"
            name="typeOfNomination"
            value={nominee.typeOfNomination}
            onChange={handleInputChange}
          />
          {errors.typeOfNomination && <span className="error">{errors.typeOfNomination}</span>}
        </div>
        <div className="form-group">
          <label>Nomination Percentage (%):</label>
          <input
            type="number"
            name="nominationPercentage"
            value={nominee.nominationPercentage}
            onChange={handleInputChange}
            min="0"
            max="100"
          />
          {errors.nominationPercentage && <span className="error">{errors.nominationPercentage}</span>}
        </div>
        <div className="form-group">
          <label>Nominee Age:</label>
          <input
            type="number"
            name="nomineeAge"
            value={nominee.nomineeAge}
            onChange={handleInputChange}
            min="0"
            max="100"
          />
          {errors.nomineeAge && <span className="error">{errors.nomineeAge}</span>}
        </div>
        <div className="form-group">
          <label>Present Address:</label>
          <textarea
            name="presentAddress"
            value={nominee.presentAddress}
            onChange={handleInputChange}
          />
          {errors.presentAddress && <span className="error">{errors.presentAddress}</span>}
        </div>
        <div className="form-group">
          <label>Block:</label>
          <input
            type="text"
            name="block"
            value={nominee.block}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Panchayat/Mandal:</label>
          <input
            type="text"
            name="panchayatMandal"
            value={nominee.panchayatMandal}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>District:</label>
          <input
            type="text"
            name="district"
            value={nominee.district}
            onChange={handleInputChange}
          />
          {errors.district && <span className="error">{errors.district}</span>}
        </div>
        <div className="form-group">
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={nominee.state}
            onChange={handleInputChange}
          />
          {errors.state && <span className="error">{errors.state}</span>}
        </div>
        <div className="form-group">
          <label>Pin Code:</label>
          <input
            type="text"
            name="pinCode"
            value={nominee.pinCode}
            onChange={handleInputChange}
          />
          {errors.pinCode && <span className="error">{errors.pinCode}</span>}
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={nominee.phoneNumber}
            onChange={handleInputChange}
          />
          {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
        </div>
        <div className="actions">
          <button type="button" onClick={prevStep}>
           &lt; Previous
          </button>
          <button type="submit" >
            Submit
          </button>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default NominationDetailsForm;