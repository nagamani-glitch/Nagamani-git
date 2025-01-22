import React, { useState, useRef, useEffect } from "react";
import CreateDeduction from "./CreateDeduction";
import axios from "axios";
import './Deductions.css'
import {
  FaList,
  FaTh,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash
} from "react-icons/fa";

const deductionsData = [
  {
    id: 1,
    code: "ESI",
    name: "ESI",
    amount: 200.0,
    employerRate: "6.25% of Gross Pay",
    employeeRate: "7.75% of Gross Pay",
    oneTimeDeduction: "No",
    taxable: "Yes",
    fixed: false,
  },
  {
    id: 2,
    code: "SS",
    name: "Social Security (FICA)",
    amount: 1000.0,
    employerRate: "3.25% of Gross Pay",
    employeeRate: "0.75% of Gross Pay",
    oneTimeDeduction: "No",
    taxable: "Yes",
    fixed: true,
    pretax: "Yes",
  },

  // Add more allowance data here
];

const Deductions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("card"); // 'card' or 'list'
  const [filteredData, setFilteredData] = useState(deductionsData);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDeduction, setEditingDeduction] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    taxable: "",
    fixed: "",
    oneTimeDeduction: "",
    amount: ""
  });
  // Add this state for deductions data
  const [deductions, setDeductions] = useState([]);


  // Add useEffect to fetch deductions when component mounts
  useEffect(() => {
    fetchDeductions();
  }, []);

  // Add function to fetch deductions
  const fetchDeductions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/deductions');
      setDeductions(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      console.error("Error fetching deductions:", error);
    }
  };



  const handleCreateAllowance = () => {
    setShowCreateModal(true);
  };


  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === "") {
      setFilteredData(deductions); // Use fetched deductions instead of deductionsData
    } else {
      const filtered = deductions.filter((deduction) => // Use fetched deductions
        deduction.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleEdit = (deduction) => {
    setEditingDeduction(deduction);
    setShowCreateModal(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/deductions/${updatedData._id}`, updatedData);
      setFilteredData(prevData =>
        prevData.map(item =>
          item._id === updatedData._id ? response.data.data : item
        )
      );
      setEditingDeduction(null);
      setShowCreateModal(false);
      fetchDeductions();
    } catch (error) {
      console.error("Error updating deduction:", error);
      alert("Failed to update deduction");
    }
  };


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this deduction?')) {
      try {
        await axios.delete(`http://localhost:5000/api/deductions/${id}`);
        fetchDeductions();
        alert('Deduction deleted successfully');
      } catch (error) {
        console.error('Error deleting deduction:', error);
        alert('Failed to delete deduction');
      }
    }
  };



  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilter = () => {
    let filtered = [...deductions]; // Use the fetched deductions instead of static data

    if (filterOptions.taxable) {
      filtered = filtered.filter(item => item.taxable === filterOptions.taxable);
    }

    if (filterOptions.fixed) {
      filtered = filtered.filter(item =>
        filterOptions.fixed === "Yes" ? item.fixed : !item.fixed
      );
    }

    if (filterOptions.oneTimeDeduction) {
      filtered = filtered.filter(item =>
        item.oneTimeDeduction === filterOptions.oneTimeDeduction
      );
    }

    if (filterOptions.amount) {
      filtered = filtered.filter(item => {
        const amount = Number(item.amount);
        switch (filterOptions.amount) {
          case "lessThan1000":
            return amount < 1000;
          case "1000to5000":
            return amount >= 1000 && amount <= 5000;
          case "moreThan5000":
            return amount > 5000;
          default:
            return true;
        }
      });
    }

    setFilteredData(filtered);
    setIsFilterVisible(false);
  };


  const getActiveFilters = () => {
    let activeFilters = [];
    if (filterOptions.taxable) {
      activeFilters.push(`Taxable: ${filterOptions.taxable}`);
    }
    if (filterOptions.condition) {
      activeFilters.push(`Condition: ${filterOptions.condition}`);
    }
    if (filterOptions.base) {
      activeFilters.push(`Base: ${filterOptions.base}`);
    }
    return activeFilters;
  };

  const removeFilter = (filter) => {
    if (filter.includes("Taxable")) {
      setFilterOptions((prev) => ({ ...prev, taxable: "" }));
    } else if (filter.includes("Condition")) {
      setFilterOptions((prev) => ({ ...prev, condition: "" }));
    } else if (filter.includes("Base")) {
      setFilterOptions((prev) => ({ ...prev, base: "" }));
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };


  const handleModalClose = () => {
    setShowCreateModal(false);
    fetchDeductions(); // This will refresh the deductions list
  };


  return (
    <div className="deduction-container">
      <header className="deduction-header">
        <h2>Deductions</h2>
        <div className="controls">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <button
            className={`view-toggle ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
          >
            <FaList />
          </button>
          <button
            className={`view-toggle ${view === "card" ? "active" : ""}`}
            onClick={() => setView("card")}
          >
            <FaTh />
          </button>
          <button className="filter-btn" onClick={toggleFilterVisibility}>
            <FaFilter /> Filter
          </button>
          <button className="create-btn" onClick={handleCreateAllowance}>
             Create
          </button>

          {/* Create modal popup */}

          {showCreateModal && (
            <div className="modal-overlay">
              <div className="modal-container">
                <div className="modal-header">
                  <h2 style={{ paddingTop: "20px" }}>{editingDeduction ? 'Edit Deduction' : 'Create Deduction'}</h2>
                  <button
                    className="close-modal-btn"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingDeduction(null);
                    }}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-content">
                  <CreateDeduction
                    onClose={handleModalClose}
                    editData={editingDeduction}
                    onUpdate={handleUpdate}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </header>

      {/* Display active filters as tags */}
      <div className="active-filters">
        {getActiveFilters().map((filter, index) => (
          <span key={index} className="filter-tag">
            {filter} <button onClick={() => removeFilter(filter)}>x</button>
          </span>
        ))}
      </div>
      {isFilterVisible && (
        <div className="filter-popup" ref={filterRef}>
          <div className="filter-form">
            <div className="filter-row">
              <label>Pretax</label>
              <select name="taxable" value={filterOptions.taxable} onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="filter-row">
              <label>Fixed</label>
              <select name="fixed" value={filterOptions.fixed} onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="Yes">Fixed</option>
                <option value="No">Variable</option>
              </select>
            </div>

            <div className="filter-row">
              <label>One Time Deduction</label>
              <select name="oneTimeDeduction" value={filterOptions.oneTimeDeduction} onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="filter-row">
              <label>Amount Range</label>
              <select name="amount" value={filterOptions.amount} onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="lessThan1000">Less than 1000</option>
                <option value="1000to5000">1000 to 5000</option>
                <option value="moreThan5000">More than 5000</option>
              </select>
            </div>

            <button onClick={applyFilter}>Apply Filter</button>
          </div>
        </div>
      )}

      <div className="status-indicators">
        <span className="dot not-fixed">Not Fixed</span>
        <span className="dot fixed">Fixed</span>
        <span className="dot taxable">Pretax</span>
      </div>

      {view === "card" ? (

        <div className="card-view">
          {filteredData.map((deduction) => (
            <div className="deduction-card" key={deduction._id}>

              <div className="card-icon">{getInitials(deduction.name)}</div>


              <div className="card-content">
                <h3>{deduction.name}</h3>
                <p className="card-content-para">Employee Rate:  {deduction.employeeRate}</p>
                <p className="card-content-para">Employer Rate: {deduction.employerRate}</p>
                <p className="card-content-para"> One Time Deduction: {deduction.oneTimeDeduction}</p>
                <p className="card-content-para">Taxable: {deduction.taxable}</p>
              </div>
              <div className="card-header">
                <div className="card-actions">
                  <button className="edit-btn" onClick={() => handleEdit(deduction)}>
                    <FaEdit size={20} />
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(deduction._id)}>
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="list-view">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th className="sticky-column">Deductions</th>
                  <th className="scrollable-column">Specific Employees</th>
                  <th className="scrollable-column">Excluded Employees</th>
                  <th className="scrollable-column">Is Pretax</th>
                  <th className="scrollable-column">Is Condition Based</th>
                  <th className="scrollable-column">Condition</th>
                  <th className="scrollable-column">Is Fixed</th>
                  <th className="scrollable-column">Amount</th>
                  <th className="scrollable-column">Based On</th>
                  <th className="scrollable-column">Rate</th>
                  <th className="sticky-column">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((deduction) => (
                  <tr key={deduction.id}>
                    <td className="sticky-column">{deduction.name}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>{deduction.taxable}</td>
                    <td>No</td>
                    <td>-</td>
                    <td>{deduction.fixed ? "Yes" : "No"}</td>
                    <td>{deduction.amount}</td>
                    <td>-</td>
                    <td>-</td>
                    <td className="sticky-column">
                      <button
                        className="DedEdit-btn"
                        onClick={() => handleEdit(deduction.id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="DedDelete-btn"
                        onClick={() => handleDelete(deduction._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <footer className="footer">
        <span>Page 1 of 1</span>
        <button className="add-btn">
          <FaPlus />
        </button>
      </footer>
    </div>
  );
};

export default Deductions;
