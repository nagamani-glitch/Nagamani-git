import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { IoFilterOutline } from "react-icons/io5";
import axios from "axios";
//import "./CreateDeduction.css";s

const CreateDeduction = ({ onClose, editData, onUpdate }) => {
  const [isTaxable, setIsTaxable] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [isConditionBased, setIsConditionBased] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [filterText, setFilterText] = useState(""); // State for filtering input
  const [showFilterModal, setShowFilterModal] = useState(false); // State for modal visibility
  const [includeAllActive, setIncludeAllActive] = useState(false);

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

  // Initialize state with edit data if available
  // const [formData, setFormData] = useState({
  //   title: editData?.name || "",
  //   oneTimeDate: editData?.oneTimeDeduction || "",
  //   amount: editData?.amount || "",
  //   isTaxable: editData?.taxable === "Yes",
  //   isFixed: editData?.fixed || false,
  //   isConditionBased: editData?.isConditionBased || false,
  //   selectedEmployees: editData?.specificEmployees || [],
  // });

  // Filter employee data based on the search input
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(filterText.toLowerCase()) ||
      employee.role.toLowerCase().includes(filterText.toLowerCase())
  );

  // Extract initials from the employee name
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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

  const validateForm = () => {
    const title = document.querySelector(
      "input[placeholder='Enter title']"
    ).value;
    const amount = document.querySelector("input[type='number']").value;

    if (!title || !amount) {
      alert("Please fill all required fields");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const formData = {
      code: document.querySelector("input[placeholder='Enter title']").value,
      name: document.querySelector("input[placeholder='Enter title']").value,
      amount: Number(document.querySelector("input[type='number']").value),
      taxable: isTaxable ? "Yes" : "No",
      fixed: isFixed,
      oneTimeDeduction: document.querySelector("input[type='date']").value
        ? "Yes"
        : "No",
      specificEmployees: selectedEmployee,
      employerRate: "6.25% of Gross Pay",
      employeeRate: "7.75% of Gross Pay",
    };

    try {
      if (editData) {
        const response = await axios.put(
          `http://localhost:5000/api/deductions/${editData._id}`,
          formData
        );
        console.log("Deduction updated:", response.data);
        alert("Deduction updated successfully!");
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/deductions",
          formData
        );
        console.log("Deduction created:", response.data);
        alert("Deduction created successfully!");
      }
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("Please fill all required fields");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        border: "1px solid red",
        width: "100%",
        maxWidth: "1200px",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "24px",
            color: "#333",
            marginBottom: "15px",
          }}
        >
          {editData ? "Edit Deduction" : "Create Deduction"}
        </h2>
      </div>
      <hr />
      <form>
        
        {/* Title and One-time date in one row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Title <span>*</span>
              <FaInfoCircle
                className="info-icon"
                title="Title of the deduction"
              />
            </label>
            <input
              type="text"
              placeholder="Enter title"
              required
              style={{
                padding: "10px 12px",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                fontSize: "14px",
                width: "100%",
                transition: "border-color 0.2s",
                ":hover": {
                  borderColor: "#007bff",
                },
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              One-time date
              <FaInfoCircle
                className="info-icon"
                title="The one-time deduction in which the deduction will apply to payslips if the date is within the payslip period"
              />
            </label>
            <input
              type="date"
              style={{
                padding: "10px 12px",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                fontSize: "14px",
                width: "100%",
                transition: "border-color 0.2s",
                ":hover": {
                  borderColor: "#007bff",
                },
              }}
            />
          </div>
        </div>

        {/* Include all active employees and Specific Employees */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Include all active employees
              <FaInfoCircle
                className="info-icon"
                title="Target deduction to all active employees in the company"
              />
            </label>

            {/* // For "Include all active employees" toggle */}
            <label
              style={{
                position: "relative",
                display: "inline-block",
                width: "40px",
                height: "20px",
              }}
            >
              <input
                type="checkbox"
                checked={includeAllActive}
                onChange={() => setIncludeAllActive(!includeAllActive)}
                style={{
                  opacity: 0,
                  width: 0,
                  height: 0,
                  margin: 0,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: includeAllActive ? "#FF8C00" : "#808080",
                  transition: "all 0.3s ease",
                  borderRadius: "20px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    content: '""',
                    height: "16px",
                    width: "16px",
                    left: includeAllActive ? "22px" : "2px",
                    top: "2px",
                    backgroundColor: "#ffffff",
                    transition: "all 0.3s ease",
                    borderRadius: "50%",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </label>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Specific Employees *
            </label>

            {/* Select employees as shown tags */}
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                minHeight: "40px",
                padding: "5px",
                display: "flex",
                flexWrap: "wrap",
                gap: "5px",
              }}
            >
              {selectedEmployee.map((employeeName) => (
                <div
                  key={employeeName}
                  //className="tag"
                  style={{
                    backgroundColor: "#f0f0f0",
                    padding: "6px 12px",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                  }}
                >
                  {employeeName}
                  <span
                    //  className="remove-tag"
                    onClick={() => handleRemoveEmployee(employeeName)}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>

            <select
              style={{
                padding: "10px 12px",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                fontSize: "14px",
                width: "100%",
                backgroundColor: "#fff",
              }}
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
            <div
              //  className="filter-icons"
              onClick={() => setShowFilterModal(true)}
            >
              {[...Array(1)].map((_, i) => (
                <IoFilterOutline key={i} className="small-filter-icon" />
              ))}{" "}
              <span className="filter-span">Filter</span>
            </div>
            {/* Display Avatar with initials below the dropdown */}

            {selectedEmployee.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "0px", // Adds horizontal spacing between avatars
                  flexWrap: "wrap", // Allows wrapping to next line if needed
                }}
              >
                {selectedEmployee.map((employeeName) => (
                  <div
                    key={employeeName}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#007bff",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      marginRight: "8px", // Additional spacing between circles
                      marginBottom: "8px", // Spacing when wrapped to next line
                    }}
                  >
                    <span
                    // className="avatar-text"
                    >
                      {getInitials(employeeName)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Popup */}
        {showFilterModal && (
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              border: "1px solid red",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "24px",
                borderRadius: "12px",
                width: "90%",
                maxWidth: "600px",
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              <h3>Specific Employees</h3>
              <button onClick={() => setShowFilterModal(false)}>&times;</button>
              <input
                type="text"
                placeholder="Search..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                // className="search-create-deduction"
                style={{
                  padding: "10px 12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  fontSize: "14px",
                  width: "100%",
                  transition: "border-color 0.2s",
                  ":hover": {
                    borderColor: "#007bff",
                  },
                }}
              />

              <div
              //className="employee-list"
              >
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    //className="employee-item"
                  >
                    <span
                      //  className="avatar"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {getInitials(employee.name)}
                    </span>
                    <span>
                      {employee.name} - {employee.role}
                    </span>
                    <button
                      // className="add-employee"
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "20px",
          }}
        >
          <div
            // className="form-group"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Is tax
              <FaInfoCircle
                className="info-icon"
                title="The specify the deduction is tax or normal deduction "
              />
            </label>

            <label
              style={{
                position: "relative",
                display: "inline-block",
                width: "40px",
                height: "20px",
              }}
            >
              <input
                type="checkbox"
                checked={isTaxable}
                onChange={() => setIsTaxable(!isTaxable)}
                style={{
                  opacity: 0,
                  width: 0,
                  height: 0,
                  margin: 0,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: isTaxable ? "#FF8C00" : "#808080",
                  transition: "all 0.3s ease",
                  borderRadius: "20px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    content: '""',
                    height: "16px",
                    width: "16px",
                    left: isTaxable ? "22px" : "2px",
                    top: "2px",
                    backgroundColor: "#ffffff",
                    transition: "all 0.3s ease",
                    borderRadius: "50%",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </label>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Is condition based
              <FaInfoCircle
                className="info-icon"
                title="The filled is used to target deduction to the specific employees when the conditions satisfied with the employee's information"
              />
            </label>

            <label
              style={{
                position: "relative",
                display: "inline-block",
                width: "40px",
                height: "20px",
              }}
            >
              <input
                type="checkbox"
                checked={isConditionBased}
                onChange={() => setIsConditionBased(!isConditionBased)}
                style={{
                  opacity: 0,
                  width: 0,
                  height: 0,
                  margin: 0,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: isConditionBased ? "#FF8C00" : "#808080",
                  transition: "all 0.3s ease",
                  borderRadius: "20px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    content: '""',
                    height: "16px",
                    width: "16px",
                    left: isConditionBased ? "22px" : "2px",
                    top: "2px",
                    backgroundColor: "#ffffff",
                    transition: "all 0.3s ease",
                    borderRadius: "50%",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </label>
          </div>
        </div>

        {/* Is fixed and Amount */}
        <div
          // className="form-row"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "20px",
          }}
        >
          <div
            // className="form-group"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Is fixed
              <FaInfoCircle
                className="info-icon"
                title="Specify if the allowance is fixed or not"
              />
            </label>
            <label
              className="toggle-switch"
              style={{
                position: "relative",
                display: "inline-block",
                width: "40px",
                height: "20px",
              }}
            >
              <input
                type="checkbox"
                checked={isFixed}
                onChange={() => setIsFixed(!isFixed)}
                style={{
                  opacity: 0,
                  width: 0,
                  height: 0,
                  margin: 0,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: isFixed ? "#FF8C00" : "#808080", // Changed from isTaxable to isFixed
                  transition: "all 0.3s ease",
                  borderRadius: "20px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    content: '""',
                    height: "16px",
                    width: "16px",
                    left: isFixed ? "22px" : "2px", // Changed from isTaxable to isFixed
                    top: "2px",
                    backgroundColor: "#ffffff",
                    transition: "all 0.3s ease",
                    borderRadius: "50%",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </label>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Amount
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              required
              className="input"
              style={{
                padding: "10px 12px",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                fontSize: "14px",
                width: "100%",
                transition: "border-color 0.2s",
                ":hover": {
                  borderColor: "#007bff",
                },
              }}
            />
          </div>
        </div>

        {/* If choice and If condition */}
        <div
          // className="form-row"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "20px",
          }}
        >
          <div
            // className="form-group"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              If choice <span>*</span>
              <FaInfoCircle
                className="info-icon"
                title="The pay head for the if condition"
              />
            </label>
            <select
              required
              style={{
                padding: "10px 12px",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                fontSize: "14px",
                width: "100%",
                backgroundColor: "#fff",
              }}
            >
              <option>Basic Pay</option>
              <option>Gross Pay</option>
            </select>
          </div>
          <div
            // className="form-group"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              If condition <span>*</span>
              <FaInfoCircle
                className="info-icon"
                title="Apply if the pay-head conditions satisfy"
              />
            </label>
            <select
              required
              // className="condition-options"
              style={{
                padding: "10px 12px",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                fontSize: "14px",
                width: "100%",
                backgroundColor: "#fff",
              }}
            >
              <option>Equal (==)</option>
              <option>Not Equal (!=)</option>
              <option>Greater Than({">"})</option>
              <option>Less Than or Equal To ({"<="})</option>
              <option>Less Than or Equal To ({">="})</option>
            </select>
          </div>
        </div>

        {/* If amount and Save button */}
        <div
          // className="form-row"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "20px",
          }}
        >
          <div
            //  className="form-group "
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              If amount <span>*</span>
              <FaInfoCircle
                className="info-icon"
                title="The amount of the pay-head"
              />
            </label>
            <input
              type="number"
              placeholder="0.0"
              required
              style={{
                padding: "10px 12px",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                fontSize: "14px",
                width: "100%",
                transition: "border-color 0.2s",
                ":hover": {
                  borderColor: "#007bff",
                },
              }}
            />
          </div>

          <div
            //  className="form-group"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Update compensation <span>*</span>
              <FaInfoCircle
                className="info-icon"
                title="Update compensation is used to update pay-head before any other deduction calculation starts"
              />
            </label>
            <select
              required
              style={{
                padding: "10px 12px",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                fontSize: "14px",
                width: "100%",
                backgroundColor: "#fff",
              }}
            >
              <option>Basic Pay</option>
              <option>Gross Pay</option>
              <option>Net Pay</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "6px",
              border: "none",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s",
              ":hover": {
                backgroundColor: "#0056b3",
              },
            }}
          >
            {editData ? "Update" : "Save"}
          </button>
        </div>
      </form>

      {showFilterModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          x
          djiik
        >
          <div
            // className="modal-content"
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <h3>Specific Employees</h3>
            <button
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "transparent",
                border: "none",
                fontSize: "24px",
                fontWeight: "bold",
                cursor: "pointer",
                zIndex: 1001,
                color: "#333",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
              onClick={() => setShowFilterModal(false)}
            >
              &times;
            </button>

            <input
              type="text"
              placeholder="Search....."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              // className="filter-create-search-bar"
              style={{
                padding: "10px 12px",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                fontSize: "14px",
                width: "100%",
                transition: "border-color 0.2s",
                ":hover": {
                  borderColor: "#007bff",
                },
              }}
            />
            <div
              //className="employee-list"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginTop: "16px",
              }}
            >
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  //className="employee-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                    transition: "transform 0.2s ease",
                    cursor: "pointer",
                    ":hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px", // Adds spacing between the avatar and text
                      flexWrap: "wrap", // Allows the avatar and text to wrap onto a new line if needed
                    }}
                  >
                    <span
                      //className="avatar"
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "30px",
                        height: "30px",
                        backgroundColor: "#b5b0b0",
                        borderRadius: "50%",
                        fontSize: "13px",
                        fontWeight: "bold",
                        color: "#ffffff",
                        textTransform: "uppercase",
                        border: "2px solid #ccc",
                      }}
                    >
                      {getInitials(employee.name)}
                    </span>
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: "500",
                        color: "#212529",
                      }}
                    >
                      {employee.name} - {employee.role}
                    </span>
                  </div>

                  <button
                    //  className="add-employee"
                    onClick={() => handleEmployeeSelect(employee.name)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      ":hover": {
                        backgroundColor: "#0056b3",
                      },
                    }}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    // </div>
  );
};

export default CreateDeduction;
