// AddAsset.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AddAsset.css';

const AddAsset = ({ onClose, refreshAssets, editAsset }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [currentEmployee, setCurrentEmployee] = useState('');
  const [previousEmployees, setPreviousEmployees] = useState('');

  useEffect(() => {
    if (editAsset) {
      // Pre-fill form with asset data if editing
      setName(editAsset.name);
      setCategory(editAsset.category);
      setStatus(editAsset.status);
      setCurrentEmployee(editAsset.currentEmployee);
      setPreviousEmployees(editAsset.previousEmployees.join(', '));
    }
  }, [editAsset]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const assetData = {
      name,
      category,
      status,
      currentEmployee,
      previousEmployees: previousEmployees.split(',').map(emp => emp.trim())
    };
  
    try {
      if (editAsset) {
        // Update existing asset
        console.log("Attempting to update asset:", assetData);
        await axios.put(`https://db-4-demo-project-hlv5.vercel.app//api/assets/${editAsset._id}`, assetData);
        console.log("Asset updated successfully.");
      } else {
        // Create new asset
        console.log("Attempting to create new asset:", assetData);
        await axios.post('https://db-4-demo-project-hlv5.vercel.app//api/assets', assetData);
        console.log("Asset created successfully.");
      }
  
      // Refresh the asset list and close the modal
      refreshAssets();
      onClose();
    } catch (error) {
      console.error("Error submitting asset data:", error);
      alert("An error occurred while submitting data. Please try again.");
    }
  };
  

  return (
    <div className="overlay">
      <div className="modal-container">
        <button onClick={onClose} className="close-button">&times;</button>
        <h2>{editAsset ? 'Edit Asset' : 'Add Asset'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Status</label>
            <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Current User</label>
            <input type="text" value={currentEmployee} onChange={(e) => setCurrentEmployee(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Previous Employees</label>
            <input type="text" value={previousEmployees} onChange={(e) => setPreviousEmployees(e.target.value)} />
          </div>
          <button type="submit" className="submit-button">Save</button>
        </form>
      </div>
    </div>
  );
};

export default AddAsset;
