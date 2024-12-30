import React, { useState} from 'react';
import { FaTrash, FaEnvelope, FaFilter, FaPlus, FaDownload, FaTimes } from 'react-icons/fa';
import './Payslips.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Payslips = ({data} = []) => {
    const [payslips, setPayslips] = useState([
        { id: 1, employee: 'Adam Luis', startDate: '11/06/2024', endDate: '30/09/2024', batch: 'None', grossPay: 'ETB 2394345.33', deduction: 'ETB 166407.00', netPay: 'ETB 2227938.33' },
        { id: 2, employee: 'Sofia Howard (#PEP75)', startDate: '11/05/2021', endDate: '12/09/2024', batch: 'None', grossPay: 'ETB 12378.67', deduction: 'ETB 0.00', netPay: 'ETB 18345.67' },
        { id: 3, employee: 'John Deopha (#PEP45)', startDate: '26/06/2000', endDate: '19/04/2022', batch: 'None', grossPay: 'ETB 145674.77', deduction: 'ETB 0.00', netPay: 'ETB 12345.67' },
        { id: 4, employee: 'Herry Potter (#PEP66)', startDate: '02/12/2016', endDate: '07/03/2021', batch: 'None', grossPay: 'ETB 232133.97', deduction: 'ETB 0.00', netPay: 'ETB 67890.67' },
        // Add more data as needed
    ]);

    const [showFilterModal] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState({
        startDate: '',  //
        endDate: '', //
        status: '',
        batch: '',
        mailSent: '',
        startDateFrom: '',  //
        startDateTill: '',  //
        endDateFrom: '',     //
        endDateTill: '',      // 
        grossPayLessThan: '',
        grossPayGreaterOrEqual: '',
        deductionLessThan: '',
        deductionGreaterOrEqual: '',
        netPayLessThan: '',
        netPayGreaterOrEqual: '',
    });

    const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);  //

    const toggleFilterModal = () => {
        setIsFilterPopupOpen(!isFilterPopupOpen);
    };

    const handleDateChange = (field, date) => {
        setFilterCriteria(prev => ({ ...prev, [field]: date }));
    };

    const [selectedPayslips] = useState([]);
    const [filterText, setFilterText] = useState('');

    const handleSelectAll = () => {
      if (isAllSelected) {
        setSelectedRows([]);
        setIsAllSelected(false);
    } else {
        const allIds = filteredPayslips.map(payslip => payslip.id);
        setSelectedRows(allIds);
        setIsAllSelected(true);
    }
    };

    // Handle individual row selection
    const handleRowSelect = (id) => {
      const isSelected = selectedRows.includes(id);
      let newSelectedRows;
  
      if (isSelected) {
          // If already selected, deselect it
          newSelectedRows = selectedRows.filter(rowId => rowId !== id);
      } else {
          // If not selected, add it to selected rows
          newSelectedRows = [...selectedRows, id];
      }
  
      setSelectedRows(newSelectedRows);
      setIsAllSelected(newSelectedRows.length === filteredPayslips.length); // Update 'Select All' status
  };

  // Unselect all rows
  const handleUnselectAll = () => {
      setSelectedRows([]);
      setIsAllSelected(false);
  };

  // Delete selected rows
  const handleDeleteSelected = () => {
      const remainingPayslips = filteredPayslips.filter(payslip => !selectedRows.includes(payslip.id));
      setFilteredPayslips(remainingPayslips);
      setSelectedRows([]);
      setIsAllSelected(false);
  };

  // Export selected rows (for simplicity, log selected data)
  const handleExportSelected = () => {
      const exportData = filteredPayslips.filter(payslip => selectedRows.includes(payslip.id));
      console.log("Exporting data:", exportData); // Replace with actual export logic
      alert("Export data logged to console.");
  };


    const handleFilter = (e) => {
        const text = e.target.value
        setFilterText(text)

        const filteredData = payslips.filter(payslip =>
            payslip.employee.toLowerCase().includes(text.toLowerCase()) ||
            payslip.batch.toLowerCase().includes(text.toLowerCase()) ||
            payslip.grossPay.toLowerCase().includes(text.toLowerCase()) ||
            payslip.deduction.toLowerCase().includes(text.toLowerCase()) ||
            payslip.netPay.toLowerCase().includes(text.toLowerCase())
        );

        setFilteredPayslips(filteredData);
    };
   

    const [filteredPayslips, setFilteredPayslips] = useState(payslips); // For storing filtered data
    const [selectedRows, setSelectedRows] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);

    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
const [newPayslip, setNewPayslip] = useState({
    employee: '',
    startDate: '',
    endDate: '',
    grossPay: '',
    deduction: '',
    netPay: ''
});


const toggleCreatePopup = () => {
  setIsCreatePopupOpen(!isCreatePopupOpen);
  setNewPayslip({ employee: '', startDate: '', endDate: '', grossPay: '', deduction: '', netPay: '' }); // Reset form fields
};


const handleNewPayslipChange = (field, value) => {
  setNewPayslip(prev => ({ ...prev, [field]: value }));
};

const saveNewPayslip = () => {
  setPayslips(prevPayslips => [
      ...prevPayslips, 
      { 
          ...newPayslip, 
          id: prevPayslips.length + 1 // Assuming id is sequential
      }
  ]);
  
  // Close the popup after saving
  toggleCreatePopup();
};



const applyFilters = () => {
    let updatedData = [...payslips]; // Use payslips as the base data for filtering

    // Ensure dates are in the correct format before comparison
    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split("/").map(Number);
        return new Date(year, month - 1, day);
    };

    if (filterCriteria.startDate) {
        updatedData = updatedData.filter(item => parseDate(item.startDate) >= filterCriteria.startDate);
    }
    if (filterCriteria.endDate) {
        updatedData = updatedData.filter(item => parseDate(item.endDate) <= filterCriteria.endDate);
    }
    if (filterCriteria.startDateFrom) {
        updatedData = updatedData.filter(item => parseDate(item.startDate) >= filterCriteria.startDateFrom);
    }
    if (filterCriteria.startDateTill) {
        updatedData = updatedData.filter(item => parseDate(item.startDate) <= filterCriteria.startDateTill);
    }
    if (filterCriteria.endDateFrom) {
        updatedData = updatedData.filter(item => parseDate(item.endDate) >= filterCriteria.endDateFrom);
    }
    if (filterCriteria.endDateTill) {
        updatedData = updatedData.filter(item => parseDate(item.endDate) <= filterCriteria.endDateTill);
    }

    // Additional filters for other fields
    if (filterCriteria.status) {
        updatedData = updatedData.filter(item => item.status === filterCriteria.status);
    }
    if (filterCriteria.batch) {
        updatedData = updatedData.filter(item => item.batch === filterCriteria.batch);
    }
    if (filterCriteria.mailSent) {
        updatedData = updatedData.filter(item => item.mailSent === filterCriteria.mailSent);
    }
    if (filterCriteria.grossPayLessThan) {
        updatedData = updatedData.filter(item => parseFloat(item.grossPay.replace('ETB ', '')) <= parseFloat(filterCriteria.grossPayLessThan));
    }
    if (filterCriteria.grossPayGreaterOrEqual) {
        updatedData = updatedData.filter(item => parseFloat(item.grossPay.replace('ETB ', '')) >= parseFloat(filterCriteria.grossPayGreaterOrEqual));
    }
    if (filterCriteria.deductionLessThan) {
        updatedData = updatedData.filter(item => parseFloat(item.deduction.replace('ETB ', '')) <= parseFloat(filterCriteria.deductionLessThan));
    }
    if (filterCriteria.deductionGreaterOrEqual) {
        updatedData = updatedData.filter(item => parseFloat(item.deduction.replace('ETB ', '')) >= parseFloat(filterCriteria.deductionGreaterOrEqual));
    }
    if (filterCriteria.netPayLessThan) {
        updatedData = updatedData.filter(item => parseFloat(item.netPay.replace('ETB ', '')) <= parseFloat(filterCriteria.netPayLessThan));
    }
    if (filterCriteria.netPayGreaterOrEqual) {
        updatedData = updatedData.filter(item => parseFloat(item.netPay.replace('ETB ', '')) >= parseFloat(filterCriteria.netPayGreaterOrEqual));
    }

    setFilteredPayslips(updatedData); // Update filtered data state
    setIsFilterPopupOpen(false);  // Close the filter popup
};


  const resetFilters = () => {
    setFilterCriteria({
      startDate: '',
      endDate: '',
      status: '',
      batch: '',
      mailSent: '',
      startDateFrom: '',
      startDateTill: '',
      endDateFrom: '',
      endDateTill: '',
      grossPayLessThan: '',
      grossPayGreaterOrEqual: '',
      deductionLessThan: '',
      deductionGreaterOrEqual: '',
      netPayLessThan: '',
      netPayGreaterOrEqual: '',
    });
  //  setShowFilterModal(payslips);
    //toggleFilterModal()
    setFilteredPayslips(payslips); // Reset to original payslips data
    setIsFilterPopupOpen(false); // Close the modal
};

    return (
        <div className="payslip-dashboard">
            <div className="header">
                <h2>Payslip</h2>
                <div className="actions">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        value={filterText} 
                        onChange={handleFilter} 
                        className="search-bar"
                    />
                    <button className="filter-btn" onClick={toggleFilterModal}>
                        <FaFilter /> Filter
                    </button>
                    <button className="group-by-btn">Group By</button>
                    <button className="actions-btn">Actions</button>
                    <button className="create-btn" onClick={toggleCreatePopup}>
                        <FaPlus /> Create
                    </button>
                </div>

    {/* List of Payslips */}
   
            
{/* Create Payslip Popup */}
{isCreatePopupOpen && (
    <div className="create-popup">
        <div className="create-popup-content">
            <h3>Create Payslip</h3>
      <hr/>
            {/* Employee Name */}
            <div className="form-row">
                <label>Employee</label>
                <input 
                    type="text" 
                    value={newPayslip.employee} 
                    onChange={(e) => handleNewPayslipChange('employee', e.target.value)} 
                />
            </div>

            {/* Start Date and End Date */}
            <div className="form-row">
                <label>Start Date</label>
                <DatePicker
                    selected={newPayslip.startDate}
                    onChange={(date) => handleNewPayslipChange('startDate', date)}
                    dateFormat="dd-MM-yyyy"
                />
            </div>
            <div className="form-row">
                <label>End Date</label>
                <DatePicker
                    selected={newPayslip.endDate}
                    onChange={(date) => handleNewPayslipChange('endDate', date)}
                    dateFormat="dd-MM-yyyy"
                />
            </div>

            {/* Save Button */}
            <div style={{display: "flex"}}>
            <button className="save-btn" onClick={saveNewPayslip}>Save</button>
            <button className="cancel-btn" onClick={toggleCreatePopup}>Cancel</button>
        </div>
        </div>
    </div>
)}


            </div>


            {/* Actions Row for Selected Items */}
            {selectedRows.length > 0 && (
                <div className="selected-actions-row">
                    <button className="unselect-all" onClick={handleUnselectAll}>
                        <FaTimes /> Unselect All
                    </button>
                    <button className="export-btn" onClick={handleExportSelected}>
                        <FaDownload /> Export
                    </button>
                    <button className="delete-btn" onClick={handleDeleteSelected}>
                        <FaTrash /> Delete
                    </button>
                </div>
            )}

             
{/* Filter Modal */}
{isFilterPopupOpen && (
                <div className="filter-modal">
                    <div className="filter-modal-content">
                        <h3>Filter Payslips</h3>

                        {/* Filter Section */}
                        <div className="filter-section">
                            <div className="form-row">
                                <label>Start Date
                                <DatePicker
                                    selected={filterCriteria.startDate}
                                    onChange={(date) => handleDateChange('startDate', date)}
                                    dateFormat="dd-MM-yyyy"
                                />
                                </label>
                                <label>End Date
                                <DatePicker
                                    selected={filterCriteria.endDate}
                                    onChange={(date) => handleDateChange('endDate', date)}
                                    dateFormat="dd-MM-yyyy"
                                />
                                </label>
                            </div>
                            <div className="form-row">
                                <label>Status</label>
                                <select value={filterCriteria.status} onChange={(e) => setFilterCriteria({ ...filterCriteria, status: e.target.value })}>
                                    <option value="">-------</option>
                                    <option value="paid">Paid</option>
                                    <option value="confirmed">Confirmed</option>
                                    {/* Other statuses */}
                                </select>
                                <label>Batch</label>
                                <input type="text" value={filterCriteria.batch} onChange={(e) => setFilterCriteria({ ...filterCriteria, batch: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <label>Mail Sent</label>
                                <select value={filterCriteria.mailSent} onChange={(e) => setFilterCriteria({ ...filterCriteria, mailSent: e.target.value })}>
                                    <option value="">Unknown</option>
                                    <option value="sent">Mail Sent</option>
                                    <option value="not-sent">Mail Not Sent</option>
                                </select>
                                
                            </div>
                        </div>

                        {/* Advanced Filter Section */}
                        <div className="filter-section-advanced">
                            <h4>Advanced</h4>
                            <div className="form-row">
                                <label>Start Date From
                                <DatePicker
                                    selected={filterCriteria.startDateFrom}
                                    onChange={(date) => handleDateChange('startDateFrom', date)}
                                    dateFormat="dd-MM-yyyy"
                                />
                                </label>
                                <label>Start Date Till
                                <DatePicker
                                    selected={filterCriteria.startDateTill}
                                    onChange={(date) => handleDateChange('startDateTill', date)}
                                    dateFormat="dd-MM-yyyy"
                                />
                                </label>
                            </div>
                            <div className="form-row">
                                <label>End Date From
                                <DatePicker
                                    selected={filterCriteria.endDateFrom}
                                    onChange={(date) => handleDateChange('endDateFrom', date)}
                                    dateFormat="dd-MM-yyyy"
                                />
                                </label>
                                <label>End Date Till
                                <DatePicker
                                    selected={filterCriteria.endDateTill}
                                    onChange={(date) => handleDateChange('endDateTill', date)}
                                    dateFormat="dd-MM-yyyy"
                                />
                                </label>
                            </div>
                            <div className="form-row">
                                <label>Gross Pay Less Than or Equal
                                <input type="number" value={filterCriteria.grossPayLessThan} onChange={(e) => setFilterCriteria({ ...filterCriteria, grossPayLessThan: e.target.value })} />
                                </label>
                                <label>Gross Pay Greater or Equal
                                <input type="number" value={filterCriteria.grossPayGreaterOrEqual} onChange={(e) => setFilterCriteria({ ...filterCriteria, grossPayGreaterOrEqual: e.target.value })} />
                                </label>
                            </div>
                            <div className="form-row">
                                <label>Deduction Less Than or Equal
                                <input type="number" value={filterCriteria.deductionLessThan} onChange={(e) => setFilterCriteria({ ...filterCriteria, deductionLessThan: e.target.value })} />
                                </label>
                                <label>Deduction Greater or Equal
                                <input type="number" value={filterCriteria.deductionGreaterOrEqual} onChange={(e) => setFilterCriteria({ ...filterCriteria, deductionGreaterOrEqual: e.target.value })} />
                                </label>
                            </div>
                            <div className="form-row">
                                <label>Net Pay Less Than or Equal
                                <input type="number" value={filterCriteria.netPayLessThan} onChange={(e) => setFilterCriteria({ ...filterCriteria, netPayLessThan: e.target.value })} />
                                </label>
                                <label>Net Pay Greater or Equal
                                <input type="number" value={filterCriteria.netPayGreaterOrEqual} onChange={(e) => setFilterCriteria({ ...filterCriteria, netPayGreaterOrEqual: e.target.value })} />
                                </label>
                            </div>
                        </div>

                        <button className="apply-btn" onClick={applyFilters}>Apply Filters</button>
                        <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
                    </div>
                </div>
            )}

            {/* Filtered Data Display */}
            <div className="filtered-data">
                {showFilterModal && showFilterModal.length > 0 ? (
                    showFilterModal.map(item => (
                        <div key={item.id} className="data-item" >
                            <p>{item.employeeName}</p>
                            <p>{item.startDate}</p>
                            <p>{item.endDate}</p>
                            {/* Other fields as necessary */}
                        </div>
                    ))
                ) : (
                    <p>No data available</p>
                )}
            </div>

            <table className="payslip-table">
                <thead>
                    <tr>
                        <th>
                            <input 
                                type="checkbox" 
                                checked={selectedPayslips.length === payslips.length} 
                                onChange={handleSelectAll}
                            /> Select All
                        </th>
                        <th>Employee</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Batch</th>
                        <th>Gross Pay</th>
                        <th>Deduction</th>
                        <th>Net Pay</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                  {filteredPayslips.length > 0? (
                    filteredPayslips.map(payslip => (
                        <tr key={payslip.id} className={selectedRows.includes(payslip.id) ? "selected" : ""}>
                            <td>
                                <input 
                                    type="checkbox" 
                                    checked={selectedRows.includes(payslip.id)} 
                                    onChange={() => handleRowSelect(payslip.id)} 
                                />
                            </td>
                            <td>{payslip.employee}</td>
                            <td>{payslip.startDate}</td>
                            <td>{payslip.endDate}</td>
                            <td>{payslip.batch}</td>
                            <td>{payslip.grossPay}</td>
                            <td>{payslip.deduction}</td>
                            <td>{payslip.netPay}</td>
                            <td>
                                <button className="action-btn"><FaEnvelope /></button>
                                <button className="action-btn"><FaTrash /></button>
                            </td>
                        </tr>
                    ))
                  ): (
                    <td colSpan= "9">No data available</td>
                  )}
                </tbody>
            </table>
            <div className="pagination">
                <span>Page 1 of 1</span>
            </div>


        </div>
    );
};

export default Payslips;