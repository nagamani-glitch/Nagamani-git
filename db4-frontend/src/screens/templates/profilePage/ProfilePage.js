import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, ListGroup, Form, Button, Tab, Nav, Table, Modal } from 'react-bootstrap';
import WorkTypeAndShift from './workTypeAndShift/WorkTypeAndShift';
import Attendance from './attendance/Attendance';
import Leave from './leave/Leave';
import Payroll from './payroll/Payroll';
import AllowanceAndDeduction from './allowanceAndDeduction/AllowanceAndDeduction';
import PenaltyAccount from './penaltyAccount/PenaltyAccount';
import Assets from './assets/Assets';
import Performance from './performance/Performance';
import Documents from './documents/Documents';
import BonusPoints from './bonusPoints/BonusPoints';
import ScheduledInterview from './scheduledInterview/ScheduledInterview';
import Resignation from './resignation/Resignation';
import { updateContract, getContractsByEmployeeId, deleteContract } from '../../../services/contractServices';
import './ProfilePage.css';

const ProfilePage = ({employeeId}) => {
  const [editMode, setEditMode] = useState(false);
  const [tabKey, setTabKey] = useState('about');
  const [subTabKey, setSubTabKey] = useState('workInfo');
  const [loading, setLoading] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({});
  const [bankInfo, setBankInfo] = useState({});
  const [workInfo, setWorkInfo] = useState({});
  const [contracts, setContracts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [formData, setFormData] = useState({
    contractName: '',
    startDate: '',
    endDate: '',
    wageType: '',
    basicSalary: '',
    filingStatus: '',
    status: ''
  });

  const userId = employeeId; // Replace with dynamic user ID as needed

  // Fetch user data from the backend

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/profiles/profile/${userId}`);
      const { personalInfo, bankInfo, workInfo, name, email, phone } = response.data;
      setPersonalInfo({ ...personalInfo, name, email, phone } || {});
      setBankInfo(bankInfo || {});
      setWorkInfo(workInfo || {});
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchContracts = useCallback(async () => {
    const data = await getContractsByEmployeeId(userId);
    setContracts(data);
    console.log(data)
  }, [userId]);

  const handleDelete = async (contractId) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      await deleteContract(contractId);
      fetchContracts();
    }
  };

  const handleUpdate = (contract) => {
    setSelectedContract(contract);
    setFormData({
      contractName: contract.contractName,
      startDate: contract.startDate.split('T')[0], // Convert to YYYY-MM-DD format
      endDate: contract.endDate ? contract.endDate.split('T')[0] : '',
      wageType: contract.wageType,
      basicSalary: contract.basicSalary,
      filingStatus: contract.filingStatus,
      status: contract.status
    });
    setShowModal(true);
  };

  // Update user data
  const updateProfileData = async () => {
    const payload = { personalInfo, bankInfo, workInfo };
    try {
      await axios.put(`/api/profiles/profile/${userId}`, payload);
      alert('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  // Handle edit toggle
  const handleEditToggle = () => {
    if (editMode) {
      updateProfileData();
    }
    setEditMode(!editMode);
  };

  // Handle input changes
  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section === 'personal') {
      setPersonalInfo({ ...personalInfo, [name]: value });
    } else if (section === 'work') {
      setWorkInfo({ ...workInfo, [name]: value });
    } else if (section === 'bank') {
      setBankInfo({ ...bankInfo, [name]: value });
    }
  };

  const handleSaveChanges = async () => {
    if (selectedContract) {
      await updateContract(selectedContract._id, formData);
      fetchContracts();
      setShowModal(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    fetchProfileData();
    fetchContracts()
  }, [fetchProfileData, fetchContracts]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid className="profile-page-container">
      <Card style={{ padding: "10px" }}>
        <Row>
          <Col md={12} className="profile-card">
            <Card>
              <Card.Body>
                <Row>
                  <Col>
                    <div className="profile-avatar">
                      {personalInfo?.name ? (
                        `${personalInfo.name[0]}${personalInfo.name.split(" ")[1]?.[0] || ''}`
                      ) : ''}
                    </div>
                    <Card.Title>{personalInfo.name}</Card.Title>
                    <Button variant="outline-secondary" onClick={handleEditToggle}>
                      {editMode ? 'Save' : 'Edit'}
                    </Button>
                  </Col>
                  <Col>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong style={{ fontSize: "13px" }}>Work Email:</strong> {editMode ? <Form.Control type="text" value="None" readOnly /> : personalInfo.email}
                      </ListGroup.Item>
                      <ListGroup.Item><strong style={{ fontSize: "13px" }}>Email:</strong> {personalInfo.email}</ListGroup.Item>
                      <ListGroup.Item>
                        <strong style={{ fontSize: "13px" }}>Work Phone:</strong> {editMode ? <Form.Control type="text" value="None" readOnly /> : personalInfo.phone}
                      </ListGroup.Item>
                      <ListGroup.Item><strong style={{ fontSize: "13px" }}>Phone:</strong> {personalInfo.phone}</ListGroup.Item>
                    </ListGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Tab.Container activeKey={tabKey} onSelect={(k) => setTabKey(k)}>
          <Nav variant="pills" className="custom-nav mb-3">
            <Nav.Item>
              <Nav.Link eventKey="about">About</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="workTypeShift">Work Type & Shift</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="attendance">Attendance</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="leave">Leave</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="payroll">Payroll</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="allowanceDeduction">Allowance & Deduction</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="penaltyAccount">Penalty Account</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="assets">Assets</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="performance">Performance</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="documents">Documents</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="bonusPoints">Bonus Points</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="scheduledInterview">Scheduled Interview</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="resignation">Resignation</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="about">
              <Row className="profile-section">
                <Col md={4}>
                  <Card >
                    <Card.Body>
                      <h6>Personal Information</h6>
                      <ListGroup variant="flush">
                        {Object.keys(personalInfo).map((key) => (
                          <ListGroup.Item key={key}>
                            <strong>{key}:</strong>{' '}
                            {editMode ? (
                              <Form.Control
                                type="text"
                                name={key}
                                value={personalInfo[key] || ''}
                                onChange={(e) => handleInputChange(e, 'personal')}
                              />
                            ) : (
                              personalInfo[key]
                            )}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={8} className="details-card">
                  <Card>
                    <Card.Body>
                      <Tab.Container activeKey={subTabKey} onSelect={(k) => setSubTabKey(k)}>
                        <Nav variant="tabs" className="mb-3 sub-tabs">
                          <Nav.Item>
                            <Nav.Link eventKey="workInfo">Work Information</Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link eventKey="contractDetails">Contract Details</Nav.Link>
                          </Nav.Item>
                        </Nav>

                        <Tab.Content>
                          {/* Work Information Tab */}
                          <Tab.Pane eventKey="workInfo">
                            <Row>
                              <Col md={12}>
                                <h6>Work Information</h6>
                                <ListGroup variant="flush">
                                  {Object.keys(workInfo).map((key) => (
                                    <ListGroup.Item key={key}>
                                      <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:</strong>{' '}
                                      {editMode ? (
                                        <Form.Control
                                          type="text"
                                          name={key}
                                          value={workInfo[key]}
                                          onChange={(e) => handleInputChange(e, 'work')}
                                        />
                                      ) : (
                                        workInfo[key]
                                      )}
                                    </ListGroup.Item>
                                  ))}
                                </ListGroup>
                              </Col>
                            </Row>
                          </Tab.Pane>

                          {/* Contract Details Tab */}
                          <Tab.Pane eventKey="contractDetails">
                            <Row>
                              <Col md={12}>
                                <h6>Contract Details</h6>
                                <Container>
                                  <Table striped bordered hover responsive>
                                    <thead>
                                      <tr>
                                        <th>Contract</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Wage Type</th>
                                        <th>Basic Salary</th>
                                        <th>Filing Status</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {contracts.map(contract => (
                                        <tr key={contract._id}>
                                          <td>{contract.contractName}</td>
                                          <td>{new Date(contract.startDate).toLocaleDateString()}</td>
                                          <td>{contract.endDate ? new Date(contract.endDate).toLocaleDateString() : 'None'}</td>
                                          <td>{contract.wageType}</td>
                                          <td>{contract.basicSalary}</td>
                                          <td>{contract.filingStatus}</td>
                                          <td>{contract.status}</td>
                                          <td>
                                            <Button variant="success" size="sm" onClick={() => handleUpdate(contract)}>Update</Button>{' '}
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(contract._id)}>Delete</Button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                </Container>
                              </Col>
                            </Row>
                          </Tab.Pane>
                          <Modal show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header closeButton>
                              <Modal.Title>Update Contract</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <Form>
                                <Form.Group controlId="contractName">
                                  <Form.Label>Contract Name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="contractName"
                                    value={formData.contractName}
                                    onChange={handleFormChange}
                                  />
                                </Form.Group>

                                <Form.Group controlId="startDate">
                                  <Form.Label>Start Date</Form.Label>
                                  <Form.Control
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleFormChange}
                                  />
                                </Form.Group>

                                <Form.Group controlId="endDate">
                                  <Form.Label>End Date</Form.Label>
                                  <Form.Control
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleFormChange}
                                  />
                                </Form.Group>

                                <Form.Group controlId="wageType">
                                  <Form.Label>Wage Type</Form.Label>
                                  <Form.Control
                                    as="select"
                                    name="wageType"
                                    value={formData.wageType}
                                    onChange={handleFormChange}
                                  >
                                    <option value="Hourly">Hourly</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                  </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="basicSalary">
                                  <Form.Label>Basic Salary</Form.Label>
                                  <Form.Control
                                    type="number"
                                    name="basicSalary"
                                    value={formData.basicSalary}
                                    onChange={handleFormChange}
                                  />
                                </Form.Group>

                                <Form.Group controlId="filingStatus">
                                  <Form.Label>Filing Status</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="filingStatus"
                                    value={formData.filingStatus}
                                    onChange={handleFormChange}
                                  />
                                </Form.Group>

                                <Form.Group controlId="status">
                                  <Form.Label>Status</Form.Label>
                                  <Form.Control
                                    as="select"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleFormChange}
                                  >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                  </Form.Control>
                                </Form.Group>
                              </Form>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Close
                              </Button>
                              <Button variant="primary" onClick={handleSaveChanges}>
                                Save Changes
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </Tab.Content>
                      </Tab.Container>
                    </Card.Body>
                  </Card>
                  <Card className='mt-3'>
                    <Card.Body>
                      <Row >
                        <Col md={12}>
                          <h6>Bank Information</h6>
                          <ListGroup variant="flush">
                            {Object.keys(bankInfo).map((key) => (
                              <ListGroup.Item key={key}>
                                <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:</strong>{' '}
                                {editMode ? (
                                  <Form.Control
                                    type="text"
                                    name={key}
                                    value={bankInfo[key]}
                                    onChange={(e) => handleInputChange(e, 'bank')}
                                  />
                                ) : (
                                  bankInfo[key]
                                )}
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="workTypeShift">
              <Card>
                <Card.Body>
                  <WorkTypeAndShift />
                </Card.Body>
              </Card>

            </Tab.Pane>

            <Tab.Pane eventKey="attendance">
              <Card>
                <Card.Body>
                  <Attendance />
                </Card.Body>
              </Card>
            </Tab.Pane>

            <Tab.Pane eventKey="leave">
              <Card>
                <Card.Body>
                  <Leave />
                </Card.Body>
              </Card>

            </Tab.Pane>
            <Tab.Pane eventKey="payroll">
              <Card>
                <Card.Body>
                  <Payroll />
                </Card.Body>
              </Card>

            </Tab.Pane>
            <Tab.Pane eventKey="allowanceDeduction">
              <Card>
                <Card.Body>
                  <AllowanceAndDeduction />
                </Card.Body>
              </Card>

            </Tab.Pane>
            <Tab.Pane eventKey="penaltyAccount">
              <Card>
                <Card.Body>
                  <PenaltyAccount />
                </Card.Body>
              </Card>

            </Tab.Pane>
            <Tab.Pane eventKey="assets">
              <Card>
                <Card.Body>
                  <Assets />
                </Card.Body>
              </Card>

            </Tab.Pane>
            <Tab.Pane eventKey="performance">
              <Card>
                <Card.Body>
                  <Performance />
                </Card.Body>
              </Card>

            </Tab.Pane>
            <Tab.Pane eventKey="documents">
              <Card>
                <Card.Body>
                  <Documents />
                </Card.Body>
              </Card>

            </Tab.Pane>
            <Tab.Pane eventKey="bonusPoints">
              <Card>
                <Card.Body>
                  <BonusPoints />
                </Card.Body>
              </Card>

            </Tab.Pane>
            <Tab.Pane eventKey="scheduledInterview">
              <Card>
                <Card.Body>
                  <ScheduledInterview />
                </Card.Body>
              </Card>

            </Tab.Pane>
            <Tab.Pane eventKey="resignation">
              <Card>
                <Card.Body>
                  <Resignation />
                </Card.Body>
              </Card>

            </Tab.Pane>

          </Tab.Content>
        </Tab.Container>
      </Card>
    </Container>
  );
};

export default ProfilePage;
