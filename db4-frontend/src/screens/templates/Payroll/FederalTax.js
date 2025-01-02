import React, { useState } from 'react';

import { FaMinus, FaPlus, FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa';

import './FederalTax.css';

const FederalTax = () => {
    const [showTable, setShowTable] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    const [entries, setEntries] = useState([
        { id: 1, taxRate: "15.00%", minIncome: "ETB 2300.00", maxIncome: "ETB 3300.00" },
        { id: 2, taxRate: "3.00%", minIncome: "ETB 11000.00", maxIncome: "ETB 460000.00" },
    ]);

    const [newEntry, setNewEntry] = useState({ taxRate: '', minIncome: '', maxIncome: '' });
    const [editId, setEditId] = useState(null); // To track the entry being edited



    const toggleTableVisibility = () => {
        setShowTable(!showTable);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const data = [
        { id: 1, taxRate: "45.00%", minIncome: "ETB 1500.00", maxIncome: "ETB 4000.00" },
        { id: 2, taxRate: "1.00%", minIncome: "ETB 13000.00", maxIncome: "ETB 500000.00" },
    ];

    const filteredData = data.filter((item) =>
        item.taxRate.toString().includes(searchTerm) ||
        item.minIncome.toString().includes(searchTerm) ||
        item.maxIncome.toString().includes(searchTerm)
    );

    const handleCreateButtonClick = () => {
        setShowModal(true);
        setEditId(null); // Reset editId when creating a new entry
        setNewEntry({ taxRate: '', minIncome: '', maxIncome: '' }); // Clear the form
   

    };

    const handleModalClose = () => {
        setShowModal(false);
        setNewEntry({ taxRate: '', minIncome: '', maxIncome: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry((prev) => ({ ...prev, [name]: value }));
    };

 {/**   const handleSaveEntry = () => {
        setEntries((prev) => [...prev, { id: Date.now(), ...newEntry }]);
        handleModalClose();
    };
     */}

     const handleSaveEntry = () => {
        if (editId !== null) {
            // Update an existing entry
            setEntries((prevEntries) =>
                prevEntries.map((entry) =>
                    entry.id === editId ? { ...entry, ...newEntry } : entry
                )
            );
        } else {
            // Add a new entry
            setEntries((prev) => [...prev, { id: Date.now(), ...newEntry }]);
        }
        handleModalClose();
    }

    const handleEditEntry = (id) => {
        const entryToEdit = entries.find((entry) => entry.id === id);
        setNewEntry(entryToEdit); // Populate form with the entry's current data
        setEditId(id); // Set the ID of the entry being edited
        setShowModal(true);
    };

    const handleDeleteEntry = (id) => {
        setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
    };


    const filteredEntries = entries.filter((item) =>
        item.taxRate.toString().includes(searchTerm) ||
        item.minIncome.toString().includes(searchTerm) ||
        item.maxIncome.toString().includes(searchTerm)
    );

    

    return (
        <div className="filing-status">
            <div className="header">
                <h2>Filing Status</h2>
                <div className="actions">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <button className="create-button" onClick={handleCreateButtonClick}>
                        <FaPlusCircle /> Create
                    </button>
                </div>
            </div>
            <div style={{display:"flex", alignItems:"center"}}>
            <button onClick={toggleTableVisibility} className="toggle-button" style={{textAlign:"center"}}>
                    {showTable ? <FaMinus /> : <FaPlus />}
                </button>
                <h3>Porez</h3>
            </div>

            {showTable && (
                <table className="filing-table">
                    <thead>
                        <tr>
                            <th>Tax Rate</th>
                            <th>Min. Income</th>
                            <th>Max. Income</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEntries.map((item) => (
                            <tr key={item.id}>
                                <td>{item.taxRate}</td>
                                <td>{item.minIncome}</td>
                                <td>{item.maxIncome}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="edit-button" onClick={() => handleEditEntry(item.id)}><FaEdit /></button>
                                        <button className="delete-button" onClick={() => handleDeleteEntry(item.id)}><FaTrash /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

                {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Filing Status</h3>
                        <h3>{editId ? "Edit Filing Status" : "Add Filing Status"}</h3>
                        <label>
                            Filing Status:
                            <input
                                type="text"
                                name="taxRate"
                                value={newEntry.taxRate}
                                onChange={handleInputChange}
                                placeholder="Tax Rate"
                            />
                        </label>
                        <label>
                            Based on:
                            <input
                                type="text"
                                name="minIncome"
                                value={newEntry.minIncome}
                                onChange={handleInputChange}
                                placeholder="Min. Income"
                            />
                        </label>
                        <label>
                            Python Code:
                            <input
                                type="checkbox"
                                name="pythonCode"
                            />
                        </label>
                        <label>
                            Description:
                            <input
                                type="text"
                                name="maxIncome"
                                value={newEntry.maxIncome}
                                onChange={handleInputChange}
                                placeholder="Max. Income"
                            />
                        </label>
                        <div style={{display:"flex"}}> 
                        <button onClick={handleSaveEntry} className="save-button">{editId ? "Update" : "Save"}
                        </button>
                        <button onClick={handleModalClose} className="close-button">Close</button>
                    </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default FederalTax;
