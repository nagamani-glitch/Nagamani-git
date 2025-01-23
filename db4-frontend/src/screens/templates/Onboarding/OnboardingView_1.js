import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OnboardingView.css";

function OnboardingView() {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    jobPosition: "",
    mobile: "",
    joiningDate: "",
    stage: "Test",
    portalStatus: "Active",
    taskStatus: "Pending",
  });

  const uniqueStages = ["All", "Test", "Interview", "Offer"];

  useEffect(() => {
    fetchCandidates();
  }, [stageFilter]);

  const fetchCandidates = async () => {
    try {
      const url =
        stageFilter === "All"
          ? "http://localhost:5000/api/onboarding"
          : `http://localhost:5000/api/onboarding/filter?stage=${stageFilter}`;
      const response = await axios.get(url);
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const handleCreateCandidate = async (e) => {
    e.preventDefault();
  
    // Format the data before sending
    const candidateData = {
      ...newCandidate,
      joiningDate: new Date(newCandidate.joiningDate).toISOString()
    };

    try {
      const response = await axios.post('http://localhost:5000/api/onboarding', candidateData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        setCandidates([...candidates, response.data]);
        setNewCandidate({
          name: '',
          email: '',
          jobPosition: '',
          mobile: '',
          joiningDate: '',
          stage: 'Test',
          portalStatus: 'Active',
          taskStatus: 'Pending'
        });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.log('Server Response:', error.response?.data);
      alert(`Unable to create candidate. ${error.response?.data?.message || 'Please try again.'}`);
    }
  };

  const handleDeleteCandidate = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/onboarding/${id}`);
      setCandidates(candidates.filter((candidate) => candidate._id !== id));
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  const sendMailToCandidate = async (candidate) => {
    try {
      await axios.post("http://localhost:5000/api/onboarding/send-email", {
        email: candidate.email,
        name: candidate.name,
        jobPosition: candidate.jobPosition,
        joiningDate: candidate.joiningDate,
      });
      alert("Onboarding email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    }
  };

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <h1>Onboarding Dashboard</h1>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="stage-select"
          >
            {uniqueStages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
          <button
            className="add-candidate-btn"
            onClick={() => setShowCreateForm(true)}
          >
            Add New Candidate
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Candidate</h2>
            <form onSubmit={handleCreateCandidate} className="candidate-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newCandidate.name}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newCandidate.email}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Job Position"
                  value={newCandidate.jobPosition}
                  onChange={(e) =>
                    setNewCandidate({
                      ...newCandidate,
                      jobPosition: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={newCandidate.mobile}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, mobile: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="date"
                  value={newCandidate.joiningDate}
                  onChange={(e) =>
                    setNewCandidate({
                      ...newCandidate,
                      joiningDate: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Add Candidate
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="candidates-table-container">
        <table className="candidates-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Mobile</th>
              <th>Joining Date</th>
              <th>Stage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((candidate) => (
              <tr key={candidate._id}>
                <td>{candidate.name}</td>
                <td>{candidate.email}</td>
                <td>{candidate.jobPosition}</td>
                <td>{candidate.mobile}</td>
                <td>{new Date(candidate.joiningDate).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`stage-badge ${candidate.stage.toLowerCase()}`}
                  >
                    {candidate.stage}
                  </span>
                </td>
                {/* <td className="action-buttons">
                  <button onClick={() => sendMailToCandidate(candidate)} className="mail-btn">
                    Send Email
                  </button>
                  <button onClick={() => handleDeleteCandidate(candidate._id)} className="delete-btn">
                    Delete
                  </button>
                </td> */}
                <td className="action-cell">
                  <div className="action-buttons-wrapper">
                    <button
                      onClick={() => sendMailToCandidate(candidate)}
                      className="action-btn mail-btn"
                    >
                      <i className="fas fa-envelope" size={18}></i>
                    </button>
                    <button
                      onClick={() => handleDeleteCandidate(candidate._id)}
                      className="action-btn onboarding-delete-btn"
                    >
                      <i className="fas fa-trash " size={18}></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OnboardingView;
