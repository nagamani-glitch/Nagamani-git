import React, { useState, useEffect } from 'react';
import { getAssets, createAsset, updateAsset, deleteAsset } from '../api/assetHistory';
import './AssetHistory.css';

const AssetHistory = () => {
  const [assets, setAssets] = useState([]);
  const [editingAssetId, setEditingAssetId] = useState(null);
  const [editData, setEditData] = useState({ status: '', returnDate: '' });
  const [newAssetData, setNewAssetData] = useState({ assetName: '', category: '', status: '', returnDate: '', allottedDate: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await getAssets();
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching asset history:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAsset(id);
      fetchAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const handleEditClick = (asset) => {
    setEditingAssetId(asset._id);
    setEditData({
      status: asset.status,
      returnDate: asset.returnDate ? new Date(asset.returnDate).toISOString().split('T')[0] : '',
    });
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      await createAsset(newAssetData);
      fetchAssets();
      setNewAssetData({ assetName: '', category: '', status: '', returnDate: '', allottedDate: '' });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding new asset:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateAsset(editingAssetId, editData);
      setEditingAssetId(null);
      fetchAssets();
    } catch (error) {
      console.error('Error updating asset:', error);
    }
  };

  const filteredAssets = assets.filter(asset =>
    asset.assetName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="asset-history">
      <h1>Asset History</h1>

      <div className="asset-history-actions">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by asset name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="add-asset-button" onClick={() => setIsAddModalOpen(true)}>Add New Asset</button>
      </div>

      <div className="asset-history-table">
        <table>
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Category</th>
              <th>Allotted Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset) => (
              <tr key={asset._id}>
                <td>{asset.assetName}</td>
                <td>{asset.category}</td>
                <td>{new Date(asset.allottedDate).toLocaleDateString()}</td>
                <td>{asset.returnDate ? new Date(asset.returnDate).toLocaleDateString() : 'N/A'}</td>
                <td>{asset.status}</td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-button" onClick={() => handleEditClick(asset)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(asset._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Asset</h2>
            <form onSubmit={handleAddAsset}>
              <label>
                Asset Name:
                <input
                  type="text"
                  placeholder="Asset Name"
                  value={newAssetData.assetName}
                  onChange={(e) => setNewAssetData({ ...newAssetData, assetName: e.target.value })}
                  required
                />
              </label>
              <label>
                Category:
                <input
                  type="text"
                  placeholder="Category"
                  value={newAssetData.category}
                  onChange={(e) => setNewAssetData({ ...newAssetData, category: e.target.value })}
                  required
                />
              </label>
              <label>
                Allotted Date:
                <input
                  type="date"
                  placeholder="Allotted Date"
                  value={newAssetData.allottedDate}
                  onChange={(e) => setNewAssetData({ ...newAssetData, allottedDate: e.target.value })}
                  required
                />
              </label>
              <label>
                Status:
                <select
                  value={newAssetData.status}
                  onChange={(e) => setNewAssetData({ ...newAssetData, status: e.target.value })}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="In Use">In Use</option>
                  <option value="Returned">Returned</option>
                  <option value="Under Service">Under Service</option>
                  <option value="Available">Available</option>
                </select>
              </label>
              <label>
                Return Date:
                <input
                  type="date"
                  placeholder="Return Date"
                  value={newAssetData.returnDate}
                  onChange={(e) => setNewAssetData({ ...newAssetData, returnDate: e.target.value })}
                />
              </label>
              <button type="submit" className="submit-button">Submit</button>
              <button type="button" className="cancel-button" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {editingAssetId && (
        <div className="edit-form-modal">
          <div className="modal-content">
            <h2>Edit Asset</h2>
            <form onSubmit={handleUpdate}>
              <label>
                Status:
                <select
                  name="status"
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                >
                  <option value="In Use">In Use</option>
                  <option value="Returned">Returned</option>
                  <option value="Under Service">Under Service</option>
                  <option value="Available">Available</option>
                </select>
              </label>
              <label>
                Return Date:
                <input
                  type="date"
                  name="returnDate"
                  value={editData.returnDate}
                  onChange={(e) => setEditData({ ...editData, returnDate: e.target.value })}
                />
              </label>
              <button type="submit" className="submit-button">Update</button>
              <button type="button" className="cancel-button" onClick={() => setEditingAssetId(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetHistory;
