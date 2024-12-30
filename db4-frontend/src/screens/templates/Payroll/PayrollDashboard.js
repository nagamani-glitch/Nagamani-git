import React, { useState } from 'react';
import {Bar} from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import {Chart as ChartJS, ArcElement, Legend} from 'chart.js';
import './PayrollDashboard.css';

import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Register the necessary components for the chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);






const PayrollDashboard = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    employee: '',
    status: '',
    contributions: ''
  });

  const handleExportClick = () => {
    setShowForm(!showForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle export logic here
    console.log('Exporting with data:', formData);
    setShowForm(false); // Close the form after submission
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };


  // Sample data for the Employee Payslip Chart
  const payslipData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Gross Salary',
        data: [3000, 3200, 3100, 3300, 3400, 3500],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Deductions',
        data: [500, 450, 400, 480, 520, 500],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Net Salary',
        data: [2500, 2750, 2700, 2820, 2880, 3000],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  };

      // For  the Employee Contribution 

  const employees = [
    {
      name: "Ravi Singh",
      contributions: [
        { type: "ESI", employeeContribution: "PKR 0.00", employerContribution: "PKR 98.50" },
        { type: "Social Security (PICA)", employeeContribution: "PKR 0.00", employerContribution: "PKR 128.31" }
      ]
    },
    {
      name: "Hannah Brooks",
      contributions: [
        { type: "ESI", employeeContribution: "PKR 0.00", employerContribution: "PKR 27.36" },
        { type: "Social Security (PICA)", employeeContribution: "PKR 0.00", employerContribution: "PKR 128.31" }
      ]
    },
    {
      name: "John Doe",
      contributions: [
        { type: "ESI", employeeContribution: "PKR 05.00", employerContribution: "PKR 40.00" },
        { type: "Social Security (PICA)", employeeContribution: "PKR 4.5.00", employerContribution: "PKR 150.00" }
      ]
    },
    {
      name: "Subikshan RamChandran",
      contributions: [
        { type: "ESI", employeeContribution: "PKR 5.7.00", employerContribution: "PKR 350.00" },
        { type: "Social Security (PICA)", employeeContribution: "PKR 67.00", employerContribution: "PKR 200.00" }
      ]
    },
    {
      name: "Harish Adulapuram",
      contributions: [
        { type: "ESI", employeeContribution: "PKR 30.00", employerContribution: "PKR 98.00" },
        { type: "Social Security (PICA)", employeeContribution: "PKR 34.00", employerContribution: "PKR 120.00" }
      ]
    },
    {
      name: "Dineshsundar A",
      contributions: [
        { type: "ESI", employeeContribution: "PKR 77.00", employerContribution: "PKR 89.00" },
        { type: "Social Security (PICA)", employeeContribution: "PKR 88.00", employerContribution: "PKR 390.00" }
      ]
    }
    // Add more employee data here
  ];

  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]);

  const handleEmployeeChange = (event) => {
    const employee = employees.find(emp => emp.name === event.target.value);
    setSelectedEmployee(employee);
  };

  // For Department data
  const departmentData = {
    labels: ["Sales", "Engineering", "HR", "Marketing", "Finance"],
    datasets: [
      {
        label: "Employee Distribution",
        data: [30, 20, 15, 10, 25], // Example data for departments
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF"
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF"
        ]
      }
    ]
  };


  return (
    <div className="payrolls-dashboard">
      <div className="payroll-status">
        <div className="status-item">
          <h3>Paid</h3>
          <p>12</p>
        </div>
        <div className="status-item">
          <h3>Confirmed</h3>
          <p>15</p>
        </div>
        <div className="status-item">
          <h3>Review Ongoing</h3>
          <p>98</p>
        </div>
        <div className="status-item">
          <h3>Draft</h3>
          <p>30</p>
        </div>
      </div>

        {/* for calender and export payslip details */}

      <div className="row-container">
        <div className="calendar-container">
          <div className="date-selector">
          <label>Select Month and Year:</label>
          <input 
            type="month" 
            value={selectedDate} 
            onChange={handleDateChange}
          />
        </div>
        </div>

          {/* For export form details */}
        <div className="export-buttons">
          {[...Array(1)].map((_, index) => (
            <button key={index} onClick={handleExportClick} className='export'>
              Export 
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <form className="export-form" onSubmit={handleSubmit}>
          <h3>Export Details</h3>

          <div className="form-row">
            <div className="form-group">
          <label>Start Date:</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
          <label>End Date:</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
          </div>
          </div>

          <div className="form-row">
            <div className="form-group">
          <label>Employee:</label>
            <input type="text" name="employee" value={formData.employee} onChange={handleChange} required />
          </div>
          <div className="form-group">
          <label>Status:</label>
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          </div>

          <div className="form-group">
          <label>Contributions:</label>
            <input type="text" name="contributions" value={formData.contributions} onChange={handleChange} />
          </div>
          <button type="submit" className='submit-button'>Export</button>
        </form>
      )}


<div className="dashboard-content">
        <div className="employee-payslips">
          <h3>Employee Payslips</h3>
          <div className="payslip-chart">
            <Bar data = {payslipData} />
          </div>
        </div>

        <div className="contributions">
          <h3>Employer Contributions</h3>
          <select className="employee-dropdown" onChange={handleEmployeeChange}>
          <option>Select an employee</option>
          {employees.map((employee, index) => (
            <option key={index} value={employee.name}>{employee.name}</option>
          ))}
            
          </select>
          {selectedEmployee && (
          <table>
            <thead>
              <tr>
                <th>Deduction</th>
                <th>Employee Contribution</th>
                <th>Employer Contribution</th>
              </tr>
            </thead>
            <tbody>
              {selectedEmployee.contributions.map((contribution, index) => (
                <tr key={index}>
                  <td>
                    <span className="avatar">
                      {contribution.type.split(" ")[0][0]}{contribution.type.split(" ")[1]?.[0]}
                    </span>
                    {contribution.type}
                  </td>
                  <td>{contribution.employeeContribution}</td>
                  <td>{contribution.employerContribution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        </div>
        <div className="contracts-ending">
          <div className="contracts-header">
            <h3>Contracts Ending</h3>
            
          </div>
          <div className="contract-list">
            <div className="contract-item">
              <div className="contract-circle">JS</div>
              <div className="contract-details">
                <span className="employee-name">John Smith</span>
                <span className="contract-date">Ending on Nov 10, 2024</span>
              </div>
            </div>
            <div className="contract-item">
              <div className="contract-circle">EM</div>
              <div className="contract-details">
                <span className="employee-name">Emily Martin</span>
                <span className="contract-date">Ending on Nov 25, 2024</span>
              </div>
            </div>
            {/* Add more contract items as needed */}
            <hr/>
            <p className="contract-count">Number of contracts expiring in November 2024: 0</p>
          </div>
        </div>

        <div className="department-chart">
          <h3>Department Chart</h3>
          <Pie data = {departmentData} />
        </div>
      </div>

      
    </div>
  );
};

export default PayrollDashboard;
