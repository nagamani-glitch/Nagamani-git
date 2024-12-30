import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddAsset from './AddAsset';
import './AssetView.css';

const AssetView = () => {
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState(''); // New stage filter
  const [isModalOpen, setModalOpen] = useState(false);
  const [editAsset, setEditAsset] = useState(null); // To hold the asset being edited
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error handling

  // Fetch assets from the backend
  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = () => {
    setLoading(true);
    axios
      .get('https://db-4-demo-project-hlv5.vercel.app/api/assets')
      .then((response) => {
        setAssets(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching assets:', error);
        setError('Failed to load assets');
        setLoading(false);
      });
  };

  // Handle opening the add asset modal
  const handleAddAssetClick = () => {
    setEditAsset(null); // Reset edit asset
    setModalOpen(true); // Open the modal
  };

  // Handle opening the edit modal with pre-filled data
  const handleEditClick = (asset) => {
    setEditAsset(asset); // Set the asset to edit
    setModalOpen(true); // Open the modal
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setModalOpen(false); // Close the modal
    setSearchTerm(''); // Reset search term when closing the modal
    setFilterStage(''); // Reset filter when closing the modal
  };

  // Filter assets based on search term and stage
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      filterStage === 'Name'
        ? asset.name.toLowerCase().includes(searchTerm.toLowerCase())
        : filterStage === 'Category'
        ? asset.category.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
    return matchesSearch;
  });

  // Handle deleting an asset
  const handleDelete = (assetId) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setLoading(true); // Show loading state when deleting
      axios
        .delete(`https://db-4-demo-project-hlv5.vercel.app/api/assets/${assetId}`)
        .then(() => {
          fetchAssets(); // Refresh the list of assets after deletion
        })
        .catch((error) => {
          console.error('Error deleting asset:', error);
          setError('Failed to delete asset');
          setLoading(false);
        });
    }
  };
  

  return (
    <div className="asset-view-container">
      <div className="header-container">
        <h2 className="asset-heading">Assets Category</h2>

        <input
          type="text"
          className="search-input"
          placeholder={`Search by ${filterStage || 'Name or Category'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="stage-dropdown"
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
        >
          <option value="">Select Filter</option>
          <option value="Name">Filter by Name</option>
          <option value="Category">Filter by Category</option>
        </select>

        <button className="add-button" onClick={handleAddAssetClick}>Add Asset</button>
      </div>

      {loading && <p>Loading assets...</p>} {/* Loading state */}
      {error && <p className="error">{error}</p>} {/* Error state */}

      <div className="asset-list-container">
        <table className="asset-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Current Employee</th>
              <th>Previous Employees</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <tr key={asset._id}>
                  <td>{asset.name}</td>
                  <td>{asset.category}</td>
                  <td>{asset.status}</td>
                  <td>{asset.currentEmployee || 'None'}</td>
                  <td>{asset.previousEmployees.join(', ') || 'None'}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEditClick(asset)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(asset._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-assets">
                  No assets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <AddAsset
          onClose={handleCloseModal}
          refreshAssets={fetchAssets}
          editAsset={editAsset} // Pass the asset to be edited
        />
      )}
    </div>
  );
};

export default AssetView;
