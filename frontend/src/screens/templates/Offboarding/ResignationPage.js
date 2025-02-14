import React, { useState, useEffect } from "react";
import { FaList, FaTh, FaEnvelope } from "react-icons/fa";
import ReactQuill from 'react-quill';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import "./ResignationPage.css";

const ResignationPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchResignations();
  }, []);

  const fetchResignations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/resignations');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch resignations');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [newResignation, setNewResignation] = useState({
    name: "",
    email: "",
    title: "",
    status: "Requested",
    description: ""
  });

  const handleEditClick = (res) => {
    setShowCreatePopup(true);
    setIsEditing(true);
    setCurrentId(res._id);
    setNewResignation({
      name: res.name,
      email: res.email,
      title: res.position,
      status: res.status,
      description: res.description
    });
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/resignations/${id}`);
      await fetchResignations();
    } catch (error) {
      console.error('Error deleting resignation:', error);
      setError('Failed to delete resignation');
    }
  };

  const handleCreateClick = () => {
    setShowCreatePopup(true);
    setIsEditing(false);
    setNewResignation({
      name: "",
      email: "",
      title: "",
      status: "Requested",
      description: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResignation((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (content) => {
    setNewResignation((prev) => ({ ...prev, description: content }));
  };

  const handleSave = async () => {
    try {
      const resignationData = {
        name: newResignation.name,
        email: newResignation.email,
        position: newResignation.title,
        status: newResignation.status,
        description: newResignation.description
      };
  
      if (isEditing) {
        const response = await axios.put(`http://localhost:5000/api/resignations/${currentId}`, resignationData);
        setData(prevData => 
          prevData.map(item => 
            item._id === currentId ? response.data : item
          )
        );
      } else {
        const response = await axios.post('http://localhost:5000/api/resignations', resignationData);
        setData(prevData => [...prevData, response.data]);
      }
      
      handleClosePopup();
      setError(null);
    } catch (error) {
      console.error('Error saving resignation:', error);
      setError('Failed to save resignation');
    }
  };
  

  const handleClosePopup = () => {
    setShowCreatePopup(false);
    setIsEditing(false);
    setCurrentId(null);
    setNewResignation({
      name: "",
      email: "",
      title: "",
      status: "Requested",
      description: ""
    });
  };

  const handleSendEmail = async (employee) => {
    try {
      await axios.post('http://localhost:5000/api/resignations', {
        name: employee.name,
        email: employee.email,
        position: employee.position,
        status: employee.status,
        description: employee.description
      });
      alert(`Resignation email sent successfully from ${employee.email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      setError('Failed to send email');
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const applyFilter = (status) => {
    setSelectedStatus(status);
    setFilterOpen(false);
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus ? item.status === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link'],
      ['clean']
    ],
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="resignation-letters">
      <div className="header">
        <h1 className="header-title">Resignations</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <button className="view-toggle" onClick={() => handleViewChange("list")}>
            <FaList />
          </button>
          <button className="view-toggle" onClick={() => handleViewChange("grid")}>
            <FaTh />
          </button>
          <button className="filter-btn" onClick={toggleFilter}>
            Filter
          </button>
          <button className="create-btn" onClick={handleCreateClick}>
            Create
          </button>
        </div>
      </div>

      {filterOpen && (
        <div className="filter-popup">
          <button onClick={() => applyFilter("")} className={`filter-option ${selectedStatus === "" ? "active" : ""}`}>
            All
          </button>
          <button onClick={() => applyFilter("Approved")} className={`filter-option ${selectedStatus === "Approved" ? "active" : ""}`}>
            Approved
          </button>
          <button onClick={() => applyFilter("Requested")} className={`filter-option ${selectedStatus === "Requested" ? "active" : ""}`}>
            Requested
          </button>
          <button onClick={() => applyFilter("Rejected")} className={`filter-option ${selectedStatus === "Rejected" ? "active" : ""}`}>
            Rejected
          </button>
        </div>
      )}

      {showCreatePopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>{isEditing ? 'Edit Resignation' : 'Create Resignation'}</h3>
            <div className="form-row">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={newResignation.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={newResignation.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <label>Position</label>
              <input
                type="text"
                name="title"
                value={newResignation.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <label>Resignation Letter</label>
              <ReactQuill
                theme="snow"
                value={newResignation.description}
                onChange={handleDescriptionChange}
                modules={modules}
                placeholder="Write your resignation letter..."
              />
            </div>
            <div className="form-row">
              <label>Status</label>
              <select
                name="status"
                value={newResignation.status}
                onChange={handleInputChange}
              >
                <option value="Requested">Requested</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="popup-actions">
              <button type="button" onClick={handleSave}>
                {isEditing ? 'Update' : 'Save'}
              </button>
              <button type="button" onClick={handleClosePopup}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {viewMode === "list" ? (
        <table className="resignation-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.position}</td>
                <td>{item.status}</td>
                <td><div dangerouslySetInnerHTML={{ __html: item.description }} /></td>
                <td>
                  <button className="icon-button" onClick={() => handleEditClick(item)}>✏️</button>
                  <button className="icon-button" onClick={() => handleDeleteClick(item._id)}>🗑️</button>
                  <button className="email-btn" onClick={() => handleSendEmail(item)}>
                    <FaEnvelope />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="card-grid">
          {filteredData.map((item) => (
            <div key={item._id} className="resignation-card">
              <div className="card-header">
                <span className={`status ${item.status}`}>{item.status}</span>
                <div className="card-icons">
                  <button className="icon-button" onClick={() => handleEditClick(item)}>✏️</button>
                  <button className="icon-button" onClick={() => handleDeleteClick(item._id)}>🗑️</button>
                </div>
              </div>
              <div className="card-content">
                <h2>{item.name}</h2>
                <p className="email">{item.email}</p>
                <p>{item.position}</p>
                <div dangerouslySetInnerHTML={{ __html: item.description }} />
              </div>
              <div className="card-footer">
                <button className="email-btn" onClick={() => handleSendEmail(item)}>
                  <FaEnvelope /> Send Email
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResignationPage;

