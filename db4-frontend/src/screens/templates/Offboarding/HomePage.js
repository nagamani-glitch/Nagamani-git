import React, { useState } from "react";
import "./HomePage.css";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);


  // Filter state for various criteria
  const [stageFilter, setStageFilter] = useState("");
  const [noticePeriodFilter, setNoticePeriodFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [taskStatusFilter, setTaskStatusFilter] = useState("");


  const [offboardingStages, setOffboardingStages] = useState([
    {
      stageName: "Notice Period",
      employees: [
        {
          id: 1,
          employeeName: "Aria Powell",
          noticePeriod: "1 month, 4 weeks",
          startDate: "13/11/2024",
          endDate: "12/01/2025",
          stage: "Notice Period",
          taskStatus: "0/0",
        },
      ],
      expanded: false,
    },
    {
      stageName: "Exit Interview",
      employees: [
        {
          id: 2,
          employeeName: "Neeraj Kumar",
          noticePeriod: "1 month, 0 weeks",
          startDate: "15/11/2024",
          endDate: "15/01/2025",
          stage: "Notice Period",
          taskStatus: "2/5",
        },
      ],
      expanded: false,
    },
    {
      stageName: "Work Handover",
      employees: [],
      expanded: false,
    },
  ]);
  const [newData, setNewData] = useState({
    title: "",
    description: "",
    manager: "",
    status: "",
  });
  const [editData, setEditData] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCreate = () => {
    setCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setCreateOpen(false);
  };

  const handleSave = () => {
    setOffboardingStages([
      ...offboardingStages,
      {
        stageName: newData.title,
        employees: [
          {
            id: Date.now(),
            employeeName: newData.manager,
            noticePeriod: "4 weeks, 1 day",
            startDate: "13/11/2024",
            endDate: "13/12/2024",
            stage: newData.status,
            taskStatus: "0/0",
          },
        ],
        expanded: false,
      },
    ]);
    setCreateOpen(false);
  };

  const handleExpand = (index) => {
    setOffboardingStages((prev) =>
      prev.map((stage, i) =>
        i === index ? { ...stage, expanded: !stage.expanded } : stage
      )
    );
  };

  const handleEdit = (stageIndex, employeeId) => {
    setOffboardingStages((prev) =>
      prev.map((stage, i) =>
        i === stageIndex
          ? {
              ...stage,
              employees: stage.employees.map((emp) =>
                emp.id === employeeId
                  ? { ...emp, isEditing: !emp.isEditing }
                  : emp
              ),
            }
          : stage
      )
    );
  };

  const handleDelete = (stageIndex, employeeId) => {
    setOffboardingStages((prev) =>
      prev.map((stage, i) =>
        i === stageIndex
          ? {
              ...stage,
              employees: stage.employees.filter((emp) => emp.id !== employeeId),
            }
          : stage
      )
    );
  };

  const handleSaveEdit = (stageIndex, employeeId, updatedEmployee) => {
    setOffboardingStages((prev) =>
      prev.map((stage, i) =>
        i === stageIndex
          ? {
              ...stage,
              employees: stage.employees.map((emp) =>
                emp.id === employeeId
                  ? { ...updatedEmployee, isEditing: false }
                  : emp
              ),
            }
          : stage
      )
    );
  };

  const handleInputChange = (e, stageIndex, employeeId) => {
    const { name, value } = e.target;
    setOffboardingStages((prev) =>
      prev.map((stage, i) =>
        i === stageIndex
          ? {
              ...stage,
              employees: stage.employees.map((emp) =>
                emp.id === employeeId ? { ...emp, [name]: value } : emp
              ),
            }
          : stage
      )
    );
  };


// Helper function to highlight matched search term in text
const highlightText = (text, searchTerm) => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.split(regex).map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <span key={index} className="highlight">
        {part}
      </span>
    ) : (
      part
    )
  );
};

{/*
// Filter offboarding stages and employees based on the search term
const filteredStages = offboardingStages
  .map((stage) => ({
    ...stage,
    employees: stage.employees.filter((emp) =>
      emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }))
  .filter(
    (stage) =>
      stage.stageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stage.employees.length > 0
  );

*/}



  // Apply filters to offboarding stages and employees based on search term and filter criteria
  const filteredStages = offboardingStages
    .map((stage) => ({
      ...stage,
      employees: stage.employees.filter((emp) => {
        const matchesSearchTerm =
          emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStage = stageFilter
          ? emp.stage.toLowerCase() === stageFilter.toLowerCase()
          : true;
        const matchesNoticePeriod = noticePeriodFilter
          ? emp.noticePeriod.toLowerCase() === noticePeriodFilter.toLowerCase()
          : true;
        const matchesStartDate = startDateFilter
          ? emp.startDate === startDateFilter
          : true;
        const matchesEndDate = endDateFilter ? emp.endDate === endDateFilter : true;
        const matchesTaskStatus = taskStatusFilter
          ? emp.taskStatus === taskStatusFilter
          : true;

        // Return true only if all filters match
        return (
          matchesSearchTerm &&
          matchesStage &&
          matchesNoticePeriod &&
          matchesStartDate &&
          matchesEndDate &&
          matchesTaskStatus
        );
      }),
    }))
    .filter(
      (stage) =>
        stage.stageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stage.employees.length > 0
    );

  return (
    <div className="home-page">  
      <div className="top-bar">
      <h2>Offboarding</h2>
      <div className="controls">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="filter-btn"
        >
          Filter
        </button>
        <button onClick={handleCreate} className="create-btn">
           Create
        </button>
        </div>
      </div>

    {/* Filter Popup */}
    {filterOpen && (
        <div className="filter-popup">
          <h4>Filter Options</h4>
          <div className="filter-option">
            <label>Stage:</label>
            <input
              type="text"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              placeholder="e.g., Notice Period"
            />
          </div>
          <div className="filter-option">
            <label>Notice Period:</label>
            <input
              type="text"
              value={noticePeriodFilter}
              onChange={(e) => setNoticePeriodFilter(e.target.value)}
              placeholder="e.g., 1 month"
            />
          </div>
          <div className="filter-option">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
            />
          </div>
          <div className="filter-option">
            <label>End Date:</label>
            <input
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
            />
          </div>
          <div className="filter-option">
            <label>Task Status:</label>
            <input
              type="text"
              value={taskStatusFilter}
              onChange={(e) => setTaskStatusFilter(e.target.value)}
              placeholder="e.g., 0/0"
            />
          </div>
          <button onClick={() => setFilterOpen(false)} className="apply-filter-btn">
            Apply Filters
          </button>
        </div>
      )}

      {createOpen && (
        <div className="create-popup">
          <h3>Offboarding</h3>
          <form>
            <div className="form-row">
              <label>
                Title <span className="required">*</span>
              </label>
              <input
                type="text"
                value={newData.title}
                onChange={(e) =>
                  setNewData({ ...newData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="form-row">
              <label>
                Description <span className="required">*</span>
              </label>
              <textarea
                value={newData.description}
                onChange={(e) =>
                  setNewData({ ...newData, description: e.target.value })
                }
                required
              />
            </div>
            <div className="form-row">
              <label>
                Manager <span className="required">*</span>
              </label>
              <input
                type="text"
                value={newData.manager}
                onChange={(e) =>
                  setNewData({ ...newData, manager: e.target.value })
                }
                required
              />
            </div>
            <div className="form-row">
              <label>
                Status <span className="required">*</span>
              </label>
              <input
                type="text"
                value={newData.status}
                onChange={(e) =>
                  setNewData({ ...newData, status: e.target.value })
                }
                required
              />
            </div>
            <button type="button" onClick={handleSave} className="create-popup-button">
              Save
            </button>
            <button type="button" onClick={handleCloseCreate} className="create-popup-button">
              Cancel
            </button>
          </form>
        </div>
      )}

      {editOpen && (
        <div className="edit-popup">
          <h3>Edit Offboarding</h3>
          <form>
            <div className="form-row">
              <label>Employee Name</label>
              <input
                type="text"
                value={editData.employeeName}
                onChange={(e) =>
                  setEditData({ ...editData, employeeName: e.target.value })
                }
              />
            </div>
            <div className="form-row">
              <label>Stage</label>
              <input
                type="text"
                value={editData.stage}
                onChange={(e) =>
                  setEditData({ ...editData, stage: e.target.value })
                }
              />
            </div>
            <button type="button" onClick={handleSaveEdit}>
              Save
            </button>
            <button type="button" onClick={() => setEditOpen(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="offboarding-list">
        {filteredStages.map((stage, index) => (
          <div key={index} className="stage-item">
            <div className="stage-header" onClick={() => handleExpand(index)}>
              <span>{stage.stageName}</span>
              <button>{stage.expanded ? "-" : "+"}</button>
            </div>
            {stage.expanded && (
              <div className="stage-content">
                {stage.employees.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Notice Period</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Stage</th>
                        <th>Task Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stage.employees.map((emp) => (
                        <tr key={emp.id}>
                          {emp.isEditing ? (
                            <>
                              <td>
                                <input
                                  type="text"
                                  name="employeeName"
                                  value={emp.employeeName}
                                  onChange={(e) =>
                                    handleInputChange(e, index, emp.id)
                                  }
                                  className="edit-input"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="noticePeriod"
                                  value={emp.noticePeriod}
                                  onChange={(e) =>
                                    handleInputChange(e, index, emp.id)
                                  }
                                  className="edit-input"
                                />
                              </td>
                              <td>
                                <input
                                  type="date"
                                  name="startDate"
                                  value={emp.startDate}
                                  onChange={(e) =>
                                    handleInputChange(e, index, emp.id)
                                  }
                                  className="edit-input"
                                />
                              </td>
                              <td>
                                <input
                                  type="date"
                                  name="endDate"
                                  value={emp.endDate}
                                  onChange={(e) =>
                                    handleInputChange(e, index, emp.id)
                                  }
                                  className="edit-input"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="stage"
                                  value={emp.stage}
                                  onChange={(e) =>
                                    handleInputChange(e, index, emp.id)
                                  }
                                  className="edit-input"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="taskStatus"
                                  value={emp.taskStatus}
                                  onChange={(e) =>
                                    handleInputChange(e, index, emp.id)
                                  }
                                  className="edit-input"
                                />
                              </td>
                              <td>
                                <button
                                  onClick={() =>
                                    handleSaveEdit(index, emp.id, emp)
                                  }
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => handleEdit(index, emp.id)}
                                >
                                  Cancel
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td>{emp.employeeName}</td>
                              <td>{emp.noticePeriod}</td>
                              <td>{emp.startDate}</td>
                              <td>{emp.endDate}</td>
                              <td>{emp.stage}</td>
                              <td>{emp.taskStatus}</td>
                              <td>
                                <button
                                  onClick={() => handleEdit(index, emp.id)}
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDelete(index, emp.id)}
                                >
                                  🗑️
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No data available.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
