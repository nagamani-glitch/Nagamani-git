import React, { useState } from 'react';
import Sidebar from './sidebar/Sidebar';
//import Hr from './hrScreen/Hr';
//import OKRs from './OKRsScreen/OKRs';
//import ProductDevelopment from './profilePage/ProfilePage';
// import WorkManagement from './workManagement/EmployeeListing';
// import ProductManagement from './productManagement/DocumentRequestPage';
import DocumentRequestPage from './productManagement/DocumentRequestPage';
import MainDashboard from './MainDashboard';
import RecruitmentDashboard from './Recruitment/RecruitmentDashboard';
import RecruitmentPipeline from './Recruitment/RecruitmentPipeline';
import RecruitmentSurvey from './Recruitment/RecruitmentSurvey';
import RecruitmentCandidate from './Recruitment/RecruitmentCandidate';
import Interview from './Recruitment/Interview';
import OpenJobs from './Recruitment/OpenJobs';
import SkillZone from './Recruitment/SkillZone';
import OnboardingView from './Onboarding/OnboardingView_1';
import CandidatesView from './Onboarding/CandidateView';
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
<<<<<<< HEAD
//import OnboardingView from './onboarding/OnboardingView';
import AssetHistory from './Assets/AssetHistory';
import AssetView from './Assets/AssetView';
import AssetBatch from './Assets/AssetBatch';
import AssetDashboard from './Assets/AssetDashboard';
import Holidays from './configuration/Holidays';
import CompanyHolidays from './configuration/CompanyHolidays';
import RestrictLeaves from './configuration/RestrictLeaves';
import FaqCategory from './faqs/FaqCategory';
import FaqPage from './faqs/FaqPage';

=======
// import OnboardingView from './onboarding/OnboardingView';

// Sangeeta 
import PayrollDashboard from './Payroll/PayrollDashboard';
import Allowances from './Payroll/Allowances';
import CreateAllowance from './Payroll/CreateAllowance';
import Contract from './Payroll/Contract';
import Deductions from './Payroll/Deductions';
import FederalTax from './Payroll/FederalTax';
import Payslips from './Payroll/Payslips';

import PerformanceDashboard from './Performance/PerformanceDashboard';
import Objectives from './Performance/Objectives';
import Feedback from './Performance/Feedback';

import HomePage  from './Offboarding/HomePage';
import RegistrationPage from './Offboarding/RegistrationPage';
>>>>>>> 961aa28324a6e342a78df63c4fbbe217ba0e8bd2


function Dashboard() {
  // State to manage the active screen
  const [activeScreen, setActiveScreen] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('67343940a35795672c4c79a1');

  const { isSidebarOpen } = useSidebar();

  // Function to render the correct component based on the active screen
  const renderScreen = () => {
    switch (activeScreen) {
      case 'onboardingView':
        return <OnboardingView />
      case 'dashboard':
        return <MainDashboard />;
      case 'recruitmentdashboard':
        return <RecruitmentDashboard />;
      case 'recruitmentPipeline':
        return <RecruitmentPipeline />;
      case 'recruitmentSurvey':
        return <RecruitmentSurvey />;
      case 'candidates':
        return <RecruitmentCandidate />;
      case 'interview':
        return <Interview />;
      case 'openJobs':
        return <OpenJobs />;
      case 'skillZone':
        return <SkillZone />;
      case 'candidatesView':
        return <CandidatesView />;
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
<<<<<<< HEAD
        return <MyLeaveRequests /> 
      case "assetHistory":
        return <AssetHistory />
      case "assetView":
        return <AssetView />
      case "assetBatch":
        return <AssetBatch />
      case "assetDashboard":
        return <AssetDashboard />
      case "holidays":
        return <Holidays />
      case "companyHolidays":
        return <CompanyHolidays />
      case "restrictLeaves":
        return <RestrictLeaves />
      case "faqCategory":
        return <FaqCategory />
      case "faqPage":
        return <FaqPage />
        
=======
        return <MyLeaveRequests />
      case "payrollDashboard":
        return <PayrollDashboard />;
      case "allowances":
        return <Allowances />;
      case "/allowances/create":
        return <CreateAllowance />;
      case "contract":
        return <Contract />;
      case "deductions":
        return <Deductions />;
      case "federalTax":
        return <FederalTax />;
      case "payslips":
        return <Payslips />;
      case "performanceDashboard":
        return <PerformanceDashboard />;
      case "objectives":
        return <Objectives />
      case "feedback":
        return <Feedback  />;
        case "exitProcess":
          return <HomePage />;
          case "registrationPage":
            return <RegistrationPage />;


>>>>>>> 961aa28324a6e342a78df63c4fbbe217ba0e8bd2
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
