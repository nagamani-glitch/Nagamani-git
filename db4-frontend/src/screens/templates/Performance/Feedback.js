import React, { useState } from 'react';
import {Link} from 'react-router-dom'; 
import './Feedback.css';

const initialFeedbackData = {
  selfFeedback: [
    { id: 1, employee: 'Hannah Brooks', title: 'Bewertung', status: 'Not Started', startDate: 'Nov. 1, 2024', dueDate: 'Nov. 1, 2024' },
    { id: 2, employee: 'Virat Kohli', title: 'Cricketer', status: 'Started', startDate: 'Dec. 1, 2022', dueDate: 'Dec. 1, 2024' },
    { id: 3, employee: 'Anusha Shetty', title: 'Trainer', status: 'Started', startDate: 'Jul. 21, 2024', dueDate: 'Jun. 1, 2025' },
  ],
  requestedFeedback: [
    { id: 4, employee: 'Caleb Fisher', title: 'Tinubu’s Performance', status: 'On Track', startDate: 'Oct. 31, 2024', dueDate: 'Oct. 31, 2024' },
    { id: 5, employee: 'John Admin', title: 'Administrator', status: 'Closed', startDate: 'Oct. 12, 2020', dueDate: 'Nov. 31, 2020' },
    { id: 6, employee: 'Sania Fisher', title: 'Developer', status: 'On Track', startDate: 'Jan. 31, 2016', dueDate: 'Feb. 1, 2016' },
  ],
  feedbackToReview: [
    { id: 7, employee: 'Lucy Cruz', title: 'Tinubu’s Performance', status: 'Closed', startDate: 'Mar. 31, 2022', dueDate: 'Apr. 31, 2023' },
    { id: 8, employee: 'Amitha Chaudhary', title: 'React Developer', status: 'On Track', startDate: 'May. 17, 2004', dueDate: 'Jun. 17, 2004' },
    { id: 9, employee: 'Ravi Gautam', title: 'Civil Engineer', status: 'Started', startDate: 'Aug. 15, 2019', dueDate: 'Sept. 15, 2019' },
  ],
  anonymousFeedback: [
    { id: 10, employee: 'Alice Foster', title: 'Django Developer Feedback', status: 'On Track', startDate: 'May 1, 2024', dueDate: 'May 31, 2024' },
    { id: 11, employee: 'Priyanka Gautam', title: 'Node Developer Feedback', status: 'Not Started', startDate: 'Sept 1, 2024', dueDate: 'Oct 31, 2024' },
    { id: 12, employee: 'Sheetal Yadav', title: 'Redux Developer Feedback', status: 'Started', startDate: 'Nov 1, 2021', dueDate: 'Dec 31, 2021' },
  ],
};

const Feedback = ({ feedbackData, setFeedbackData }) => {
    const [activeTab, setActiveTab] = useState('feedbackToReview');
    const [searchQuery, setSearchQuery] = useState('');
    
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
            <Link to={{ pathname: "/feedback/create", state: { feedbackData, handleAddFeedback } }}>
              <button className="create-btn">+ Create</button>
            </Link>
          </div>
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
