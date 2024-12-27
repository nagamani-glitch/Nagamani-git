import React, { useState } from 'react';
import DocumentCard from './DocumentCard';
import './DocumentRequestPage.css';

const DocumentRequestPage = () => {
  const [documentData] = useState([
    { title: "PANCARD", current: 1, total: 10, details: ["Alexander Smith", "Alice Foster", "Amelia Cooper", "Aria Powell"] },
    { title: "Passport", current: 1, total: 6, details: ["John Doe", "Jane Doe"] },
    { title: "Aadhar", current: 3, total: 6, details: ["Rahul Kumar", "Priya Singh", "Aman Gupta"] },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const filteredData = documentData.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const toggleActions = () => setIsActionsOpen(!isActionsOpen);

  return (
    <div className="document-request-page">
      <header className="header">
        <h2>Document Requests</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="header-buttons">
          <button className="filter-button" onClick={openFilterModal}>Filter</button>
          <div className="actions-dropdown" style={{display:"inline"}}>
            <button className="actions-button" onClick={toggleActions}>Actions</button>
            {isActionsOpen && (
              <div className="dropdown-menu">
                <button>Bulk Approve Requests</button>
                <button>Bulk Reject Requests</button>
              </div>
            )}
          </div>
          <button className="create-button" onClick={openCreateModal}>+ Create</button>
        </div>
      </header>

      <div className="document-list">
        {filteredData.map((doc, index) => (
          <DocumentCard
            key={index}
            title={doc.title}
            current={doc.current}
            total={doc.total}
            details={doc.details}
          />
        ))}
      </div>

      <button className="add-button">+</button>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={closeFilterModal}>×</button>
            <h3>Filter Options</h3>
            <div>
              <label><input type="checkbox" /> Work Info</label>
            </div>
            <div>
              <label><input type="checkbox" /> Document Request</label>
            </div>
            <button onClick={closeFilterModal}>Filter</button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={closeCreateModal}>×</button>
            <h3>Create Document Request</h3>
            <label>Title: <input type="text" /></label>
            <label>Employee: <input type="text" /></label>
            <label>Format: <input type="text" /></label>
            <label>Max Size: <input type="text" /></label>
            <label>Description: <textarea></textarea></label>
            <button onClick={closeCreateModal}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentRequestPage;
