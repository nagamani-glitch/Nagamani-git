import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OnboardingView.css';

function OnboardingView() {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    jobPosition: '',
    mobile: '',
    joiningDate: '',
    stage: 'Test',
    portalStatus: 'Active',
    taskStatus: 'Pending'
  });

  const itemsPerPage = 10;
  const uniqueStages = ['All', 'Test', 'Interview', 'Offer'];

  // Fetch candidates on component mount and when filter changes
  useEffect(() => {
    fetchCandidates();
  }, [stageFilter]);

  const fetchCandidates = async () => {
    try {
      const url = stageFilter === 'All' 
        ? 'http://localhost:5000/api/onboarding'
        : `http://localhost:5000/api/onboarding/filter?stage=${stageFilter}`;
      const response = await axios.get(url);
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const handleCreateCandidate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/onboarding', newCandidate);
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
    } catch (error) {
      console.error('Error creating candidate:', error);
    }
  };

  const handleUpdateCandidate = async (id, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/onboarding/${id}`, updatedData);
      setCandidates(candidates.map(candidate => 
        candidate._id === id ? response.data : candidate
      ));
    } catch (error) {
      console.error('Error updating candidate:', error);
    }
  };

  const handleDeleteCandidate = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/onboarding/${id}`);
      setCandidates(candidates.filter(candidate => candidate._id !== id));
    } catch (error) {
      console.error('Error deleting candidate:', error);
    }
  };

  const sendMailToCandidate = async (candidate) => {
    try {
      await axios.post('http://localhost:5000/api/onboarding/send-email', {
        email: candidate.email,
        name: candidate.name,
        jobPosition: candidate.jobPosition,
        joiningDate: candidate.joiningDate
      });
      alert('Onboarding email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    }
  };
  

  const filteredCandidates = candidates.filter((candidate) => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleStageFilterChange = (event) => {
    setStageFilter(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleSelectCandidate = (id) => {
    setSelectedCandidates(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(candidateId => candidateId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedCandidates(
      selectedCandidates.length === paginatedCandidates.length
        ? []
        : paginatedCandidates.map(candidate => candidate._id)
    );
  };

  return (
    <div className="onboarding-view">
      <h1 className="page-title">Onboarding</h1>
      <div className="content">
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />

          <select 
            value={stageFilter} 
            onChange={handleStageFilterChange} 
            className="filter-select"
          >
            {uniqueStages.map((stage) => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>

          <button 
            className="create-button" 
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            + Create
          </button>
        </div>

        {showCreateForm && (
          <div className="modal">
            <div className="modal-content">
              <form onSubmit={handleCreateCandidate}>
                <input
                  type="text"
                  placeholder="Name"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  required
                  className="modal-input"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newCandidate.email}
                  onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                  required
                  className="modal-input"
                />
                <input
                  type="text"
                  placeholder="Job Position"
                  value={newCandidate.jobPosition}
                  onChange={(e) => setNewCandidate({ ...newCandidate, jobPosition: e.target.value })}
                  required
                  className="modal-input"
                />
                <input
                  type="tel"
                  placeholder="Mobile"
                  value={newCandidate.mobile}
                  onChange={(e) => setNewCandidate({ ...newCandidate, mobile: e.target.value })}
                  required
                  className="modal-input"
                />
                <input
                  type="date"
                  placeholder="Joining Date"
                  value={newCandidate.joiningDate}
                  onChange={(e) => setNewCandidate({ ...newCandidate, joiningDate: e.target.value })}
                  required
                  className="modal-input"
                />
                <select
                  value={newCandidate.stage}
                  onChange={(e) => setNewCandidate({ ...newCandidate, stage: e.target.value })}
                  required
                  className="modal-input"
                >
                  {uniqueStages.slice(1).map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
                <button type="submit" className="modal-btn">Add Candidate</button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="modal-btn cancel"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        <table className="candidate-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedCandidates.length === paginatedCandidates.length && paginatedCandidates.length > 0}
                />
              </th>
              <th>Candidate</th>
              <th>Email</th>
              <th>Job Position</th>
              <th>Mobile</th>
              <th>Joining Date</th>
              <th>Stage</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCandidates.map((candidate) => (
              <tr key={candidate._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCandidates.includes(candidate._id)}
                    onChange={() => toggleSelectCandidate(candidate._id)}
                  />
                </td>
                <td>{candidate.name}</td>
                <td>{candidate.email}</td>
                <td>{candidate.jobPosition}</td>
                <td>{candidate.mobile}</td>
                <td>{new Date(candidate.joiningDate).toLocaleDateString()}</td>
                <td>{candidate.stage}</td>
                <td>
                <button 
                  onClick={() => sendMailToCandidate(candidate)} 
                  className="send-mail-btn"
               >
                   Send Mail
                </button>

                  <button 
                    onClick={() => handleDeleteCandidate(candidate._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-text">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingView;
