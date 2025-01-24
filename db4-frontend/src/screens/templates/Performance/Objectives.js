import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Objectives.css";

const API_URL = "http://localhost:5000/api/objectives";

const Objectives = () => {
  const [objectives, setObjectives] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    managers: "",
    assignees: "",
    keyResults: "",
    duration: "",
    archived: "",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentObjective, setCurrentObjective] = useState(null);
  const [showArchivedTable, setShowArchivedTable] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadObjectives();
  }, [selectedTab, searchTerm]);

  const loadObjectives = async () => {
    try {
      const params = {
        searchTerm,
        objectiveType: selectedTab !== "all" ? selectedTab : undefined,
      };
      const response = await axios.get(API_URL, { params });
      setObjectives(response.data);
    } catch (error) {
      console.error("Error loading objectives:", error);
    }
  };

  const filteredObjectives = objectives.filter((obj) => {
    return (
      (selectedTab === "all" ? true : obj.objectiveType === selectedTab) &&
      (searchTerm === "" ||
        obj.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filter.managers === "" || obj.managers.toString() === filter.managers) &&
      (filter.assignees === "" ||
        obj.assignees.toString() === filter.assignees) &&
      (filter.keyResults === "" ||
        obj.keyResults.toString() === filter.keyResults) &&
      (filter.duration === "" || obj.duration.includes(filter.duration)) &&
      (filter.archived === "" || obj.archived.toString() === filter.archived)
    );
  });

  const handleFilterChange = (field, value) => {
    setFilter({ ...filter, [field]: value });
  };

  const applyFilter = () => {
    setIsFilterModalOpen(false);
  };

  const resetFilter = () => {
    setFilter({
      managers: "",
      assignees: "",
      keyResults: "",
      duration: "",
      archived: "",
    });
    setIsFilterModalOpen(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this objective?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setObjectives(objectives.filter((obj) => obj._id !== id));
      } catch (error) {
        console.error("Error deleting objective:", error);
      }
    }
  };

  // const handleArchive = async (id) => {
  //   try {
  //     const response = await axios.patch(`${API_URL}/${id}/archive`, {
  //       archived: true  // Explicitly send the archive status
  //     }, {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     setObjectives(objectives.map(obj =>
  //       obj._id === id ? response.data : obj
  //     ));

  //     if (!showArchivedTable) {
  //       setShowArchivedTable(true);
  //     }
  //   } catch (error) {
  //     console.error('Error archiving objective:', error);
  //   }
  // };

  const handleArchive = async (id) => {
    try {
      const response = await axios.patch(
        `${API_URL}/${id}/archive`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setObjectives((prevObjectives) =>
        prevObjectives.map((obj) => (obj._id === id ? response.data : obj))
      );
    } catch (error) {
      console.error("Error toggling archive status:", error);
    }
  };

  const handleAdd = () => {
    const newObjective = {
      title: "",
      managers: "",
      keyResults: "",
      assignees: "",
      duration: "0 Days",
      description: "",
      archived: false,
      objectiveType: "all",
    };
    setCurrentObjective(newObjective);
    setIsCreateModalOpen(true);
  };

  // const handleCreateSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post(API_URL, currentObjective);
  //     setObjectives([...objectives, response.data]);
  //     setIsCreateModalOpen(false);
  //     setCurrentObjective(null);
  //     setSelectedTab(response.data.objectiveType);
  //   } catch (error) {
  //     console.error('Error creating objective:', error);
  //   }
  // };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the data according to the schema
      const objectiveData = {
        title: currentObjective.title,
        managers: Number(currentObjective.managers) || 0,
        keyResults: Number(currentObjective.keyResults) || 0,
        assignees: Number(currentObjective.assignees) || 0,
        duration: currentObjective.duration,
        description: currentObjective.description,
        objectiveType: currentObjective.objectiveType || "all",
        archived: false,
      };

      const response = await axios.post(API_URL, objectiveData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setObjectives([...objectives, response.data]);
      setIsCreateModalOpen(false);
      setCurrentObjective(null);
      setSelectedTab(response.data.objectiveType);
    } catch (error) {
      console.error("Error creating objective:", error);
    }
  };

  const handleEdit = (objective) => {
    setCurrentObjective({ ...objective });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_URL}/${currentObjective._id}`,
        currentObjective
      );
      setObjectives(
        objectives.map((obj) =>
          obj._id === currentObjective._id ? response.data : obj
        )
      );
      setIsEditModalOpen(false);
      setCurrentObjective(null);
    } catch (error) {
      console.error("Error updating objective:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentObjective((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="objectives">
      <div className="header-row">
        <h2>Objectives</h2>
        <div className="obj-toolbar">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <button
            className="obj-filter-button"
            onClick={() => setIsFilterModalOpen(true)}
          >
            Filter
          </button>
          <button onClick={handleAdd} className="create-button">
            Create
          </button>
        </div>
      </div>

      {isCreateModalOpen && (
        <div className="filter-modal">
          <div className="filter-modal-content">
            <h3 className="create-objective-heading">Create New Objective</h3>
            <hr />
            <form onSubmit={handleCreateSubmit}>
              <div className="group">
                <label>
                  Title:
                  <input
                    type="text"
                    name="title"
                    value={currentObjective.title}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Duration:
                  <input
                    type="text"
                    name="duration"
                    value={currentObjective.duration}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>

              <div className="group">
                <label>
                  Managers:
                  <input
                    type="text"
                    name="managers"
                    value={currentObjective.managers}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Key Results:
                  <input
                    type="text"
                    name="keyResults"
                    value={currentObjective.keyResults}
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              <div className="group">
                <label>
                  Objective Type:
                  <select
                    name="objectiveType"
                    value={currentObjective.objectiveType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="self">Self Objective</option>
                    <option value="all">All Objective</option>
                  </select>
                </label>
              </div>

              <div className="group">
                <label>
                  Description:
                  <textarea
                    name="description"
                    value={currentObjective.description}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit">Create</button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="filter-modal">
          <div className="filter-modal-content">
            <h3>Edit Objective</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="group">
                <label>
                  Title:
                  <input
                    type="text"
                    name="title"
                    value={currentObjective.title}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Duration:
                  <input
                    type="text"
                    name="duration"
                    value={currentObjective.duration}
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              <div className="group">
                <label>
                  Managers:
                  <input
                    type="text"
                    name="managers"
                    value={currentObjective.managers}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Key Results:
                  <input
                    type="text"
                    name="keyResults"
                    value={currentObjective.keyResults}
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              <div className="group">
                <label>
                  Objective Type:
                  <select
                    name="objectiveType"
                    value={currentObjective.objectiveType}
                    onChange={handleInputChange}
                  >
                    <option value="self">Self Objective</option>
                    <option value="all">All Objective</option>
                  </select>
                </label>
              </div>

              <div className="group">
                <label>
                  Description:
                  <textarea
                    name="description"
                    value={currentObjective.description}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="tabs">
        <button
          className={selectedTab === "self" ? "active" : ""}
          onClick={() => setSelectedTab("self")}
        >
          Self Objective
        </button>
        <button
          className={selectedTab === "all" ? "active" : ""}
          onClick={() => setSelectedTab("all")}
        >
          All Objective
        </button>
        <button onClick={() => setShowArchivedTable(!showArchivedTable)}>
          {showArchivedTable ? "Hide Archived" : "Show Archived"}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Managers</th>
            <th>Key Results</th>
            <th>Assignees</th>
            <th>Duration</th>
            <th>Description</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredObjectives
            .filter((obj) => !obj.archived)
            .map((obj) => (
              <tr key={obj._id}>
                <td>{obj.title}</td>
                <td>{obj.managers} Managers</td>
                <td>{obj.keyResults} Key results</td>
                <td>{obj.assignees} Assignees</td>
                <td>{obj.duration}</td>
                <td>{obj.description}</td>
                <td>{obj.objectiveType}</td>
                <td>
                  <button onClick={() => handleEdit(obj)}>✎</button>
                  <button onClick={() => handleArchive(obj._id)}>📥</button>
                  <button onClick={() => handleDelete(obj._id)}>🗑️</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* {showArchivedTable && (
        <div className="archived-objectives">
          <h3>Archived Objectives</h3>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Managers</th>
                <th>Key Results</th>
                <th>Assignees</th>
                <th>Duration</th>
                <th>Description</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {objectives.filter(obj => obj.archived).map(obj => (
                <tr key={obj.id}>
                  <td>{obj.title}</td>
                  <td>{obj.managers} Managers</td>
                  <td>{obj.keyResults} Key results</td>
                  <td>{obj.assignees} Assignees</td>
                  <td>{obj.duration}</td>
                  <td>{obj.description}</td>
                  <td>{obj.objectiveType}</td>
                  <td>
                    <button onClick={() => handleArchive(obj.id)}>🔄</button>
                    <button onClick={() => handleDelete(obj.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )} */}

      {showArchivedTable && (
        <div className="archived-objectives">
          <h3>Archived Objectives</h3>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Managers</th>
                <th>Key Results</th>
                <th>Assignees</th>
                <th>Duration</th>
                <th>Description</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {objectives
                .filter((obj) => obj.archived)
                .map((obj) => (
                  <tr key={obj._id}>
                    <td>{obj.title}</td>
                    <td>{obj.managers} Managers</td>
                    <td>{obj.keyResults} Key results</td>
                    <td>{obj.assignees} Assignees</td>
                    <td>{obj.duration}</td>
                    <td>{obj.description}</td>
                    <td>{obj.objectiveType}</td>
                    <td>
                      <button onClick={() => handleArchive(obj._id)}>🔄</button>
                      <button onClick={() => handleDelete(obj._id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {isFilterModalOpen && (
        <div className="filter-modal">
          <div className="filter-modal-content">
            <h3>Filter Objectives</h3>
            <div className="group">
              <label>
                Managers:
                <input
                  type="text"
                  value={filter.managers}
                  onChange={(e) =>
                    handleFilterChange("managers", e.target.value)
                  }
                />
              </label>
              <label>
                Assignees:
                <input
                  type="text"
                  value={filter.assignees}
                  onChange={(e) =>
                    handleFilterChange("assignees", e.target.value)
                  }
                />
              </label>
            </div>
            <div className="group">
              <label>
                Key Results:
                <input
                  type="number"
                  value={filter.keyResults}
                  onChange={(e) =>
                    handleFilterChange("keyResults", e.target.value)
                  }
                />
              </label>
              <label>
                Duration:
                <input
                  type="text"
                  value={filter.duration}
                  onChange={(e) =>
                    handleFilterChange("duration", e.target.value)
                  }
                />
              </label>
            </div>
            <label>
              Archived:
              <select
                value={filter.archived}
                onChange={(e) => handleFilterChange("archived", e.target.value)}
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <div style={{ display: "flex", marginRight: "20px" }}>
              <button onClick={applyFilter}>Apply</button>
              <button onClick={resetFilter}>Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Objectives;
