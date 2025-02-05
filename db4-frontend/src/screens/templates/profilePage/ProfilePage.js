import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
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

const ProfilePage = () => {
  const { id } = useParams();
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
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    contractName: '',
    startDate: '',
    endDate: '',
    wageType: '',
    basicSalary: '',
    filingStatus: '',
    status: ''
  });

  const fetchProfileData = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/employees/${id}`);
      const { personalInfo, bankInfo, workInfo, name, email, phone,img } = response.data;
      setPersonalInfo({ ...personalInfo, name, email, phone });
      setBankInfo(bankInfo || {});
      setWorkInfo(workInfo || {});
      const imageUrl = img ? `${process.env.REACT_APP_API_URL}/uploads/${img}` : null;
    setProfileImage(imageUrl);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchContracts = useCallback(async () => {
    if (!id) return;

    try {
      const data = await getContractsByEmployeeId(id);
      setContracts(data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchProfileData();
    fetchContracts();
  }, [fetchProfileData, fetchContracts]);

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
      startDate: contract.startDate.split('T')[0],
      endDate: contract.endDate ? contract.endDate.split('T')[0] : '',
      wageType: contract.wageType,
      basicSalary: contract.basicSalary,
      filingStatus: contract.filingStatus,
      status: contract.status
    });
    setShowModal(true);
  };

  const updateProfileData = async () => {
    try {
      const payload = { personalInfo, bankInfo, workInfo };
      await axios.put(`/api/employees/${id}`, payload);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      updateProfileData();
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    switch(section) {
      case 'personal':
        setPersonalInfo(prev => ({ ...prev, [name]: value }));
        break;
      case 'work':
        setWorkInfo(prev => ({ ...prev, [name]: value }));
        break;
      case 'bank':
        setBankInfo(prev => ({ ...prev, [name]: value }));
        break;
      default:
        break;
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }
 
  const getDisplayValue = (value) => {
    return value || 'Need to Update';
  };

  const getProfileImage = (imagePath) => {
    if (!imagePath) {
      return `${process.env.PUBLIC_URL}/default-avatar.png`;
    }
    return `${process.env.REACT_APP_API_URL}/uploads/${imagePath}`;
  };

  return (
    <Container fluid className="profile-page-container">
      <Card style={{borderRadius: "10px", width:"100%"}} >
        <Row>
          <Col md={12} className="profile-card" >
            <Card style={{borderRadius: "10px", width:"100%"}}>
              <Card.Body >
                <Row >
                  <Col >
                  <div className="profile-avatar">
  {profileImage ? (
    <img 
      src={profileImage}
      alt="Profile"
      className="profile-image"
      onError={(e) => {
        e.target.src = `${process.env.PUBLIC_URL}/default-avatar.png`;
      }}
    />
  ) : (
    personalInfo?.name ? (
      `${personalInfo.name[0]}${personalInfo.name.split(" ")[1]?.[0] || ''}`
    ) : ''
  )}
</div>
                    <Card.Title>{personalInfo.name}</Card.Title>
                    {/* <Button variant="outline-secondary" onClick={handleEditToggle}>
                      {editMode ? 'Save' : 'Edit'}
                    </Button> */}
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
                <Card style={{ borderRadius: "10px", width:"100%"}}>
  <Card.Body>
    <h6>Personal Information</h6>
    <ListGroup variant="flush">
      <ListGroup.Item>
        <strong>Name:</strong> {editMode ? (
          <Form.Control
            type="text"
            name="name"
            value={personalInfo.name || ''}
            onChange={(e) => handleInputChange(e, 'personal')}
          />
        ) : personalInfo.name}
      </ListGroup.Item>
      <ListGroup.Item>
        <strong>E-mail:</strong> {editMode ? (
          <Form.Control
            type="email"
            name="email"
            value={personalInfo.email || ''}
            onChange={(e) => handleInputChange(e, 'personal')}
          />
        ) : personalInfo.email}
      </ListGroup.Item>
      <ListGroup.Item>
        <strong>Phone:</strong> {editMode ? (
          <Form.Control
            type="tel"
            name="phone"
            value={personalInfo.phone || ''}
            onChange={(e) => handleInputChange(e, 'personal')}
          />
        ) : personalInfo.phone}
      </ListGroup.Item>
      <ListGroup.Item>
        <strong>Department:</strong> {editMode ? (
          <Form.Control
            type="text"
            name="department"
            value={personalInfo.department || ''}
            onChange={(e) => handleInputChange(e, 'personal')}
          />
        ) : personalInfo.department}
      </ListGroup.Item>
      <ListGroup.Item>
        <strong>Designation:</strong> {editMode ? (
          <Form.Control
            type="text"
            name="designation"
            value={personalInfo.designation || ''}
            onChange={(e) => handleInputChange(e, 'personal')}
          />
        ) : personalInfo.designation}
      </ListGroup.Item>
      <ListGroup.Item>
    <strong>Blood Group:</strong> {editMode ? (
      <Form.Control
        type="text"
        name="bloodGroup"
        value={personalInfo.bloodGroup || ''}
        onChange={(e) => handleInputChange(e, 'personal')}
      />
    ) : personalInfo.bloodGroup}
  </ListGroup.Item>
  <ListGroup.Item>
    <strong>Gender:</strong> {editMode ? (
      <Form.Select
        name="gender"
        value={personalInfo.gender || ''}
        onChange={(e) => handleInputChange(e, 'personal')}
      >
        <option value="">Select Gender</option>
        <option value="Male">MALE</option>
        <option value="Female">FEMALE</option>
        <option value="Other">OTHER</option>
      </Form.Select>
    ) : personalInfo.gender}
  </ListGroup.Item>
  <ListGroup.Item>
    <strong>Marital Status:</strong> {editMode ? (
      <Form.Select
        name="maritalStatus"
        value={personalInfo.maritalStatus || ''}
        onChange={(e) => handleInputChange(e, 'personal')}
      >
        <option value="">Select Status</option>
        <option value="Single">SINGLE</option>
        <option value="Married">MARRIED</option>
      </Form.Select>
    ) : personalInfo.maritalStatus}
  </ListGroup.Item>
  <ListGroup.Item>
    <strong>Present Address:</strong> {editMode ? (
      <Form.Control
        as="textarea"
        name="presentAddress"
        value={personalInfo.presentAddress || ''}
        onChange={(e) => handleInputChange(e, 'personal')}
      />
    ) : personalInfo.presentAddress}
  </ListGroup.Item>
  <ListGroup.Item>
    <strong>District:</strong> {editMode ? (
      <Form.Control
        type="text"
        name="district"
        value={personalInfo.district || ''}
        onChange={(e) => handleInputChange(e, 'personal')}
      />
    ) : personalInfo.district}
  </ListGroup.Item>
  <ListGroup.Item>
    <strong>State:</strong> {editMode ? (
      <Form.Control
        type="text"
        name="state"
        value={personalInfo.state || ''}
        onChange={(e) => handleInputChange(e, 'personal')}
      />
    ) : personalInfo.state}
  </ListGroup.Item>

    </ListGroup>
  </Card.Body>
</Card>
                </Col>
 
                <Col md={8} className="details-card">
                  <Card style={{ borderRadius: "10px", width:"100%"}}>
                    <Card.Body>
                      <Tab.Container activeKey={subTabKey} onSelect={(k) => setSubTabKey(k)}>
                        <Nav variant="tabs" className="mb-3 sub-tabs">
                          
                          <Nav.Item>
                            <Nav.Link eventKey="contactDetails">Contact Details</Nav.Link>
                          </Nav.Item>
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
                                          value={workInfo[key] || ''}
                                          onChange={(e) => handleInputChange(e, 'work')}
                                        />
                                      ) : (
                                        workInfo[key] || 'Need to Update'
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
                                    value={formData.contractName || ''}
                                    onChange={handleFormChange}
                                  />
                                </Form.Group>
 
                                <Form.Group controlId="startDate">
                                  <Form.Label>Start Date</Form.Label>
                                  <Form.Control
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate || ''}
                                    onChange={handleFormChange}
                                  />
                                </Form.Group>
 
                                <Form.Group controlId="endDate">
                                  <Form.Label>End Date</Form.Label>
                                  <Form.Control
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate || ''}
                                    onChange={handleFormChange}
                                  />
                                </Form.Group>
 
                                <Form.Group controlId="wageType">
                                  <Form.Label>Wage Type</Form.Label>
                                  <Form.Control
                                    as="select"
                                    name="wageType"
                                    value={formData.wageType || ''}
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
                                    value={formData.basicSalary || ''}
                                    onChange={handleFormChange}
                                  />
                                </Form.Group>
 
                                <Form.Group controlId="filingStatus">
                                  <Form.Label>Filing Status</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="filingStatus"
                                    value={formData.filingStatus || ''}
                                    onChange={handleFormChange}
                                  />
                                </Form.Group>
 
                                <Form.Group controlId="status">
                                  <Form.Label>Status</Form.Label>
                                  <Form.Control
                                    as="select"
                                    name="status"
                                    value={formData.status || ''}
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
                  <Card className='mt-3' style={{borderRadius: "10px", width:"100%"}}>
  <Card.Body>
    <h6>BANK INFORMATION</h6>
    <ListGroup variant="flush">
      <ListGroup.Item>
        <strong>BANK NAME:</strong> {editMode ? (
          <Form.Control
            type="text"
            name="bankName"
            value={bankInfo.bankName || ''}
            onChange={(e) => handleInputChange(e, 'bank')}
          />
        ) : getDisplayValue(bankInfo.bankName)}
      </ListGroup.Item>
      <ListGroup.Item>
        <strong>ACCOUNT NUMBER:</strong> {editMode ? (
          <Form.Control
            type="text"
            name="accountNumber"
            value={bankInfo.accountNumber || ''}
            onChange={(e) => handleInputChange(e, 'bank')}
          />
        ) : getDisplayValue(bankInfo.accountNumber)}
      </ListGroup.Item>
      <ListGroup.Item>
        <strong>IFSC CODE:</strong> {editMode ? (
          <Form.Control
            type="text"
            name="ifscCode"
            value={bankInfo.ifscCode || ''}
            onChange={(e) => handleInputChange(e, 'bank')}
          />
        ) : getDisplayValue(bankInfo.ifscCode)}
      </ListGroup.Item>
      <ListGroup.Item>
        <strong>BRANCH NAME:</strong> {editMode ? (
          <Form.Control
            type="text"
            name="branchName"
            value={bankInfo.branchName || ''}
            onChange={(e) => handleInputChange(e, 'bank')}
          />
        ) : getDisplayValue(bankInfo.branchName)}
      </ListGroup.Item>
      <ListGroup.Item>
        <strong>BRANCH ADDRESS:</strong> {editMode ? (
          <Form.Control
            type="text"
            name="branchAddress"
            value={bankInfo.branchAddress || ''}
            onChange={(e) => handleInputChange(e, 'bank')}
          />
        ) : getDisplayValue(bankInfo.branchAddress)}
      </ListGroup.Item>
      <ListGroup.Item>
        <strong>ACCOUNT TYPE:</strong> {editMode ? (
          <Form.Select
            name="accountType"
            value={bankInfo.accountType || ''}
            onChange={(e) => handleInputChange(e, 'bank')}
          >
            <option value="">Select Account Type</option>
            <option value="Savings">SAVINGS</option>
            <option value="Current">CURRENT</option>
          </Form.Select>
        ) : getDisplayValue(bankInfo.accountType)}
      </ListGroup.Item>
    </ListGroup>
  </Card.Body>
</Card>

                </Col>
              </Row>
            </Tab.Pane>
 
            <Tab.Pane eventKey="workTypeShift">
              <Card style={{borderRadius: "10px", width:"100%"}}>
                <Card.Body >
                  <WorkTypeAndShift />
                </Card.Body>
              </Card>
 
            </Tab.Pane>
 
            <Tab.Pane eventKey="attendance">
              <Card style={{borderRadius: "10px", width:"100%"}}>
                <Card.Body>
                  <Attendance />
                </Card.Body>
              </Card>
            </Tab.Pane>
 
            <Tab.Pane eventKey="leave">
              <Card style={{borderRadius: "10px", width:"100%"}}>
                <Card.Body>
                  <Leave />
                </Card.Body>
              </Card>
 
            </Tab.Pane>
            <Tab.Pane eventKey="payroll">
              <Card style={{borderRadius: "10px", width:"100%"}}>
                <Card.Body>
                  <Payroll />
                </Card.Body>
              </Card>
 
            </Tab.Pane>
            <Tab.Pane eventKey="allowanceDeduction">
              <Card style={{borderRadius: "10px", width:"100%"}}>
                <Card.Body>
                  <AllowanceAndDeduction />
                </Card.Body>
              </Card>
 
            </Tab.Pane>
            <Tab.Pane eventKey="penaltyAccount">
              <Card style={{borderRadius: "10px", width:"100%"}}>
                <Card.Body>
                  <PenaltyAccount />
                </Card.Body>
              </Card>
 
            </Tab.Pane>
            <Tab.Pane eventKey="assets">
              <Card style={{borderRadius: "10px", width:"100%"}}>
                <Card.Body>
                  <Assets />
                </Card.Body>
              </Card>
 
            </Tab.Pane>
            <Tab.Pane eventKey="performance">
              <Card style={{borderRadius: "10px", width:"100%"}}>
                <Card.Body>
                  <Performance />
                </Card.Body>
              </Card>
 
            </Tab.Pane>
            <Tab.Pane eventKey="documents">
              <Card style={{borderRadius: "10px", width:"100%"}}>
                <Card.Body>
                  <Documents />
                </Card.Body>
              </Card>
 
            </Tab.Pane>
            <Tab.Pane eventKey="bonusPoints">
              <Card style={{borderRadius: "10px", width:"100%"}}>
                <Card.Body>
                  <BonusPoints />
                </Card.Body>
              </Card>
 
            </Tab.Pane>
            <Tab.Pane eventKey="scheduledInterview">
              <Card style={{borderRadius: "10px", width:"100%"}}>
                <Card.Body>
                  <ScheduledInterview />
                </Card.Body>
              </Card>
 
            </Tab.Pane>
            <Tab.Pane eventKey="resignation">
              <Card style={{borderRadius: "10px", width:"100%"}}>
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