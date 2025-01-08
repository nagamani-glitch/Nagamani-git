import React, { useState } from 'react';
import DocumentCard from './DocumentCard';
import './DocumentRequestPage.css';

const DocumentRequestPage = () => {
  const [documentData, setDocumentData] = useState([
    { title: "PANCARD", current: 1, total: 10, details: ["Alexander Smith", "Alice Foster", "Amelia Cooper", "Aria Powell"] },
    { title: "Passport", current: 1, total: 6, details: ["John Doe", "Jane Doe"] },
    { title: "Aadhar", current: 3, total: 6, details: ["Rahul Kumar", "Priya Singh", "Aman Gupta"] },
  ]);

  const [newDocument, setNewDocument] = useState({
    title: '',
    employee: '',
    format: '',
    maxSize: '',
    description: ''
  });

  // Add this handler function
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setNewDocument(prev => ({
    ...prev,
    [name]: value
  }));
};
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

  // Add this save handler
const handleSave = () => {
  const newDocumentRequest = {
    title: newDocument.title,
    current: 0,
    total: 1,
    details: [newDocument.employee]
  };
  
  setDocumentData(prev => [...prev, newDocumentRequest]);
  setNewDocument({
    title: '',
    employee: '',
    format: '',
    maxSize: '',
    description: ''
  });
  closeCreateModal();
};

const handleDocumentEdit = (title, updatedData) => {
  setDocumentData(prev => prev.map(doc => 
    doc.title === title ? { ...doc, ...updatedData } : doc
  ));
};

const handleDocumentDelete = (title) => {
  setDocumentData(prev => prev.filter(doc => doc.title !== title));
};


const dropdownMenuStyle = {
  position: 'absolute',
  top: '100%',
  right: 0,
  backgroundColor: 'white',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  borderRadius: '4px',
  padding: '8px 0',
  zIndex: 1000,
  minWidth: '200px'
};


const dropdownButtonStyle = {
  width: '100%',
  padding: '8px 16px',
  border: 'none',
  backgroundColor: 'transparent',
  textAlign: 'left',
  cursor: 'pointer'
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
          <div className="actions-dropdown" style={{display:"inline", position: 'relative'}}>
            <button className="actions-button" onClick={toggleActions}>Actions</button>
            {isActionsOpen && (
              <div style={dropdownMenuStyle}>
                <button style={dropdownButtonStyle}>Bulk Approve Requests</button>
                <button style={dropdownButtonStyle}>Bulk Reject Requests</button>
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
            onEdit={handleDocumentEdit}
            onDelete={handleDocumentDelete}
          />
        ))}
      </div>


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
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      width: '400px',
      maxHeight: '80vh',
      overflowY: 'auto',
      position: 'relative',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      zIndex: 10000
    }}>
      <button style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#666'
      }} onClick={closeCreateModal}>×</button>
      
      <h3 style={{
        marginTop: 0,
        marginBottom: '20px',
        color: '#333',
        fontSize: '20px'
      }}>Create Document Request</h3>
      
      <label style={{
        display: 'block',
        marginBottom: '15px'
      }}>
        Title: 
        <input style={{
          width: '100%',
          padding: '8px',
          marginTop: '5px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px'
        }} type="text" name="title" value={newDocument.title} onChange={handleInputChange} />
      </label>
      
      <label style={{
        display: 'block',
        marginBottom: '15px'
      }}>
        Employee: 
        <input style={{
          width: '100%',
          padding: '8px',
          marginTop: '5px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px'
        }} type="text" name="employee" value={newDocument.employee} onChange={handleInputChange} />
      </label>
      
      <label style={{
        display: 'block',
        marginBottom: '15px'
      }}>
        Format: 
        <input style={{
          width: '100%',
          padding: '8px',
          marginTop: '5px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px'
        }} type="text" name="format" value={newDocument.format} onChange={handleInputChange} />
      </label>
      
      <label style={{
        display: 'block',
        marginBottom: '15px'
      }}>
        Max Size: 
        <input style={{
          width: '100%',
          padding: '8px',
          marginTop: '5px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px'
        }} type="text" name="maxSize" value={newDocument.maxSize} onChange={handleInputChange} />
      </label>
      
      <label style={{
        display: 'block',
        marginBottom: '10px'
      }}>
        Description: 
        <textarea style={{
          width: '100%',
          padding: '8px',
          marginTop: '5px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          minHeight: '60px',
          fontSize: '14px'
        }} name="description" value={newDocument.description} onChange={handleInputChange}></textarea>
      </label>
      
      <button style={{
        backgroundColor: '#e74c3c',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        float: 'right'
      }} onClick={handleSave}>Save</button>
    </div>
  </div>
)}
    </div>
  );
};

export default DocumentRequestPage;

