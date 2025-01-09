// import React, { useState } from 'react';
// import CreateFeedback from './CreateFeedback';  
// import './Feedback.css';

// const Feedback = () => {
//     const initialData = {
//         selfFeedback: [
//             {
//                 id: 1,
//                 employee: "John Doe",
//                 title: "Q4 Performance Review",
//                 status: "In Progress",
//                 startDate: "2024-01-01",
//                 dueDate: "2024-01-31",
//                 manager: "Sarah Smith",
//                 period: "Q4 2023",
//                 subordinates: "Team A",
//                 colleague: "Jane Wilson",
//                 questionTemplate: "Performance Review 2023",
//                 keyResult: "Project Completion"
//             }
//         ],
//         requestedFeedback: [
//             {
//                 id: 2,
//                 employee: "Alice Johnson",
//                 title: "Annual Review 2023",
//                 status: "Pending",
//                 startDate: "2024-02-01",
//                 dueDate: "2024-02-28",
//                 manager: "Mike Brown",
//                 period: "Annual 2023",
//                 subordinates: "Team B",
//                 colleague: "Bob Martin",
//                 questionTemplate: "Annual Review Template",
//                 keyResult: "Team Leadership"
//             }
//         ],
//         feedbackToReview: [
//             {
//                 id: 3,
//                 employee: "Emma Davis",
//                 title: "Mid-Year Assessment",
//                 status: "Not Started",
//                 startDate: "2024-03-01",
//                 dueDate: "2024-03-15",
//                 manager: "Chris Wilson",
//                 period: "H1 2024",
//                 subordinates: "Team C",
//                 colleague: "David Clark",
//                 questionTemplate: "Mid-Year Review",
//                 keyResult: "Innovation Goals"
//             }
//         ],
//         anonymousFeedback: [
//             {
//                 id: 4,
//                 employee: "Anonymous",
//                 title: "Team Culture Feedback",
//                 status: "Completed",
//                 startDate: "2024-01-15",
//                 dueDate: "2024-01-30",
//                 manager: "Team Lead",
//                 period: "Q1 2024",
//                 subordinates: "All Teams",
//                 colleague: "Anonymous",
//                 questionTemplate: "Culture Survey",
//                 keyResult: "Team Satisfaction"
//             }
//         ]
//     };

//     const [activeTab, setActiveTab] = useState('feedbackToReview');
//     const [searchQuery, setSearchQuery] = useState('');
//     const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//     const [filterPopupVisible, setFilterPopupVisible] = useState(false);
//     const [feedbackData, setFeedbackData] = useState(initialData);
//     const [editingFeedback, setEditingFeedback] = useState(null);
//     const [filterCriteria, setFilterCriteria] = useState({
//         title: '',
//         employee: '',
//         status: '',
//         manager: '',
//         startDate: '',
//         endDate: '',
//     });

//     const handleAddFeedback = (newFeedback, isEditing) => {
//         setFeedbackData(prevData => {
//             if (isEditing) {
//                 return {
//                     ...prevData,
//                     [activeTab]: prevData[activeTab].map(item => 
//                         item.id === newFeedback.id ? newFeedback : item
//                     )
//                 };
//             }
//             return {
//                 ...prevData,
//                 [activeTab]: [...prevData[activeTab], newFeedback]
//             };
//         });
//         setIsCreateModalOpen(false);
//         setEditingFeedback(null);
//     };

//     const handleEdit = (feedback) => {
//         setEditingFeedback(feedback);
//         setIsCreateModalOpen(true);
//     };

//     const handleDelete = (id) => {
//         setFeedbackData(prevData => ({
//             ...prevData,
//             [activeTab]: prevData[activeTab].filter(item => item.id !== id)
//         }));
//     };

//     const handleSearchChange = (e) => {
//         setSearchQuery(e.target.value);
//     };

//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilterCriteria(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const filteredFeedbackData = feedbackData[activeTab].filter(item => {
//         const matchesSearch = 
//             item.employee.toLowerCase().includes(searchQuery.toLowerCase()) || 
//             item.title.toLowerCase().includes(searchQuery.toLowerCase());
        
//         const matchesFilter = 
//             (!filterCriteria.title || item.title.toLowerCase().includes(filterCriteria.title.toLowerCase())) &&
//             (!filterCriteria.employee || item.employee.toLowerCase().includes(filterCriteria.employee.toLowerCase())) &&
//             (!filterCriteria.status || item.status === filterCriteria.status) &&
//             (!filterCriteria.manager || item.manager.toLowerCase().includes(filterCriteria.manager.toLowerCase())) &&
//             (!filterCriteria.startDate || item.startDate >= filterCriteria.startDate) &&
//             (!filterCriteria.endDate || item.dueDate <= filterCriteria.endDate);

//         return matchesSearch && matchesFilter;
//     });

//     return (
//         <div className="feedback">
//             <div className="feedback-header">
//                 <h2>Feedbacks</h2>
//                 <div className="toolbar">
//                     <input 
//                         type="text" 
//                         placeholder="Search" 
//                         value={searchQuery} 
//                         onChange={handleSearchChange} 
//                     />
//                     <button onClick={() => setFilterPopupVisible(true)}>Filter</button>
//                     <button className="create-btn" onClick={() => setIsCreateModalOpen(true)}>
//                         + Create
//                     </button>
//                 </div>
//             </div>

//             {filterPopupVisible && (
//                 <div className="filter-popup">
//                     <div className="filter-popup-content">
//                         <h3>Filter Feedback</h3>
//                         <div className="group">
//                             <label>
//                                 Title
//                                 <input
//                                     type="text"
//                                     name="title"
//                                     value={filterCriteria.title}
//                                     onChange={handleFilterChange}
//                                 />
//                             </label>
//                             <label>
//                                 Employee
//                                 <input
//                                     type="text"
//                                     name="employee"
//                                     value={filterCriteria.employee}
//                                     onChange={handleFilterChange}
//                                 />
//                             </label>
//                         </div>
//                         <div className="group">
//                             <label>
//                                 Status
//                                 <select
//                                     name="status"
//                                     value={filterCriteria.status}
//                                     onChange={handleFilterChange}
//                                 >
//                                     <option value="">All</option>
//                                     <option value="Not Started">Not Started</option>
//                                     <option value="In Progress">In Progress</option>
//                                     <option value="Completed">Completed</option>
//                                     <option value="Pending">Pending</option>
//                                 </select>
//                             </label>
//                             <label>
//                                 Manager
//                                 <input
//                                     type="text"
//                                     name="manager"
//                                     value={filterCriteria.manager}
//                                     onChange={handleFilterChange}
//                                 />
//                             </label>
//                         </div>
//                         <div className="group">
//                             <label>
//                                 Start Date
//                                 <input
//                                     type="date"
//                                     name="startDate"
//                                     value={filterCriteria.startDate}
//                                     onChange={handleFilterChange}
//                                 />
//                             </label>
//                             <label>
//                                 End Date
//                                 <input
//                                     type="date"
//                                     name="endDate"
//                                     value={filterCriteria.endDate}
//                                     onChange={handleFilterChange}
//                                 />
//                             </label>
//                         </div>
//                         <button onClick={() => setFilterPopupVisible(false)}>Apply</button>
//                     </div>
//                 </div>
//             )}

//             <div className="tabs">
//                 <button 
//                     className={activeTab === 'selfFeedback' ? 'active' : ''} 
//                     onClick={() => setActiveTab('selfFeedback')}
//                 >
//                     Self Feedback
//                 </button>
//                 <button 
//                     className={activeTab === 'requestedFeedback' ? 'active' : ''} 
//                     onClick={() => setActiveTab('requestedFeedback')}
//                 >
//                     Requested Feedback
//                 </button>
//                 <button 
//                     className={activeTab === 'feedbackToReview' ? 'active' : ''} 
//                     onClick={() => setActiveTab('feedbackToReview')}
//                 >
//                     Feedback to Review
//                 </button>
//                 <button 
//                     className={activeTab === 'anonymousFeedback' ? 'active' : ''} 
//                     onClick={() => setActiveTab('anonymousFeedback')}
//                 >
//                     Anonymous Feedback
//                 </button>
//             </div>

//             {isCreateModalOpen && (
//                 <div className="modal-overlay">
//                     <div className="modal-content">
//                         <button className="close-btn" onClick={() => {
//                             setIsCreateModalOpen(false);
//                             setEditingFeedback(null);
//                         }}>×</button>
//                         <CreateFeedback 
//                             addFeedback={handleAddFeedback} 
//                             editData={editingFeedback}
//                             onClose={() => {
//                                 setIsCreateModalOpen(false);
//                                 setEditingFeedback(null);
//                             }}
//                         />
//                     </div>
//                 </div>
//             )}

//             <table>
//                 <thead>
//                     <tr>
//                         <th>Employee</th>
//                         <th>Title</th>
//                         <th>Status</th>
//                         <th>Start Date</th>
//                         <th>Due Date</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {filteredFeedbackData.map((item) => (
//                         <tr key={item.id}>
//                             <td>{item.employee}</td>
//                             <td>{item.title}</td>
//                             <td>{item.status}</td>
//                             <td>{item.startDate}</td>
//                             <td>{item.dueDate}</td>
//                             <td>
//                                 <button onClick={() => handleEdit(item)}>✏️</button>
//                                 <button onClick={() => handleDelete(item.id)}>🗑️</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             <div className="pagination">Page 1 of 1</div>
//         </div>
//     );
// };

// export default Feedback;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateFeedback from './CreateFeedback';  
import './Feedback.css';

const Feedback = () => {
    const [activeTab, setActiveTab] = useState('feedbackToReview');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filterPopupVisible, setFilterPopupVisible] = useState(false);
    const [feedbackData, setFeedbackData] = useState({
        selfFeedback: [],
        requestedFeedback: [],
        feedbackToReview: [],
        anonymousFeedback: []
    });
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterCriteria, setFilterCriteria] = useState({
        title: '',
        employee: '',
        status: '',
        manager: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/feedback');
            setFeedbackData(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch feedbacks');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFeedback = async (newFeedback, isEditing) => {
        try {
            const feedbackData = {
                ...newFeedback,
                feedbackType: activeTab
            };

            if (isEditing) {
                await axios.put(`http://localhost:5000/api/feedback/${newFeedback._id}`, feedbackData);
            } else {
                await axios.post('http://localhost:5000/api/feedback', feedbackData);
            }
            await fetchFeedbacks();
            setIsCreateModalOpen(false);
            setEditingFeedback(null);
        } catch (error) {
            console.error('Error saving feedback:', error);
            setError('Failed to save feedback');
        }
    };

    const handleEdit = (feedback) => {
        setEditingFeedback(feedback);
        setIsCreateModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/feedback/${id}`);
            await fetchFeedbacks();
        } catch (error) {
            console.error('Error deleting feedback:', error);
            setError('Failed to delete feedback');
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterCriteria(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredFeedbackData = feedbackData[activeTab]?.filter(item => {
        const matchesSearch = 
            item.employee.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.title.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesFilter = 
            (!filterCriteria.title || item.title.toLowerCase().includes(filterCriteria.title.toLowerCase())) &&
            (!filterCriteria.employee || item.employee.toLowerCase().includes(filterCriteria.employee.toLowerCase())) &&
            (!filterCriteria.status || item.status === filterCriteria.status) &&
            (!filterCriteria.manager || item.manager.toLowerCase().includes(filterCriteria.manager.toLowerCase())) &&
            (!filterCriteria.startDate || new Date(item.startDate) >= new Date(filterCriteria.startDate)) &&
            (!filterCriteria.endDate || new Date(item.dueDate) <= new Date(filterCriteria.endDate));

        return matchesSearch && matchesFilter;
    }) || [];

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="feedback">
            <div className="feedback-header">
                <h2>Feedbacks</h2>
                <div className="toolbar">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        value={searchQuery} 
                        onChange={handleSearchChange} 
                    />
                    <button onClick={() => setFilterPopupVisible(true)}>Filter</button>
                    <button className="create-btn" onClick={() => setIsCreateModalOpen(true)}>
                        + Create
                    </button>
                </div>
            </div>

            {filterPopupVisible && (
                <div className="filter-popup">
                    <div className="filter-popup-content">
                        <h3>Filter Feedback</h3>
                        <div className="group">
                            <label>
                                Title
                                <input
                                    type="text"
                                    name="title"
                                    value={filterCriteria.title}
                                    onChange={handleFilterChange}
                                />
                            </label>
                            <label>
                                Employee
                                <input
                                    type="text"
                                    name="employee"
                                    value={filterCriteria.employee}
                                    onChange={handleFilterChange}
                                />
                            </label>
                        </div>
                        <div className="group">
                            <label>
                                Status
                                <select
                                    name="status"
                                    value={filterCriteria.status}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All</option>
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </label>
                            <label>
                                Manager
                                <input
                                    type="text"
                                    name="manager"
                                    value={filterCriteria.manager}
                                    onChange={handleFilterChange}
                                />
                            </label>
                        </div>
                        <div className="group">
                            <label>
                                Start Date
                                <input
                                    type="date"
                                    name="startDate"
                                    value={filterCriteria.startDate}
                                    onChange={handleFilterChange}
                                />
                            </label>
                            <label>
                                End Date
                                <input
                                    type="date"
                                    name="endDate"
                                    value={filterCriteria.endDate}
                                    onChange={handleFilterChange}
                                />
                            </label>
                        </div>
                        <button onClick={() => setFilterPopupVisible(false)}>Apply</button>
                    </div>
                </div>
            )}

            <div className="tabs">
                <button 
                    className={activeTab === 'selfFeedback' ? 'active' : ''} 
                    onClick={() => setActiveTab('selfFeedback')}
                >
                    Self Feedback
                </button>
                <button 
                    className={activeTab === 'requestedFeedback' ? 'active' : ''} 
                    onClick={() => setActiveTab('requestedFeedback')}
                >
                    Requested Feedback
                </button>
                <button 
                    className={activeTab === 'feedbackToReview' ? 'active' : ''} 
                    onClick={() => setActiveTab('feedbackToReview')}
                >
                    Feedback to Review
                </button>
                <button 
                    className={activeTab === 'anonymousFeedback' ? 'active' : ''} 
                    onClick={() => setActiveTab('anonymousFeedback')}
                >
                    Anonymous Feedback
                </button>
            </div>

            {isCreateModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={() => {
                            setIsCreateModalOpen(false);
                            setEditingFeedback(null);
                        }}>×</button>
                        <CreateFeedback 
                            addFeedback={handleAddFeedback} 
                            editData={editingFeedback}
                            onClose={() => {
                                setIsCreateModalOpen(false);
                                setEditingFeedback(null);
                            }}
                        />
                    </div>
                </div>
            )}

            <table>
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Start Date</th>
                        <th>Due Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFeedbackData.map((item) => (
                        <tr key={item._id || item.id}>
                            <td>{item.employee}</td>
                            <td>{item.title}</td>
                            <td>{item.status}</td>
                            <td>{new Date(item.startDate).toLocaleDateString()}</td>
                            <td>{new Date(item.dueDate).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => handleEdit(item)}>✏️</button>
                                <button onClick={() => handleDelete(item._id || item.id)}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">Page 1 of 1</div>
        </div>
    );
};

export default Feedback;
