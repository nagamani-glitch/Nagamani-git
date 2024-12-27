import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Dropdown, InputGroup, Row, Col } from 'react-bootstrap';
import { FaSearch, FaFilter, FaThList, FaThLarge, FaEllipsisV } from 'react-icons/fa';
import axios from 'axios'
import './EmployeeListing.css';

// const employeesData = [
//   { id: 1, name: 'Adam Luis', email: 'adam@company.com', position: 'Software Engineer', status: 'Online', initials: 'AL' },
//   { id: 2, name: 'Bella Johnson', email: 'bella@company.com', position: 'Product Manager', status: 'Offline', initials: 'BJ' },
//   { id: 3, name: 'Charlie Williams', email: 'charlie@company.com', position: 'UX Designer', status: 'Online', initials: 'CW' },
//   { id: 4, name: 'Daniela Brown', email: 'daniela@company.com', position: 'QA Engineer', status: 'Offline', initials: 'DB' },
//   { id: 5, name: 'Ethan Davis', email: 'ethan@company.com', position: 'Data Analyst', status: 'Online', initials: 'ED' },
//   { id: 6, name: 'Fiona Smith', email: 'fiona@company.com', position: 'HR Specialist', status: 'Offline', initials: 'FS' },
//   { id: 7, name: 'George King', email: 'george@company.com', position: 'Backend Developer', status: 'Online', initials: 'GK' },
//   { id: 8, name: 'Hannah Green', email: 'hannah@company.com', position: 'Finance Analyst', status: 'Offline', initials: 'HG' },
//   { id: 9, name: 'Isaac Evans', email: 'isaac@company.com', position: 'Project Manager', status: 'Online', initials: 'IE' },
//   { id: 10, name: 'Julia Harris', email: 'julia@company.com', position: 'Marketing Specialist', status: 'Offline', initials: 'JH' },
  
//   { id: 11, name: 'Kyle Turner', email: 'kyle@company.com', position: 'DevOps Engineer', status: 'Online', initials: 'KT' },
//   { id: 12, name: 'Lily White', email: 'lily@company.com', position: 'Sales Manager', status: 'Offline', initials: 'LW' },
//   { id: 13, name: 'Max Black', email: 'max@company.com', position: 'Frontend Developer', status: 'Online', initials: 'MB' },
//   { id: 14, name: 'Nina Brooks', email: 'nina@company.com', position: 'Operations Manager', status: 'Offline', initials: 'NB' },
//   { id: 15, name: 'Oliver Scott', email: 'oliver@company.com', position: 'Business Analyst', status: 'Online', initials: 'OS' },
//   { id: 16, name: 'Paula Adams', email: 'paula@company.com', position: 'Technical Recruiter', status: 'Offline', initials: 'PA' },
//   { id: 17, name: 'Quinn Roberts', email: 'quinn@company.com', position: 'Cloud Architect', status: 'Online', initials: 'QR' },
//   { id: 18, name: 'Rachel Price', email: 'rachel@company.com', position: 'Content Strategist', status: 'Offline', initials: 'RP' },
//   { id: 19, name: 'Sam Carter', email: 'sam@company.com', position: 'Security Specialist', status: 'Online', initials: 'SC' },
//   { id: 20, name: 'Tina Bell', email: 'tina@company.com', position: 'Customer Success Manager', status: 'Offline', initials: 'TB' },
  
//   { id: 21, name: 'Uma Singh', email: 'uma@company.com', position: 'Systems Analyst', status: 'Online', initials: 'US' },
//   { id: 22, name: 'Victor Lee', email: 'victor@company.com', position: 'SEO Specialist', status: 'Offline', initials: 'VL' },
//   { id: 23, name: 'Wendy Brown', email: 'wendy@company.com', position: 'Legal Advisor', status: 'Online', initials: 'WB' },
//   { id: 24, name: 'Xander Lopez', email: 'xander@company.com', position: 'IT Support', status: 'Offline', initials: 'XL' },
//   { id: 25, name: 'Yara Martinez', email: 'yara@company.com', position: 'Business Development', status: 'Online', initials: 'YM' },
//   { id: 26, name: 'Zoe Taylor', email: 'zoe@company.com', position: 'Graphic Designer', status: 'Offline', initials: 'ZT' },
  
//   { id: 27, name: 'Aaron Mitchell', email: 'aaron@company.com', position: 'Product Owner', status: 'Online', initials: 'AM' },
//   { id: 28, name: 'Bianca Clark', email: 'bianca@company.com', position: 'Network Engineer', status: 'Offline', initials: 'BC' },
//   { id: 29, name: 'Caleb Ramirez', email: 'caleb@company.com', position: 'Digital Marketing', status: 'Online', initials: 'CR' },
//   { id: 30, name: 'Diana West', email: 'diana@company.com', position: 'HR Manager', status: 'Offline', initials: 'DW' },
//   { id: 81, name: 'Adam Luis', email: 'adam@company.com', position: 'Software Engineer', status: 'Online', initials: 'AL' },
//   { id: 82, name: 'Bella Johnson', email: 'bella@company.com', position: 'Product Manager', status: 'Offline', initials: 'BJ' },
//   { id: 83, name: 'Charlie Williams', email: 'charlie@company.com', position: 'UX Designer', status: 'Online', initials: 'CW' },
//   { id: 84, name: 'Daniela Brown', email: 'daniela@company.com', position: 'QA Engineer', status: 'Offline', initials: 'DB' },
//   { id: 85, name: 'Ethan Davis', email: 'ethan@company.com', position: 'Data Analyst', status: 'Online', initials: 'ED' },
//   { id: 86, name: 'Fiona Smith', email: 'fiona@company.com', position: 'HR Specialist', status: 'Offline', initials: 'FS' },
//   { id: 87, name: 'George King', email: 'george@company.com', position: 'Backend Developer', status: 'Online', initials: 'GK' },
//   { id: 88, name: 'Hannah Green', email: 'hannah@company.com', position: 'Finance Analyst', status: 'Offline', initials: 'HG' },
//   { id: 89, name: 'Isaac Evans', email: 'isaac@company.com', position: 'Project Manager', status: 'Online', initials: 'IE' },
//   { id: 90, name: 'Julia Harris', email: 'julia@company.com', position: 'Marketing Specialist', status: 'Offline', initials: 'JH' },
  
//   { id: 11, name: 'Kyle Turner', email: 'kyle@company.com', position: 'DevOps Engineer', status: 'Online', initials: 'KT' },
//   { id: 12, name: 'Lily White', email: 'lily@company.com', position: 'Sales Manager', status: 'Offline', initials: 'LW' },
//   { id: 13, name: 'Max Black', email: 'max@company.com', position: 'Frontend Developer', status: 'Online', initials: 'MB' },
//   { id: 14, name: 'Nina Brooks', email: 'nina@company.com', position: 'Operations Manager', status: 'Offline', initials: 'NB' },
//   { id: 15, name: 'Oliver Scott', email: 'oliver@company.com', position: 'Business Analyst', status: 'Online', initials: 'OS' },
//   { id: 16, name: 'Paula Adams', email: 'paula@company.com', position: 'Technical Recruiter', status: 'Offline', initials: 'PA' },
//   { id: 17, name: 'Quinn Roberts', email: 'quinn@company.com', position: 'Cloud Architect', status: 'Online', initials: 'QR' },
//   { id: 18, name: 'Rachel Price', email: 'rachel@company.com', position: 'Content Strategist', status: 'Offline', initials: 'RP' },
//   { id: 19, name: 'Sam Carter', email: 'sam@company.com', position: 'Security Specialist', status: 'Online', initials: 'SC' },
//   { id: 20, name: 'Tina Bell', email: 'tina@company.com', position: 'Customer Success Manager', status: 'Offline', initials: 'TB' },
//   // Continue adding unique names up to 90 employees
//   { id: 21, name: 'Uma Singh', email: 'uma@company.com', position: 'Systems Analyst', status: 'Online', initials: 'US' },
//   { id: 22, name: 'Victor Lee', email: 'victor@company.com', position: 'SEO Specialist', status: 'Offline', initials: 'VL' },
//   { id: 23, name: 'Wendy Brown', email: 'wendy@company.com', position: 'Legal Advisor', status: 'Online', initials: 'WB' },
//   { id: 24, name: 'Xander Lopez', email: 'xander@company.com', position: 'IT Support', status: 'Offline', initials: 'XL' },
//   { id: 25, name: 'Yara Martinez', email: 'yara@company.com', position: 'Business Development', status: 'Online', initials: 'YM' },
//   { id: 26, name: 'Zoe Taylor', email: 'zoe@company.com', position: 'Graphic Designer', status: 'Offline', initials: 'ZT' },
  
//   { id: 27, name: 'Aaron Mitchell', email: 'aaron@company.com', position: 'Product Owner', status: 'Online', initials: 'AM' },
//   { id: 28, name: 'Bianca Clark', email: 'bianca@company.com', position: 'Network Engineer', status: 'Offline', initials: 'BC' },
//   { id: 29, name: 'Caleb Ramirez', email: 'caleb@company.com', position: 'Digital Marketing', status: 'Online', initials: 'CR' },
//   { id: 30, name: 'Diana West', email: 'diana@company.com', position: 'HR Manager', status: 'Offline', initials: 'DW' },
//   { id: 31, name: 'Adam Luis', email: 'adam@company.com', position: 'Software Engineer', status: 'Online', initials: 'AL' },
//   { id: 32, name: 'Bella Johnson', email: 'bella@company.com', position: 'Product Manager', status: 'Offline', initials: 'BJ' },
//   { id: 33, name: 'Charlie Williams', email: 'charlie@company.com', position: 'UX Designer', status: 'Online', initials: 'CW' },
//   { id: 34, name: 'Daniela Brown', email: 'daniela@company.com', position: 'QA Engineer', status: 'Offline', initials: 'DB' },
//   { id: 35, name: 'Ethan Davis', email: 'ethan@company.com', position: 'Data Analyst', status: 'Online', initials: 'ED' },
//   { id: 36, name: 'Fiona Smith', email: 'fiona@company.com', position: 'HR Specialist', status: 'Offline', initials: 'FS' },
//   { id: 37, name: 'George King', email: 'george@company.com', position: 'Backend Developer', status: 'Online', initials: 'GK' },
//   { id: 38, name: 'Hannah Green', email: 'hannah@company.com', position: 'Finance Analyst', status: 'Offline', initials: 'HG' },
//   { id: 39, name: 'Isaac Evans', email: 'isaac@company.com', position: 'Project Manager', status: 'Online', initials: 'IE' },
//   { id: 40, name: 'Julia Harris', email: 'julia@company.com', position: 'Marketing Specialist', status: 'Offline', initials: 'JH' },
//   // Add more names to reach 90 employees
//   { id: 51, name: 'Kyle Turner', email: 'kyle@company.com', position: 'DevOps Engineer', status: 'Online', initials: 'KT' },
//   { id: 52, name: 'Lily White', email: 'lily@company.com', position: 'Sales Manager', status: 'Offline', initials: 'LW' },
//   { id: 53, name: 'Max Black', email: 'max@company.com', position: 'Frontend Developer', status: 'Online', initials: 'MB' },
//   { id: 54, name: 'Nina Brooks', email: 'nina@company.com', position: 'Operations Manager', status: 'Offline', initials: 'NB' },
//   { id: 55, name: 'Oliver Scott', email: 'oliver@company.com', position: 'Business Analyst', status: 'Online', initials: 'OS' },
//   { id: 56, name: 'Paula Adams', email: 'paula@company.com', position: 'Technical Recruiter', status: 'Offline', initials: 'PA' },
//   { id: 57, name: 'Quinn Roberts', email: 'quinn@company.com', position: 'Cloud Architect', status: 'Online', initials: 'QR' },
//   { id: 58, name: 'Rachel Price', email: 'rachel@company.com', position: 'Content Strategist', status: 'Offline', initials: 'RP' },
//   { id: 59, name: 'Sam Carter', email: 'sam@company.com', position: 'Security Specialist', status: 'Online', initials: 'SC' },
//   { id: 60, name: 'Tina Bell', email: 'tina@company.com', position: 'Customer Success Manager', status: 'Offline', initials: 'TB' },
  
//   { id: 71, name: 'Uma Singh', email: 'uma@company.com', position: 'Systems Analyst', status: 'Online', initials: 'US' },
//   { id: 72, name: 'Victor Lee', email: 'victor@company.com', position: 'SEO Specialist', status: 'Offline', initials: 'VL' },
//   { id: 73, name: 'Wendy Brown', email: 'wendy@company.com', position: 'Legal Advisor', status: 'Online', initials: 'WB' },
//   { id: 74, name: 'Xander Lopez', email: 'xander@company.com', position: 'IT Support', status: 'Offline', initials: 'XL' },
//   { id: 75, name: 'Yara Martinez', email: 'yara@company.com', position: 'Business Development', status: 'Online', initials: 'YM' },
//   { id: 76, name: 'Zoe Taylor', email: 'zoe@company.com', position: 'Graphic Designer', status: 'Offline', initials: 'ZT' },
  
//   { id: 77, name: 'Aaron Mitchell', email: 'aaron@company.com', position: 'Product Owner', status: 'Online', initials: 'AM' },
//   { id: 78, name: 'Bianca Clark', email: 'bianca@company.com', position: 'Network Engineer', status: 'Offline', initials: 'BC' },
//   { id: 79, name: 'Caleb Ramirez', email: 'caleb@company.com', position: 'Digital Marketing', status: 'Online', initials: 'CR' },
//   { id: 80, name: 'Diana West', email: 'diana@company.com', position: 'HR Manager', status: 'Offline', initials: 'DW' },
  
// ];



const EmployeeListing = ({onEmployeeClick }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [profiles, setProfiles] = useState([])
  const [filteredEmployeesList, setFilteredEmployeesList] = useState(profiles);
  const itemsPerPage = 30;

  const handleFilter = (status) => {
    setStatusFilter(status);
    if (status === 'Online') {
      setFilteredEmployeesList(profiles.filter(employee => employee.status === 'Online'));
    } else if (status === 'Offline') {
      setFilteredEmployeesList(profiles.filter(employee => employee.status === 'Offline'));
    } else {
      setFilteredEmployeesList(profiles); // Reset to all employees
    }
    console.log(filteredEmployeesList)
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const toggleView = (mode) => {
    setViewMode(mode);
  };

  // Filtered and paginated employees
  const filteredEmployees = profiles.filter((employee) =>
    employee.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  useEffect(()=>{
    const fetchProfiles=async()=>{
      try{
      const response = await axios.get('/api/profiles/all')
      setProfiles(response.data)
      console.log(response.data)
    }catch(error){
      console.log("Error fetching all profiles", error)
    }
    }

    fetchProfiles()

  }, [])


  return (
    <div className="employee-listing-container p-3">
      <Row className="align-items-center mb-3">
        <Col md={6} className="d-flex align-items-center">
          <h3 className="employee-header me-3">Employees</h3>
          <InputGroup className="search-bar">
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control type="text" placeholder="Search" value={searchText} onChange={handleSearch} />
          </InputGroup>
        </Col>

        <Col md={6} className="d-flex justify-content-end align-items-center">
          <Button variant="outline-secondary" className="view-toggle me-2" onClick={() => toggleView('list')}>
            <FaThList />
          </Button>
          <Button variant="outline-secondary" className="view-toggle me-2" onClick={() => toggleView('grid')}>
            <FaThLarge />
          </Button>
          <Button variant="outline-secondary" className="view-toggle me-2">
            <div className="filter-container d-flex align-items-center me-2">
              <FaFilter className="filter-icon me-1" />
              <span>Filter(1)</span>
            </div>
          </Button>

          <Dropdown className="d-inline me-2">
            <Dropdown.Toggle variant="outline-secondary" className="group-by-dropdown">Group By</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Job Position</Dropdown.Item>
              <Dropdown.Item>Department</Dropdown.Item>
              <Dropdown.Item>Shift</Dropdown.Item>
              <Dropdown.Item>Work Type</Dropdown.Item>
              <Dropdown.Item>Job Role</Dropdown.Item>
              <Dropdown.Item>Reporting Manager</Dropdown.Item>
              <Dropdown.Item>Company</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className="d-inline me-2">
            <Dropdown.Toggle variant="outline-secondary" className="actions-dropdown">Actions</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Import</Dropdown.Item>
              <Dropdown.Item>Export</Dropdown.Item>
              <Dropdown.Item>Archive</Dropdown.Item>
              <Dropdown.Item>Un-archive</Dropdown.Item>
              <Dropdown.Item>Bulk Email</Dropdown.Item>
              <Dropdown.Item>Bulk Update</Dropdown.Item>
              <Dropdown.Item>Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row style={{position:"relative", left:"600px"}}>
      <div className="filter-buttons">
            <Button
              variant={statusFilter === 'Online' ? 'primary' : 'outline-primary'}
              onClick={() => handleFilter('Online')}
              className='me-2'
              style={{border:"none"}}
            >
              Online
            </Button>
            <Button
              variant={statusFilter === 'Offline' ? 'primary' : 'outline-primary'}
              onClick={() => handleFilter('Offline')}
              className='me-2'
              style={{border:"none"}}
            >
              Offline
            </Button>
          </div>
      </Row>

      <Row>
        {viewMode === 'grid' ? (
          paginatedEmployees.map((employee) => (
            <Col md={6} key={employee._id} onClick={()=>onEmployeeClick(employee._id)} >
              <Card className="employee-card mb-3">
                <Card.Body className="d-flex align-items-center">
                  <div className="avatar rounded-circle me-3">
                    {employee.name[0]}
                  </div>
                  <div>
                    <Card.Title className="employee-name">{employee.name}</Card.Title>
                    <Card.Text className="employee-email">{employee.email}</Card.Text>
                    <small className="employee-position">{employee.phone}</small>
                  </div>
                  <Dropdown className="ms-auto">
                    <Dropdown.Toggle variant="link" className="employee-options p-0">
                      <FaEllipsisV />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>Edit</Dropdown.Item>
                      <Dropdown.Item>Archive</Dropdown.Item>
                      <Dropdown.Item>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <TableView employees={paginatedEmployees} onEmployeeClick={onEmployeeClick} />
        )}
      </Row>

      <div className="pagination d-flex justify-content-center align-items-center mt-3">
        <Button variant="outline-secondary" onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </Button>
        <span className="mx-3">Page {currentPage} of {totalPages}</span>
        <Button variant="outline-secondary" onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};

function TableView({ employees, onEmployeeClick }) {
  return (
    <table className="table table-striped employee-table">
      <thead>
        <tr>
          <th><Form.Check /></th>
          <th>Employee</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee.id} onClick={()=>onEmployeeClick(employee._id)}>
            <td><Form.Check /></td>
            <td>{employee.name}</td>
            <td>{employee.email}</td>
            <td>{employee.phone}</td>
            <td>
              <Dropdown>
                <Dropdown.Toggle variant="link" className="employee-options p-0">
                  <FaEllipsisV />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Edit</Dropdown.Item>
                  <Dropdown.Item>Archive</Dropdown.Item>
                  <Dropdown.Item>Delete</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EmployeeListing;
