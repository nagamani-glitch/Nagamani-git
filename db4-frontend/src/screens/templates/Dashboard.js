import React, { useState } from 'react';
import Sidebar from './sidebar/Sidebar';
import Hr from './hrScreen/Hr';
import OKRs from './OKRsScreen/OKRs';
//import ProductDevelopment from './profilePage/ProfilePage';
// import WorkManagement from './workManagement/EmployeeListing';
// import ProductManagement from './productManagement/DocumentRequestPage';
import DocumentRequestPage from './productManagement/DocumentRequestPage';
import './Dashboard.css';
import { useSidebar } from '../../Context';
import EmployeeListing from './employeeListing/EmployeeListing';
import WorkTypeRequest from './workTypeRequest/WorkTypeRequest';
import ShiftRequests from './shiftRequest/ShiftRequest';
import RotatingShiftAssign from './rotatingShiftAssign/RotatingShiftAssign';
import DisciplinaryActions from './disciplinaryActions/DisciplinaryActions';
import Policies from './policies/Policies';
import OrganizationChart from './organizationChart/OrganizationChart';
import RotatingWorktypeAssign from './rotatingWorktypeAssign/RotatingWorktypeAssign';
import AttendanceRecords from './attendanceRecords/AttendanceRecords';
import TimeOffRequests from './timeOffRequests/TimeOffRequests';
// import LeaveBalance from './leaveRequests/LeaveRequests';
// import LeaveRequests from './leaveRequests/LeaveRequests';
import ProfilePage from './profilePage/ProfilePage';
import MyLeaveRequests from './myLeaveRequests/MyLeaveRequests';
import LeaveRequests from './leaveRequests/LeaveRequests';

function Dashboard() {
  // State to manage the active screen
  const [activeScreen, setActiveScreen] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('67343940a35795672c4c79a1');

  const { isSidebarOpen } = useSidebar();

  // Function to render the correct component based on the active screen
  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Hr />;
      case 'recruitment':
        return <OKRs />;
      case 'profile':
        return <ProfilePage employeeId={selectedEmployeeId} />;
      case 'employee':
        return <EmployeeListing onEmployeeClick={handleEmployeeClick} />;
      case "documentRequest":
        return <DocumentRequestPage />;
      case "workTypeRequest":
        return <WorkTypeRequest />
      case "shiftRequests":
        return <ShiftRequests />
      case "rotatingShiftAssign":
        return <RotatingShiftAssign />
      case "disciplinaryActions":
        return <DisciplinaryActions />
      case "policies":
        return <Policies />
      case "organizationChart":
        return <OrganizationChart />
      case "rotatingWorktypeAssign":
        return <RotatingWorktypeAssign />
      case "attendanceRecords":
        return <AttendanceRecords />
      case "timeOffRequests":
        return <TimeOffRequests />
      case "leaveRequests":
        return <LeaveRequests />
      case "myLeaveRequests":
        return <MyLeaveRequests />    
      default:
        return null
    }
  };

  const handleEmployeeClick = (id) => {
    setSelectedEmployeeId(id);
    setActiveScreen('profile');
  };

  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar setActiveScreen={setActiveScreen} />
      <div className="main-content">
        {renderScreen()}
      </div>
    </div>
  );
}

export default Dashboard;
