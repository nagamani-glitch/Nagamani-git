import React, { useState } from 'react';
import './CandidateView.css'; // Import the CSS file
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField
} from '@mui/material';

const CandidatesView = () => {
    const [candidates, setCandidates] = useState([
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            joiningDate: '2024-01-10',
            probationEnds: '2024-04-10',
            jobPosition: 'Software Engineer',
            recruitment: 'Recruiter A',
            selected: false
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            joiningDate: '2024-01-15',
            probationEnds: '2024-04-15',
            jobPosition: 'Product Manager',
            recruitment: 'Recruiter B',
            selected: false
        },
        // Add more sample candidates as needed
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [open, setOpen] = useState(false);
    const [newCandidate, setNewCandidate] = useState({
        name: '',
        email: '',
        joiningDate: '',
        probationEnds: '',
        jobPosition: '',
        recruitment: ''
    });

    const filteredCandidates = candidates.filter(candidate => {
        return (
            candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filter === 'All' || candidate.portalStatus === filter)
        );
    });

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleSelectAll = (event) => {
        const checked = event.target.checked;
        setCandidates(prevCandidates => prevCandidates.map(candidate => ({ ...candidate, selected: checked })));
    };

    const handleSelectCandidate = (event, candidateId) => {
        setCandidates(prevCandidates => prevCandidates.map(candidate => ({
            ...candidate,
            selected: candidate.id === candidateId ? !candidate.selected : candidate.selected
        })));
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNewCandidate({
            name: '',
            email: '',
            joiningDate: '',
            probationEnds: '',
            jobPosition: '',
            recruitment: ''
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewCandidate(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateCandidate = () => {
        const newId = candidates.length ? Math.max(candidates.map(c => c.id)) + 1 : 1;
        setCandidates(prev => [...prev, { id: newId, ...newCandidate, selected: false }]);
        handleClose();
    };

    return (
        <div className="candidate-view">
            <h1>Hired Candidates</h1>

            <div className="filter-bar">
                <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
                <select value={filter} onChange={handleFilterChange}>
                    <option value="All">All</option>
                    <option value="Portal Sent">Portal Sent</option>
                    <option value="Portal Not-Sent">Portal Not-Sent</option>
                </select>
                <button onClick={handleOpen}>Create</button>
            </div>

            <table className="candidate-table">
                <thead>
                    <tr>
                        <th>
                            <input 
                                type="checkbox" 
                                checked={candidates.every(candidate => candidate.selected)} 
                                onChange={handleSelectAll} 
                            />
                        </th>
                        <th>Candidate</th>
                        <th>Email</th>
                        <th>Date of Joining</th>
                        <th>Probation Ends</th>
                        <th>Job Position</th>
                        <th>Recruitment</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCandidates.map(candidate => (
                        <tr key={candidate.id}>
                            <td>
                                <input 
                                    type="checkbox" 
                                    checked={candidate.selected} 
                                    onChange={(event) => handleSelectCandidate(event, candidate.id)} 
                                />
                            </td>
                            <td>{candidate.name}</td>
                            <td>{candidate.email}</td>
                            <td>{candidate.joiningDate}</td>
                            <td>{candidate.probationEnds}</td>
                            <td>{candidate.jobPosition}</td>
                            <td>{candidate.recruitment}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Candidate</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={newCandidate.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={newCandidate.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="joiningDate"
                        label="Joining Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={newCandidate.joiningDate}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="probationEnds"
                        label="Probation Ends"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={newCandidate.probationEnds}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="jobPosition"
                        label="Job Position"
                        type="text"
                        fullWidth
                        value={newCandidate.jobPosition}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="recruitment"
                        label="Recruitment"
                        type="text"
                        fullWidth
                        value={newCandidate.recruitment}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateCandidate} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CandidatesView;
