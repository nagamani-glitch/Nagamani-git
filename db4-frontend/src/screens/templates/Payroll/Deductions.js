import React, { useState,useRef, useEffect } from "react";
import {useNavigate} from 'react-router-dom'
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
  const [filterOptions, setFilterOptions] = useState({
    taxable: "",
    condition: "",
    base: "",
  });
  const navigate = useNavigate()

  const handleCreateAllowance = () => {
    navigate('/deductions/create');
  };

  

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === "") {
      setFilteredData(deductionsData);
    } else {
      const filtered = deductionsData.filter((deduction) =>
        deduction.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleEdit = (id) => {
    alert(`Edit allowance with ID: ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete allowance with ID: ${id}`);
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
    let filtered = deductionsData;

     // Filter based on taxable
    if (filterOptions.taxable) {
      filtered = filtered.filter((deduction) => deduction.taxable === filterOptions.taxable);
    }

    // Filter based on condition (Fixed/Non-Fixed)

    if (filterOptions.condition) {
      filtered = filtered.filter((deduction) => (filterOptions.condition === "Fixed" ? deduction.fixed : !deduction.fixed));
    }

     // Apply the filtered data
    setFilteredData(filtered);
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
            <FaPlus /> Create
          </button>
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
            <div style={{display: "flex", justifyContent: "space-between"}}>
            <div className="filter-row">
              <label>Pretax</label>
              <select
                name="taxable"
                onChange={handleFilterChange}
                value={filterOptions.taxable}
              >
                <option value="">Select Pretax </option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="filter-row">
              <label>Condition Based</label>
              <select
                name="condition"
                onChange={handleFilterChange}
                value={filterOptions.condition}
              >
                <option value="">Select Based  </option>
                <option value="Based">Yes</option>
                <option value="Non-Based">No</option>
              </select>
            </div>
</div>

          <div style={{display: "flex", justifyContent: "space-between"}}>
            <div className="filter-row">
              <label>Fixed</label>
              <select
                name="condition"
                onChange={handleFilterChange}
                value={filterOptions.condition}
              >
                <option value="">Select Fixed </option>
                <option value="Fixed">Yes</option>
                <option value="Non-Fixed">No</option>
              </select>
            </div>

            <div className="filter-row">
              <label>Based</label>
              <select
                name="base"
                onChange={handleFilterChange}
                value={filterOptions.base}
              >
                <option value="">------</option>
                <option value="Monthly">Basic Pay</option>
                <option value="Hourly">Gross Pay</option>
                <option value="Hourly">Taxable Gross Pay</option>
                <option value="Hourly">Net Pay</option>
              </select>
            </div>
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
            <div className="deduction-card" key={deduction.id}>
              <div className="card-icon">{deduction.code}</div>
              <div className="card-content">
                <h3>{deduction.name}</h3>
                <p className="card-content-para">Employee Rate:  {deduction.employeeRate}</p>
                <p className="card-content-para">Employer Rate: {deduction.employerRate}</p>
                <p className="card-content-para"> One Time Deduction: {deduction.oneTimeDeduction}</p>
                <p className="card-content-para">Taxable: {deduction.taxable}</p>
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
                      className="edit-btn"
                      onClick={() => handleEdit(deduction.id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(deduction.id)}
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
