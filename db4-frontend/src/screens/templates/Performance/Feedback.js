import React, { useState } from 'react';
import CreateFeedback from './CreateFeedback';  
import './Feedback.css';

const Feedback = ({ feedbackData, setFeedbackData }) => {
    const [activeTab, setActiveTab] = useState('feedbackToReview');
    const [searchQuery, setSearchQuery] = useState('');

    // Add modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // For filter data 
    const [filterPopupVisible, setFilterPopupVisible] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({
      title: '',
      employee: '',
      status: '',
      manager: '',
      startDate: '',
      endDate: '',
      archive: false,
    });
  
    // Function to handle the addition of new feedback data
    const handleAddFeedback = (newFeedback) => {
      setFeedbackData(prevData => ({
        ...prevData,
        [activeTab]: [...prevData[activeTab], newFeedback],
      }));
      setIsCreateModalOpen(false); // Close modal after saving
    };

  
    const handleDelete = (id) => {
      setFeedbackData(prevData => ({
        ...prevData,
        [activeTab]: prevData[activeTab].filter(item => item.id !== id),
      }));
    };
  
    const handleArchive = (id) => {
      alert(`Archived feedback with ID: ${id}`);
    };
  
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };
  
    const filteredFeedbackData = feedbackData[activeTab].filter(item => {
      const matchesSearch = item.employee.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        (filterCriteria.title ? item.title.toLowerCase().includes(filterCriteria.title.toLowerCase()) : true) &&
        (filterCriteria.employee ? item.employee.toLowerCase().includes(filterCriteria.employee.toLowerCase()) : true) &&
        (filterCriteria.status ? item.status.toLowerCase().includes(filterCriteria.status.toLowerCase()) : true) &&
        (filterCriteria.manager ? item.manager.toLowerCase().includes(filterCriteria.manager.toLowerCase()) : true) &&
        (filterCriteria.startDate ? item.startDate.includes(filterCriteria.startDate) : true) &&
        (filterCriteria.endDate ? item.dueDate.includes(filterCriteria.endDate) : true) &&
        (!filterCriteria.archive || item.archive === filterCriteria.archive);
  
      return matchesSearch && matchesFilter;
    });
  
    const handleFilterChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFilterCriteria(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
      console.log("Filtered feedback data:", filteredFeedbackData);

    };
  
    const handleFilterSave = () => {
      setFilterPopupVisible(false);
    };
  
    const renderTableData = (data) => {
      return data.map(item => (
        <tr key={item.id}>
          <td>{item.employee}</td>
          <td>{item.title}</td>
          <td>{item.status}</td>
          <td>{item.startDate}</td>
          <td>{item.dueDate}</td>
          <td>
            <button onClick={() => handleArchive(item.id)}>📥</button>
            <button onClick={() => handleDelete(item.id)}>🗑️</button>
          </td>
        </tr>
      ));
    };
  
    return (
      <div className="feedback">
        <div className="feedback-header">
          <h2>Feedbacks</h2>
          
  <div className="toolbar">
    <input type="text" placeholder="Search" value={searchQuery} onChange={handleSearchChange} />
    <button onClick={() => setFilterPopupVisible(true)}>Filter</button>
    <button>Actions</button>
    <button className="create-btn" onClick={() => setIsCreateModalOpen(true)}>+ Create</button>
  </div>
  {isCreateModalOpen && (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}>×</button>
        <CreateFeedback addFeedback={handleAddFeedback} />
      </div>
    </div>
  )}

        </div>
  
        {/* Filter Popup */}
        {filterPopupVisible && (
          <div className="filter-popup">
            <div className='filter-popup-content'>
              <h3>Feedback</h3>
              <div className='group'>
                <label>Feedback Title:
                  <input
                    type="text"
                    name="title"
                    value={filterCriteria.title}
                    onChange={handleFilterChange}
                  />
                </label>
                <label>Employee:
                  <input
                    type="text"
                    name="employee"
                    value={filterCriteria.employee}
                    onChange={handleFilterChange}
                  />
                </label>
              </div>
              <div className='group'>
                <label>Status:
                  <input
                    type="text"
                    name="status"
                    value={filterCriteria.status}
                    onChange={handleFilterChange}
                  />
                </label>
  
                <label>Manager:
                  <input
                    type="text"
                    name="manager"
                    value={filterCriteria.manager}
                    onChange={handleFilterChange}
                  />
                </label>
              </div>
              <div className='group'>
                <label>Start Date:
                  <input
                    type="date"
                    name="startDate"
                    value={filterCriteria.startDate}
                    onChange={handleFilterChange}
                  />
                </label>
  
                <label>End Date:
                  <input
                    type="date"
                    name="endDate"
                    value={filterCriteria.endDate}
                    onChange={handleFilterChange}
                  />
                </label>
              </div>
              <div>
                <label>Archive</label>
                <input
                  type="checkbox"
                  name="archive"
                  checked={filterCriteria.archive}
                  onChange={handleFilterChange}
                />
              </div>
              <button onClick={handleFilterSave}>Save</button>
            </div>
          </div>
        )}
  
        {/* Tabs for different feedback types */}
        <div className="tabs">
          <button className={activeTab === 'selfFeedback' ? 'active' : ''} onClick={() => setActiveTab('selfFeedback')}>Self Feedback</button>
          <button className={activeTab === 'requestedFeedback' ? 'active' : ''} onClick={() => setActiveTab('requestedFeedback')}>Requested Feedback</button>
          <button className={activeTab === 'feedbackToReview' ? 'active' : ''} onClick={() => setActiveTab('feedbackToReview')}>Feedback to Review</button>
          <button className={activeTab === 'anonymousFeedback' ? 'active' : ''} onClick={() => setActiveTab('anonymousFeedback')}>Anonymous Feedback</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Title</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>Due On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderTableData(filteredFeedbackData)}
          </tbody>
        </table>
        <div className="pagination">Page 1 of 1</div>
      </div>
    );
  };
  
  export default Feedback;
