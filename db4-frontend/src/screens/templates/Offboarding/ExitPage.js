import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExitPage.css";

const ExitPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  
  const [offboardingStages, setOffboardingStages] = useState([
    { stageName: "Notice Period", employees: [], expanded: false },
    { stageName: "Exit Interview", employees: [], expanded: false },
    { stageName: "Work Handover", employees: [], expanded: false },
  ]);

  const [newData, setNewData] = useState({
    employeeName: "",
    noticePeriod: "",
    startDate: "",
    endDate: "",
    stage: "Notice Period",
    taskStatus: "0/0",
    description: "",
    manager: "",
    interviewDate: "",
    interviewer: "",
    feedback: "",
    handoverTo: "",
    projectDocuments: "",
    pendingTasks: ""
  });

  const fetchOffboardings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/offboarding');
      const offboardings = response.data;
      const updatedStages = offboardingStages.map(stage => ({
        ...stage,
        employees: offboardings.filter(emp => emp.stage === stage.stageName)
      }));
      setOffboardingStages(updatedStages);
    } catch (error) {
      console.error('Error fetching offboardings:', error);
    }
  };

  useEffect(() => {
    fetchOffboardings();
  }, []);

  const handleEditClick = (employee) => {
    setEditMode(true);
    setEditData(employee);
    setCreateOpen(true);
  };

  const handleCreate = async () => {
    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/offboarding/${editData._id}`, editData);
      } else {
        await axios.post('http://localhost:5000/api/offboarding', newData);
      }
      await fetchOffboardings();
      setCreateOpen(false);
      setEditMode(false);
      setEditData(null);
      setNewData({
        employeeName: "",
        noticePeriod: "",
        startDate: "",
        endDate: "",
        stage: "Notice Period",
        taskStatus: "0/0",
        description: "",
        manager: "",
        interviewDate: "",
        interviewer: "",
        feedback: "",
        handoverTo: "",
        projectDocuments: "",
        pendingTasks: ""
      });
    } catch (error) {
      console.error('Error saving offboarding:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/offboarding/${id}`);
      await fetchOffboardings();
    } catch (error) {
      console.error('Error deleting offboarding:', error);
    }
  };

  const handleExpand = (index) => {
    setOffboardingStages(prev =>
      prev.map((stage, i) =>
        i === index ? { ...stage, expanded: !stage.expanded } : stage
      )
    );
  };

  const filteredStages = offboardingStages.map(stage => ({
    ...stage,
    employees: stage.employees.filter(emp =>
      emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));

  return (
    <div className="home-page">
      <div className="top-bar">
        <h2>Offboarding</h2>
        <div className="controls">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={() => {
            setCreateOpen(true);
            setEditMode(false);
            setEditData(null);
          }} className="create-btn">
            Create
          </button>
        </div>
      </div>

      {createOpen && (
        <>
          <div className="exit-popup-overlay">
            <div className="exit-create-popup">
              <h3>{editMode ? 'Edit Offboarding' : 'New Offboarding'}</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
              }}>
                <div className="form-row">
                  <label>Employee Name</label>
                  <input
                    type="text"
                    value={editMode ? editData.employeeName : newData.employeeName}
                    onChange={(e) => editMode 
                      ? setEditData({...editData, employeeName: e.target.value})
                      : setNewData({...newData, employeeName: e.target.value})
                    }
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Stage</label>
                  <select 
                    value={editMode ? editData.stage : newData.stage}
                    onChange={(e) => editMode
                      ? setEditData({...editData, stage: e.target.value})
                      : setNewData({...newData, stage: e.target.value})
                    }
                    required
                  >
                    <option value="Notice Period">Notice Period</option>
                    <option value="Exit Interview">Exit Interview</option>
                    <option value="Work Handover">Work Handover</option>
                  </select>
                </div>

                {(editMode ? editData.stage : newData.stage) === "Notice Period" && (
                  <>
                    <div className="form-row">
                      <label>Notice Period Duration</label>
                      <input
                        type="text"
                        value={editMode ? editData.noticePeriod : newData.noticePeriod}
                        onChange={(e) => editMode
                          ? setEditData({...editData, noticePeriod: e.target.value})
                          : setNewData({...newData, noticePeriod: e.target.value})
                        }
                        required
                      />
                    </div>
                    <div className="form-row">
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={editMode ? editData.startDate?.split('T')[0] : newData.startDate}
                        onChange={(e) => editMode
                          ? setEditData({...editData, startDate: e.target.value})
                          : setNewData({...newData, startDate: e.target.value})
                        }
                        required
                      />
                    </div>
                    <div className="form-row">
                      <label>End Date</label>
                      <input
                        type="date"
                        value={editMode ? editData.endDate?.split('T')[0] : newData.endDate}
                        onChange={(e) => editMode
                          ? setEditData({...editData, endDate: e.target.value})
                          : setNewData({...newData, endDate: e.target.value})
                        }
                        required
                      />
                    </div>
                  </>
                )}

                {(editMode ? editData.stage : newData.stage) === "Exit Interview" && (
                  <>
                    <div className="form-row">
                      <label>Interview Date</label>
                      <input
                        type="date"
                        value={editMode ? editData.interviewDate?.split('T')[0] : newData.interviewDate}
                        onChange={(e) => editMode
                          ? setEditData({...editData, interviewDate: e.target.value})
                          : setNewData({...newData, interviewDate: e.target.value})
                        }
                        required
                      />
                    </div>
                    <div className="form-row">
                      <label>Interviewer</label>
                      <input
                        type="text"
                        value={editMode ? editData.interviewer : newData.interviewer}
                        onChange={(e) => editMode
                          ? setEditData({...editData, interviewer: e.target.value})
                          : setNewData({...newData, interviewer: e.target.value})
                        }
                        required
                      />
                    </div>
                    <div className="form-row">
                      <label>Feedback</label>
                      <textarea
                        value={editMode ? editData.feedback : newData.feedback}
                        onChange={(e) => editMode
                          ? setEditData({...editData, feedback: e.target.value})
                          : setNewData({...newData, feedback: e.target.value})
                        }
                      />
                    </div>
                  </>
                )}

                {(editMode ? editData.stage : newData.stage) === "Work Handover" && (
                  <>
                    <div className="form-row">
                      <label>Handover To</label>
                      <input
                        type="text"
                        value={editMode ? editData.handoverTo : newData.handoverTo}
                        onChange={(e) => editMode
                          ? setEditData({...editData, handoverTo: e.target.value})
                          : setNewData({...newData, handoverTo: e.target.value})
                        }
                        required
                      />
                    </div>
                    <div className="form-row">
                      <label>Project Documents</label>
                      <textarea
                        value={editMode ? editData.projectDocuments : newData.projectDocuments}
                        onChange={(e) => editMode
                          ? setEditData({...editData, projectDocuments: e.target.value})
                          : setNewData({...newData, projectDocuments: e.target.value})
                        }
                        required
                      />
                    </div>
                    <div className="form-row">
                      <label>Pending Tasks</label>
                      <textarea
                        value={editMode ? editData.pendingTasks : newData.pendingTasks}
                        onChange={(e) => editMode
                          ? setEditData({...editData, pendingTasks: e.target.value})
                          : setNewData({...newData, pendingTasks: e.target.value})
                        }
                        required
                      />
                    </div>
                  </>
                )}

                <div className="form-row">
                  <label>Manager</label>
                  <input
                    type="text"
                    value={editMode ? editData.manager : newData.manager}
                    onChange={(e) => editMode
                      ? setEditData({...editData, manager: e.target.value})
                      : setNewData({...newData, manager: e.target.value})
                    }
                    required
                  />
                </div>

                <div className="form-row">
                  <label>Additional Notes</label>
                  <textarea
                    value={editMode ? editData.description : newData.description}
                    onChange={(e) => editMode
                      ? setEditData({...editData, description: e.target.value})
                      : setNewData({...newData, description: e.target.value})
                    }
                  />
                </div>

                <div className="form-actions">

                  <button type="submit" className="exit-save-button">
                    {editMode ? 'Update' : 'Save'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setCreateOpen(false);
                      setEditMode(false);
                      setEditData(null);
                    }} 
                    className="exit-cancel-button"
                  >
                    Cancel
                  </button>
                </div>


              </form>
            </div>
          </div>
        </>
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
                        <th>Task Status</th>
                        <th>Manager</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stage.employees.map((emp) => (
                        <tr key={emp._id}>
                          <td>{emp.employeeName}</td>
                          <td>{emp.noticePeriod}</td>
                          <td>{new Date(emp.startDate).toLocaleDateString()}</td>
                          <td>{new Date(emp.endDate).toLocaleDateString()}</td>
                          <td>{emp.taskStatus}</td>
                          <td>{emp.manager}</td>
                          <td>
                            <button onClick={() => handleEditClick(emp)}>✏️</button>
                            <button onClick={() => handleDelete(emp._id)}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No employees in this stage.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExitPage;
