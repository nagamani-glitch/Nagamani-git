import React, { useState, useRef, useEffect } from "react";
import CreateDeduction from "./CreateDeduction";
import axios from "axios";
import "./Deductions.css";
import {
  FaList,
  FaTh,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const Deductions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("card"); // 'card' or 'list'
  const [filteredData, setFilteredData] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDeduction, setEditingDeduction] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    taxable: "",
    fixed: "",
    oneTimeDeduction: "",
    amount: "",
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
      const response = await axios.get("http://localhost:5000/api/deductions");
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
      const filtered = deductions.filter(
        (
          deduction // Use fetched deductions
        ) => deduction.name.toLowerCase().includes(term.toLowerCase())
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
      const response = await axios.put(
        `http://localhost:5000/api/deductions/${updatedData._id}`,
        updatedData
      );
      setFilteredData((prevData) =>
        prevData.map((item) =>
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
    if (window.confirm("Are you sure you want to delete this deduction?")) {
      try {
        await axios.delete(`http://localhost:5000/api/deductions/${id}`);
        fetchDeductions();
        alert("Deduction deleted successfully");
      } catch (error) {
        console.error("Error deleting deduction:", error);
        alert("Failed to delete deduction");
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
      filtered = filtered.filter(
        (item) => item.taxable === filterOptions.taxable
      );
    }

    if (filterOptions.fixed) {
      filtered = filtered.filter((item) =>
        filterOptions.fixed === "Yes" ? item.fixed : !item.fixed
      );
    }

    if (filterOptions.oneTimeDeduction) {
      filtered = filtered.filter(
        (item) => item.oneTimeDeduction === filterOptions.oneTimeDeduction
      );
    }

    if (filterOptions.amount) {
      filtered = filtered.filter((item) => {
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
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    fetchDeductions(); // This will refresh the deductions list
  };

  const resetFilters = () => {
    setFilterOptions({
      taxable: "",
      fixed: "",
      oneTimeDeduction: "",
      amount: "",
    });
    setFilteredData(deductions);
    setIsFilterVisible(false);
  };

  return (
    <div className="deduction-container">
      <div className="deduction-sub-container">
        <header className="deduction-header">
          <h1>Deductions</h1>
          <div className="deduction-controls">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              // className="deduction-search-input"
              style={{
                border: "1px solid gray",
                padding: "8px",
                borderRadius: "4px",
                marginRight: "8px",
              }}
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

            <div
              style={{ position: "relative", display: "inline-block" }}
              ref={filterRef}
            >
              <button
                onClick={toggleFilterVisibility}
                style={{
                  padding: "8px 16px",
                  background: "linear-gradient(45deg, #3498db, #2980b9)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(52, 152, 219, 0.2)",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                <FaFilter /> Filter
              </button>
              {isFilterVisible && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    width: "600px",
                    background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    border: "1px solid rgba(255,255,255,0.8)",
                    zIndex: 1000,
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          color: "#2c3e50",
                          fontWeight: "600",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        Pretax
                      </label>
                      <select
                        name="taxable"
                        value={filterOptions.taxable}
                        onChange={handleFilterChange}
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "8px",
                          border: "2px solid #e0e7ff",
                          fontSize: "14px",
                          background: "white",
                          outline: "none",
                        }}
                      >
                        <option value="">All</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          color: "#2c3e50",
                          fontWeight: "600",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        Fixed
                      </label>
                      <select
                        name="fixed"
                        value={filterOptions.fixed}
                        onChange={handleFilterChange}
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "8px",
                          border: "2px solid #e0e7ff",
                          fontSize: "14px",
                          background: "white",
                          outline: "none",
                        }}
                      >
                        <option value="">All</option>
                        <option value="Yes">Fixed</option>
                        <option value="No">Variable</option>
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          color: "#2c3e50",
                          fontWeight: "600",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        One Time Deduction
                      </label>
                      <select
                        name="oneTimeDeduction"
                        value={filterOptions.oneTimeDeduction}
                        onChange={handleFilterChange}
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "8px",
                          border: "2px solid #e0e7ff",
                          fontSize: "14px",
                          background: "white",
                          outline: "none",
                        }}
                      >
                        <option value="">All</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          color: "#2c3e50",
                          fontWeight: "600",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        Amount Range
                      </label>
                      <select
                        name="amount"
                        value={filterOptions.amount}
                        onChange={handleFilterChange}
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "8px",
                          border: "2px solid #e0e7ff",
                          fontSize: "14px",
                          background: "white",
                          outline: "none",
                        }}
                      >
                        <option value="">All</option>
                        <option value="lessThan1000">Less than 1000</option>
                        <option value="1000to5000">1000 to 5000</option>
                        <option value="moreThan5000">More than 5000</option>
                      </select>
                    </div>
                    <div
                      style={{
                        gridColumn: "1 / -1",
                        display: "flex",
                        gap: "12px",
                        marginTop: "8px",
                      }}
                    >
                      <button
                        onClick={applyFilter}
                        style={{
                          flex: 1,
                          padding: "10px",
                          background:
                            "linear-gradient(45deg, #3498db, #2980b9)",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        Apply Filter
                      </button>
                      <button
                        onClick={resetFilters}
                        style={{
                          flex: 1,
                          padding: "10px",
                          background:
                            "linear-gradient(45deg, #e74c3c, #c0392b)",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="create-btn" onClick={handleCreateAllowance}>
              Create
            </button>

            {/* Create modal popup */}

            {showCreateModal && (
              <div className="modal-overlay">
                <div className="modal-container">
                  <div className="modal-header">
                    <h2 style={{ paddingTop: "20px" }}>
                      {editingDeduction ? "Edit Deduction" : "Create Deduction"}
                    </h2>
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
        {/* {isFilterVisible && (
        <div className="deduction-filter-popup" ref={filterRef}>
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
      )} */}

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
                  <p className="card-content-para">
                    Employee Rate: {deduction.employeeRate}
                  </p>
                  <p className="card-content-para">
                    Employer Rate: {deduction.employerRate}
                  </p>
                  <p className="card-content-para">
                    {" "}
                    One Time Deduction: {deduction.oneTimeDeduction}
                  </p>
                  <p className="card-content-para">
                    Taxable: {deduction.taxable}
                  </p>
                </div>
                <div className="card-header">
                  <div className="card-actions">
                    <button
                      className="ded-card-edit-btn"
                      onClick={() => handleEdit(deduction)}
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      className="ded-card-delete-btn"
                      onClick={() => handleDelete(deduction._id)}
                    >
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
                          className="Ded-list-Edit-btn"
                          onClick={() => handleEdit(deduction.id)}
                        >
                          <FaEdit size={20} />
                        </button>
                        <button
                          className="Ded-list-Delete-btn"
                          onClick={() => handleDelete(deduction._id)}
                        >
                          <FaTrash size={18} />
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
        </footer>
      </div>
    </div>
  );
};

export default Deductions;
