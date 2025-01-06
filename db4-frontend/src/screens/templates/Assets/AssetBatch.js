import React, { useState, useEffect } from 'react';
import './AssetBatch.css';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AssetBatch() {
  const [assetBatches, setAssetBatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    batchNumber: '',
    description: '',
    numberOfAssets: ''
  });
  const [editBatchId, setEditBatchId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssetBatches();
  }, []);

  const fetchAssetBatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/asset-batches`);
      setAssetBatches(response.data);
    } catch (err) {
      console.error('Error fetching asset batches:', err.message);
      setError('Failed to fetch asset batches. Please check the server.');
    }
  };

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    try {
      const response = await axios.get(`${API_URL}/api/asset-batches/search?q=${e.target.value}`);
      setAssetBatches(response.data);
    } catch (err) {
      console.error('Error during search:', err.message);
      setError('Failed to fetch search results.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/api/asset-batches/${editBatchId}`, formData);
        setAssetBatches(assetBatches.map(batch => batch._id === editBatchId ? { ...batch, ...formData } : batch));
        setIsEditing(false);
        setEditBatchId(null);
      } else {
        const response = await axios.post(`${API_URL}/api/asset-batches`, formData);
        setAssetBatches([...assetBatches, response.data]);
      }
      setFormData({ batchNumber: '', description: '', numberOfAssets: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error creating/updating asset batch:', err.message);
      setError('Failed to save asset batch. Please try again.');
    }
  };

  const handleEdit = (batch) => {
    setFormData({
      batchNumber: batch.batchNumber,
      description: batch.description,
      numberOfAssets: batch.numberOfAssets
    });
    setEditBatchId(batch._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/asset-batches/${id}`);
      setAssetBatches(assetBatches.filter(batch => batch._id !== id));
    } catch (err) {
      console.error('Error deleting asset batch:', err.message);
      setError('Failed to delete asset batch. Please try again.');
    }
  };

  return (
    <div className="asset-batch-container">
      <h1 className="asset-batch-header">Asset Batch</h1>
      
      {error && <p className="error-message">{error}</p>}
      
      <div className="asset-batch-actions">
        <div className="asset-batch-search">
          <input
            type="text"
            placeholder="Search asset batch..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <button className="asset-batch-create-button" onClick={() => {
          setFormData({ batchNumber: '', description: '', numberOfAssets: '' });
          setShowForm(true);
          setIsEditing(false);
        }}>
          Create Asset Batch
        </button>
      </div>
      
      {showForm && (
        <div className="modal">
          <form onSubmit={handleCreateBatch}>
            <label>Batch Number</label>
            <input
              type="text"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleInputChange}
              required
            />

            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />

            <label>Number of Assets</label>
            <input
              type="number"
              name="numberOfAssets"
              value={formData.numberOfAssets}
              onChange={handleInputChange}
              required
            />

            <button type="submit">{isEditing ? 'Update' : 'Submit'}</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}

      <div className="asset-batch-table-container">
        <table className="asset-batch-table">
          <thead>
            <tr>
              <th>Batch Number</th>
              <th>Description</th>
              <th>Number of Assets</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assetBatches.map((batch) => (
              <tr key={batch._id}>
                <td>{batch.batchNumber}</td>
                <td>{batch.description}</td>
                <td>{batch.numberOfAssets}</td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-button" onClick={() => handleEdit(batch)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(batch._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssetBatch;
