import React, { useState } from "react";
import { FaList, FaTh } from "react-icons/fa";
import "./ResignationPage.css";

const ResignationPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
 
  const [data, setData] = useState([
    {
      id: 1,
      name: "Priyanka Dutta",
      position: "S/W Dept / React Dev",
      status: "Approved",
      description: "Test",
    },
    {
      id: 2,
      name: "Amith Shetty",
      position: "React Dev",
      status: "Approved",
      description: "Resign letter",
    },
    {
      id: 3,
      name: "John Smith",
      position: "Software Engineer",
      status: "Requested",
      description: "Moving abroad",
    },
    {
      id: 4,
      name: "Jane Doe",
      position: "Frontend Dev",
      status: "Rejected",
      description: "Leaving soon",
    },
    {
      id: 5,
      name: "Alice Brown",
      position: "Designer",
      status: "Approved",
      description: "Personal reasons",
    },

    // Add more items as per your data
  ]);

  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [newResignation, setNewResignation] = useState({
    name: "",
    title: "",
    status: "Approved",
    description: "" //
  });


  //For edit-delete 

  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const handleEditClick = (res) => {
    setShowPopup(true);
    setIsEditing(true);
    setCurrentId(res.id);
    setNewResignation({ name: res.name, title: res.title, status: res.status });
  };

  const handleDeleteClick = (id) => {
    setData((prev) => prev.filter((res) => res.id !== id));
  };


  const handleCreateClick = () => {
    setShowCreatePopup(true);
    setIsEditing(false);
    setNewResignation({ name: "", title: "", status: "Approved" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResignation((prev) => ({ ...prev, [name]: value }));
  };


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };




  const handleSave = () => {
    if (isEditing) {
      setData((prev) =>
        prev.map((res) =>
          res.id === currentId
            ? { ...res, name: newResignation.name, position: newResignation.title, status: newResignation.status, description: newResignation.description }
            : res
        )
      );
    } else {
      setData((prev) => [
        ...prev,
        { id: prev.length + 1, name: newResignation.name, position: newResignation.title, status: newResignation.status, description: newResignation.descrip },
      ]);
    }
    setShowCreatePopup(false);
    setShowPopup(false);
    setNewResignation({ name: "", title: "", status: "Approved" });
  };


  
/* For filter data */
  const filteredData = data.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus
      ? item.status === selectedStatus
      : true;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="resignation-letters">
      <div className="header">
        <h1 className="header-title">Resignations</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <button
            className="view-toggle"
            onClick={() => handleViewChange("list")}
          >
            <FaList />
          </button>
          <button
            className="view-toggle"
            onClick={() => handleViewChange("grid")}
          >
            <FaTh />
          </button>

          <button className="filter-btn" onClick={toggleFilter}>
            Filter
          </button>
          <button className="create-btn" onClick={handleCreateClick}>
            {" "}
            Create
          </button>
        </div>
      </div>

      {/* Create Popup */}
      {showCreatePopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Create Resignation</h3>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newResignation.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newResignation.title}
              onChange={handleInputChange}
            />

<input
              type="text"
              name="description"
              placeholder="Description"
              value={newResignation.description}
              onChange={handleInputChange}
            />
            <select
              name="status"
              value={newResignation.status}
              onChange={handleInputChange}
            >
              <option value="Approved">Approved</option>
              <option value="Requested">Requested</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setShowCreatePopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* For Filter  data */}
      {filterOpen && (
        <div className="filter-popup">
          <button
            onClick={() => applyFilter("")}
            className={`filter-option ${selectedStatus === "" ? "active" : ""}`}
          >
            All
          </button>
          <button
            onClick={() => applyFilter("Approved")}
            className={`filter-option ${
              selectedStatus === "Approved" ? "active" : ""
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => applyFilter("Requested")}
            className={`filter-option ${
              selectedStatus === "Requested" ? "active" : ""
            }`}
          >
            Requested
          </button>
          <button
            onClick={() => applyFilter("Rejected")}
            className={`filter-option ${
              selectedStatus === "Rejected" ? "active" : ""
            }`}
          >
            Rejected
          </button>
        </div>
      )}


      {/* Popup for creating/editing a resignation */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>{isEditing ? 'Edit Resignation' : 'Create Resignation'}</h3>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newResignation.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newResignation.title}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newResignation.description}
              onChange={handleInputChange}
            />
            <select
              name="status"
              value={newResignation.status}
              onChange={handleInputChange}
            >
              <option value="Approved">Approved</option>
              <option value="Requested">Requested</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button onClick={handleSave}>{isEditing ? 'Update' : 'Save'}</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}


<div className={viewMode === "grid" ? "card-grid" : "card-list"}>
        {filteredData.map((item) => (
          <div key={item.id} className="resignation-card">
            <div className="card-header">
              <span className="status">{item.status}</span>
              <div className="card-icons">
                <button className="icon-button" onClick={() => handleEditClick(item)}>✏️</button>
                <button className="icon-button" onClick={() => handleDeleteClick(item.id)}>🗑️</button>
              </div>
            </div>
            <div className="card-content">
              <h2>{item.name}</h2>
              <p>{item.department}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <div className="card-footer">
              <button className="approve-btn">✔</button>
              <button className="reject-btn">✘</button>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default ResignationPage;
