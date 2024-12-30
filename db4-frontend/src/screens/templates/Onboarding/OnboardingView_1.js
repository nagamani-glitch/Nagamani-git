import React, { useState } from 'react';
import './OnboardingView.css';

function OnboardingView() {
  // Sample data for candidates
  const initialCandidates = [
    { id: 1, name: 'John Doe', email: 'john@example.com', jobPosition: 'Developer', mobile: '123-456-7890', joiningDate: '2024-01-01', portalStatus: 'Active', taskStatus: 'Pending', stage: 'Test' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', jobPosition: 'Designer', mobile: '987-654-3210', joiningDate: '2024-02-01', portalStatus: 'Active', taskStatus: 'Completed', stage: 'Interview' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', jobPosition: 'Product Manager', mobile: '555-123-4567', joiningDate: '2024-03-01', portalStatus: 'Inactive', taskStatus: 'Pending', stage: 'Test' },
    { id: 4, name: 'Bob Brown', email: 'bob@example.com', jobPosition: 'Developer', mobile: '444-555-6666', joiningDate: '2024-04-01', portalStatus: 'Active', taskStatus: 'Pending', stage: 'Offer' },
    { id: 5, name: 'Carol White', email: 'carol@example.com', jobPosition: 'QA Engineer', mobile: '222-333-4444', joiningDate: '2024-05-01', portalStatus: 'Active', taskStatus: 'Completed', stage: 'Test' },
  ];

  const [candidates, setCandidates] = useState(initialCandidates);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    jobPosition: '',
    mobile: '',
    joiningDate: '',
    stage: 'Test',
  });
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const itemsPerPage = 10;
  const uniqueStages = ['All', 'Test', 'Interview', 'Offer'];

  const filteredCandidates = candidates.filter((candidate) => {
    return (
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (stageFilter === 'All' || candidate.stage === stageFilter)
    );
  });

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
    setSelectedCandidates((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((candidateId) => candidateId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === paginatedCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(paginatedCandidates.map((candidate) => candidate.id));
    }
  };

  const handleCreateCandidate = (e) => {
    e.preventDefault();
    const newId = candidates.length + 1;
    const candidateWithId = { id: newId, ...newCandidate };
    setCandidates([...candidates, candidateWithId]);
    setNewCandidate({
      name: '',
      email: '',
      jobPosition: '',
      mobile: '',
      joiningDate: '',
      stage: 'Test',
    });
    setShowCreateForm(false);
  };

  const sendMailToCandidate = (email) => {
    alert(`Email sent to ${email}`);
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

          <select value={stageFilter} onChange={handleStageFilterChange} className="filter-select">
            {uniqueStages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>

          <button className="create-button" onClick={() => setShowCreateForm(!showCreateForm)}>
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
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
                <button type="submit" className="modal-btn">
                  Add Candidate
                </button>
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
                  checked={
                    selectedCandidates.length === paginatedCandidates.length &&
                    paginatedCandidates.length > 0
                  }
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
              <tr key={candidate.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCandidates.includes(candidate.id)}
                    onChange={() => toggleSelectCandidate(candidate.id)}
                  />
                </td>
                <td>{candidate.name}</td>
                <td>{candidate.email}</td>
                <td>{candidate.jobPosition}</td>
                <td>{candidate.mobile}</td>
                <td>{candidate.joiningDate}</td>
                <td>{candidate.stage}</td>
                <td>
                  <button onClick={() => sendMailToCandidate(candidate.email)} className="send-mail-btn">
                    Send Mail
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
