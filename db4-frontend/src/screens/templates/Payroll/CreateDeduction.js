import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { IoFilterOutline } from "react-icons/io5";
import './CreateDeduction.css'


const CreateDeduction = () => {
  const [isTaxable, setIsTaxable] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [isConditionBased, setIsConditionBased] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [filterText, setFilterText] = useState(""); // State for filtering input
  const [showFilterModal, setShowFilterModal] = useState(false); // State for modal visibility

  // Sample employee data
  const employees = [
    { id: 1, name: "John Doe", role: "Software Engineer" },
    { id: 2, name: "Jane Smith", role: "Product Manager" },
    { id: 3, name: "Mark Johnson", role: "Designer" },
    { id: 4, name: "Alice Brown", role: "HR Manager" },
    { id: 5, name: "John Sinha", role: "Bouncer" },
    { id: 6, name: "Charles babbage", role: "Developer" },
    { id: 7, name: "Ravijith Aggarwal", role: "Computer Engineer" },
  ];

  // Filter employee data based on the search input
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(filterText.toLowerCase()) ||
      employee.role.toLowerCase().includes(filterText.toLowerCase())
  );

  // Extract initials from the employee name
  const getInitials = (name) => {
    if (typeof name === "string") {
      const nameArray = name.split(" ");
      const initials = nameArray.map((part) => part[0]).join("");
      return initials.toUpperCase();
    }
    return "";
  };


  // Handle selecting an employee
  const handleEmployeeSelect = (employeeName) => {
    if (employeeName && !selectedEmployee.includes(employeeName)) {
      setSelectedEmployee([...selectedEmployee, employeeName]);
    }
  };

  // Handle removing an employee from the selection
  const handleRemoveEmployee = (employeeName) => {
    setSelectedEmployee(
      selectedEmployee.filter((name) => name !== employeeName)
    );
  };


  const handleSave = (event) => {
    event.preventDefault();
    const formData = {
      title: document.querySelector("input[placeholder='Enter title']").value,
      oneTimeDate: document.querySelector("input[type='date']").value,
      selectedEmployees: selectedEmployee,
      isTaxable,
      isFixed,
      isConditionBased,
      amount: document.querySelector("input[type='number']").value,
    };

    console.log("Form Data:", formData);
    alert("Form data saved successfully!");
  };


  return (
    <div className="main-container">
      <div className="create-allowance-container">
        <h2>Deduction </h2>
        <hr />
        <form>
          {/* Title and One-time date in one row */}
          <div className="form-row">
            <div className="form-group">
              <label>
                Title <span>*</span>
                <FaInfoCircle
                  className="info-icon"
                  title="Title of the deduction"
                />
              </label>
              <input type="text" placeholder="Enter title" required />
            </div>
            <div className="form-group">
              <label>
                One-time date
                <FaInfoCircle
                  className="info-icon"
                  title="The one-time deduction in which the deduction will apply to payslips if the date is within the payslip period"
                />
              </label>
              <input type="date" />
            </div>
          </div>

          {/* Include all active employees and Specific Employees */}
          <div className="form-row">
            <div className="form-group">
              <label>
                Include all active employees
                <FaInfoCircle
                  className="info-icon"
                  title="Target deduction to all active employees in the company"
                />
              </label>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
            <div className="form-group">
              <label>Specific Employees *</label>
              
              {/* Select employees as shown tags */}
                <div className="multi-select-box">
                {selectedEmployee.map((employeeName) => (
                  <div key={employeeName} className="tag">
                    {employeeName}
                    <span
                      className="remove-tag"
                      onClick={() => handleRemoveEmployee(employeeName)}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>


              <select
                value={selectedEmployee}
                onChange={(e) => handleEmployeeSelect(e.target.value)}
                required
              >
                <option value="">Select specific employees</option>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <option key={employee.id} value={employee.name}>
                      {employee.name} - {employee.role}
                    </option>
                  ))
                ) : (
                  <option>No employees found</option>
                )}
              </select>
              <div className="filter-icons" onClick={() => setShowFilterModal(true)}>
                {[...Array(1)].map((_, i) => (
                  <IoFilterOutline key={i} className="small-filter-icon" />
                ))}{" "}
                <span className="filter-span">Filter</span>
              </div>
              {/* Display Avatar with initials below the dropdown */}
              <div className="avatar-container">
                {selectedEmployee.map((employeeName) => (
                  <div key={employeeName} className="avatar">
                    <span className="avatar-text">
                      {getInitials(employeeName)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Modal Popup */}
          {showFilterModal && (
            <div className="modal">
              <div className="modal-content">
                <h3>Specific Employees</h3>
                <button className="close-modal" onClick={() => setShowFilterModal(false)}>
                  &times;
                </button>
                <input
                  type="text"
                  placeholder="Search..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="search-bar"
                />
                <div className="employee-list">
                  {filteredEmployees.map((employee) => (
                    <div key={employee.id} className="employee-item">
                      <span className="avatar">{getInitials(employee.name)}</span>
                      <span>{employee.name} - {employee.role}</span>
                      <button
                        className="add-employee"
                        onClick={() => handleEmployeeSelect(employee.name)}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}




          {/* Is taxable and Is condition based */}
          <div className="form-row">
            <div className="form-group">
              <label>
                Is tax
                <FaInfoCircle
                  className="info-icon"
                  title="The specify the deduction is tax or normal deduction "/>
              </label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isTaxable}
                  onChange={() => setIsTaxable(!isTaxable)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="form-group">
              <label>
                Is condition based
                <FaInfoCircle
                  className="info-icon"
                  title="The filled is used to target deduction to the specific employees when the conditions satisfied with the employee's information"
                />
              </label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isConditionBased}
                  onChange={() => setIsConditionBased(!isConditionBased)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          {/* Is fixed and Amount */}
          <div className="form-row">
            <div className="form-group">
              <label>
                Is fixed
                <FaInfoCircle
                  className="info-icon"
                  title="Specify if the allowance is fixed or not"
                />
              </label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isFixed}
                  onChange={() => setIsFixed(!isFixed)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                required
                className="input"
              />
            </div>
          </div>

          {/* If choice and If condition */}
          <div className="form-row">
            <div className="form-group">
              <label>
                If choice <span>*</span>
                <FaInfoCircle
                  className="info-icon"
                  title="The pay head for the if condition"
                />
              </label>
              <select required>
                <option>Basic Pay</option>
                <option>Gross Pay</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                If condition <span>*</span>
                <FaInfoCircle
                  className="info-icon"
                  title="Apply if the pay-head conditions satisfy"
                />
              </label>
              <select required className="condition-options">
                <option>Equal (==)</option>
                <option>Not Equal (!=)</option>
                <option>Greater Than({">"})</option>
                <option>Less Than or Equal To ({"<="})</option>
                <option>Less Than or Equal To ({">="})</option>
              </select>
            </div>
          </div>

          {/* If amount and Save button */}
          <div className="form-row" >
            <div className="form-group ">
              <label>
                If amount <span>*</span>
                <FaInfoCircle
                  className="info-icon"
                  title="The amount of the pay-head"
                />
              </label>
              <input type="number" placeholder="0.0" required />
            </div>


            <div className="form-group">
              <label>
                Update compensation <span>*</span>
                <FaInfoCircle
                  className="info-icon"
                  title="Update compensation is used to update pay-head before any other deduction calculation starts"
                />
              </label>
              <select required>
                <option>Basic Pay</option>
                <option>Gross Pay</option>
                <option>Net Pay</option>
              </select>
            </div>
          </div>

          <div className="form-group save-btn-container" style={{display:"flex",alignItems:"end"}}>
              <button type="button" className="save-btn" onClick={handleSave}>
                Save
              </button>
            </div>
        </form>


        {showFilterModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Specific Employees</h3>
              <button className="close-modal" onClick={() => setShowFilterModal(false)}>&times;</button>
              <input
                type="text"
                placeholder="Search..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="search-bar"
              />
              <div className="employee-list">
                {filteredEmployees.map((employee) => (
                  <div key={employee.id} className="employee-item">
                    <span className="avatar">{getInitials(employee.name)}</span>
                    <span>{employee.name} - {employee.role}</span>
                    <button className="add-employee" onClick={() => handleEmployeeSelect(employee.name)}>Add</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CreateDeduction;
