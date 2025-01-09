import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTrash,
  FaEnvelope,
  FaFilter,
  FaPlus,
  FaTimes,
  FaEdit,
 FaSave
} from "react-icons/fa";
 import "./Payslips.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { payslipAPI } from "../api/payslip";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/payslips";

const Payslips = () => {
  const navigate = useNavigate();
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [filteredPayslips, setFilteredPayslips] = useState([]);
  const [editingPayslip, setEditingPayslip] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editingId, setEditingId] = useState(null);
const [editedData, setEditedData] = useState({});



  const [newPayslip, setNewPayslip] = useState({
    employee: "",
    startDate: "",
    endDate: "",
    grossPay: "",
    deduction: "0",
    batch: "None",
    status: "pending",
    mailSent: false,
  });

  const [filterCriteria, setFilterCriteria] = useState({
    startDate: "",
    endDate: "",
    status: "",
    batch: "",
    mailSent: "",
    grossPayLessThan: "",
    grossPayGreaterOrEqual: "",
    deductionLessThan: "",
    deductionGreaterOrEqual: "",
    netPayLessThan: "",
    netPayGreaterOrEqual: "",
    searchText: "",
  });

  useEffect(() => {
    fetchPayslips();
  }, []);

  const fetchPayslips = async () => {
    try {
      setLoading(true);
      const response = await payslipAPI.getAllPayslips(
        currentPage,
        itemsPerPage
      );
      // Direct access to data since backend sends array of payslips
      setPayslips(response);
      setFilteredPayslips(response);
      setTotalPages(Math.ceil(response.length / itemsPerPage));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
        toast.error("Session expired. Please login again");
      } else {
        toast.error("Failed to fetch payslips");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update the saveNewPayslip function
  const saveNewPayslip = async () => {
    try {
      const payslipData = {
        ...newPayslip,
        grossPay: parseFloat(newPayslip.grossPay),
        deduction: parseFloat(newPayslip.deduction),
        netPay:
          parseFloat(newPayslip.grossPay) - parseFloat(newPayslip.deduction),
      };

      const result = await payslipAPI.createPayslip(payslipData);
      toast.success("Payslip created successfully");
      fetchPayslips();
      toggleCreatePopup();
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
        toast.error("Please login again");
      } else {
        toast.error("Failed to create payslip");
      }
    }
  };

  // const updatePayslip = async (id, data) => {
  //     try {
  //         const token = localStorage.getItem('token');
  //         await axios.put(`${API_URL}/${id}`, data, {
  //             headers: { Authorization: `Bearer ${token}` }
  //         });
  //         toast.success('Payslip updated successfully');
  //         fetchPayslips();
  //         setEditingPayslip(null);
  //     } catch (err) {
  //         toast.error('Failed to update payslip');
  //     }
  // };

  const handleDeletePayslip = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Payslip deleted successfully");
      fetchPayslips();
    } catch (err) {
      toast.error("Failed to delete payslip");
    }
  };

  const handleUpdateMailStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/${id}/mail-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Mail status updated successfully");
      fetchPayslips();
    } catch (err) {
      toast.error("Failed to update mail status");
    }
  };

  const handleFilter = (e) => {
    const text = e.target.value.toLowerCase();
    setFilterText(text);
    setFilterCriteria((prev) => ({ ...prev, searchText: text }));
    applyFilters();
  };

  const handleFilterChange = (field, value) => {
    setFilterCriteria((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyFilters = async () => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();

      Object.entries(filterCriteria).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axios.get(`${API_URL}?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFilteredPayslips(response.data);
      setIsFilterPopupOpen(false);
    } catch (err) {
      toast.error("Failed to apply filters");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/bulk-delete`,
        { ids: selectedRows },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Selected payslips deleted successfully");
      fetchPayslips();
      setSelectedRows([]);
      setIsAllSelected(false);
    } catch (err) {
      toast.error("Failed to delete selected payslips");
    }
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setIsAllSelected(!isAllSelected);
    setSelectedRows(isAllSelected ? [] : filteredPayslips.map((p) => p._id));
  };

  const toggleCreatePopup = () => {
    setIsCreatePopupOpen(!isCreatePopupOpen);
    setNewPayslip({
      employee: "",
      startDate: "",
      endDate: "",
      grossPay: "",
      deduction: "0",
      batch: "None",
      status: "pending",
      mailSent: false,
    });
  };

  const toggleFilterModal = () => setIsFilterPopupOpen(!isFilterPopupOpen);

  const handleNewPayslipChange = (field, value) => {
    setNewPayslip((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;


  
// Add these functions to handle edit, save and delete operations
const handleEdit = (payslip) => {
    setEditingId(payslip._id);
    setEditedData({
      _id: payslip._id,
      employee: payslip.employee,
      startDate: payslip.startDate,
      endDate: payslip.endDate,
      batch: payslip.batch,
      grossPay: payslip.grossPay,
      deduction: payslip.deduction,
      status: payslip.status
    });
  };
  
  const handleSave = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, editedData);
      if (response.data.success) {
        setPayslips(prevPayslips => 
          prevPayslips.map(payslip => 
            payslip._id === id ? response.data.data : payslip
          )
        );
        setFilteredPayslips(prevFiltered => 
          prevFiltered.map(payslip => 
            payslip._id === id ? response.data.data : payslip
          )
        );
        setEditingId(null);
      }
    } catch (error) {
      console.error("Save failed:", error);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPayslips(prev => prev.filter(payslip => payslip._id !== id));
      setFilteredPayslips(prev => prev.filter(payslip => payslip._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };


  return (
    <div className="payslip-dashboard">
      <div className="header">
        <h2>Payslip Management</h2>
        <div className="actions">
          <input
            type="text"
            placeholder="Search..."
            value={filterText}
            onChange={handleFilter}
            className="search-bar"
          />
          <button className="filter-btn" onClick={toggleFilterModal}>
            <FaFilter /> Filter
          </button>
          <button className="create-btn" onClick={toggleCreatePopup}>
            <FaPlus /> Create New
          </button>
        </div>
      </div>

      {selectedRows.length > 0 && (
        <div className="selected-actions-row">
          <button onClick={() => setSelectedRows([])}>
            <FaTimes /> Unselect All
          </button>
          <button onClick={handleDeleteSelected}>
            <FaTrash /> Delete Selected
          </button>
        </div>
      )}

      {isCreatePopupOpen && (
        <div className="modal-overlay">
          <div className="create-popup">
            <div className="create-popup-content">
              <h3>Create New Payslip</h3>
              <div className="form-row">
                <label>Employee Name</label>
                <input
                  type="text"
                  value={newPayslip.employee}
                  onChange={(e) =>
                    handleNewPayslipChange("employee", e.target.value)
                  }
                  required
                />
              </div>
              <div className="form-row">
                <label>Start Date</label>
                <DatePicker
                  selected={newPayslip.startDate}
                  onChange={(date) => handleNewPayslipChange("startDate", date)}
                  dateFormat="dd/MM/yyyy"
                  required
                />
              </div>
              <div className="form-row">
                <label>End Date</label>
                <DatePicker
                  selected={newPayslip.endDate}
                  onChange={(date) => handleNewPayslipChange("endDate", date)}
                  dateFormat="dd/MM/yyyy"
                  required
                />
              </div>
              <div className="form-row">
                <label>Gross Pay</label>
                <input
                  type="number"
                  value={newPayslip.grossPay}
                  onChange={(e) =>
                    handleNewPayslipChange("grossPay", e.target.value)
                  }
                  required
                />
              </div>
              <div className="form-row">
                <label>Deduction</label>
                <input
                  type="number"
                  value={newPayslip.deduction}
                  onChange={(e) =>
                    handleNewPayslipChange("deduction", e.target.value)
                  }
                />
              </div>
              <div className="form-row">
                <label>Batch</label>
                <input
                  type="text"
                  value={newPayslip.batch}
                  onChange={(e) =>
                    handleNewPayslipChange("batch", e.target.value)
                  }
                />
              </div>
              <div className="form-row">
                <label>Status</label>
                <select
                  value={newPayslip.status}
                  onChange={(e) =>
                    handleNewPayslipChange("status", e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div className="form-actions" >
                <button onClick={saveNewPayslip}>Save</button>
                <button onClick={toggleCreatePopup}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isFilterPopupOpen && (
        <div className="modal-overlay">
          <div className="filter-modal">
            <div className="filter-modal-content">
              <h3>Filter Payslips</h3>
              <div className="filter-section">
                <div className="form-row">
                  <label>Start Date Range</label>
                  <DatePicker
                    selected={filterCriteria.startDate}
                    onChange={(date) => handleFilterChange("startDate", date)}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div className="form-row">
                  <label>End Date Range</label>
                  <DatePicker
                    selected={filterCriteria.endDate}
                    onChange={(date) => handleFilterChange("endDate", date)}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div className="form-row">
                  <label>Status</label>
                  <select
                    value={filterCriteria.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Gross Pay Range</label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filterCriteria.grossPayGreaterOrEqual}
                    onChange={(e) =>
                      handleFilterChange(
                        "grossPayGreaterOrEqual",
                        e.target.value
                      )
                    }
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filterCriteria.grossPayLessThan}
                    onChange={(e) =>
                      handleFilterChange("grossPayLessThan", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="filter-actions">
                <button onClick={applyFilters}>Apply Filters</button>
                <button onClick={toggleFilterModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <table className="payslip-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
              />
            </th>
            <th>Employee</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Batch</th>
            <th>Gross Pay</th>
            <th>Deduction</th>
            <th>Net Pay</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayslips.map((payslip) => (
            <tr key={payslip._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(payslip._id)}
                  onChange={() => handleRowSelect(payslip._id)}
                />
              </td>
              <td>{payslip.employee}</td>
              <td>{new Date(payslip.startDate).toLocaleDateString()}</td>
              <td>{new Date(payslip.endDate).toLocaleDateString()}</td>
              <td>{payslip.batch}</td>
              <td>ETB {payslip.grossPay.toFixed(2)}</td>
              <td>ETB {payslip.deduction.toFixed(2)}</td>
              <td>ETB {payslip.netPay.toFixed(2)}</td>
              <td>
                <span className={`status-badge ${payslip.status}`}>
                  {payslip.status}
                </span>
              </td>

<td>
            <div className="action-buttons">
              {editingId === payslip._id ? (
                <button 
                  className="table-action-save-button"
                  onClick={() => handleSave(payslip._id)}
                >
                  <FaSave /> 
                </button>
              ) : (
                <button 
                  className="table-action-edit-button"
                  onClick={() => handleEdit(payslip)}
                >
                  <FaEdit /> 
                </button>
              )}
              <button 
                className="table-action-del-button"
                onClick={() => handleDelete(payslip._id)}
              >
                <FaTrash />  
              </button>
            </div>
          </td>


            </tr>
          ))}
        </tbody>
      </table>

      {filteredPayslips.length === 0 && (
        <div className="no-data">
          <p>No payslips found</p>
        </div>
      )}

      <div className="pagination">
        {/* Pagination implementation can be added here */}
      </div>
    </div>
  );
};

export default Payslips;
