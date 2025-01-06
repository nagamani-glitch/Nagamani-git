import React, { useState } from 'react';
import Sidebar from './sidebar/Sidebar';
//import Hr from './hrScreen/Hr';
//import OKRs from './OKRsScreen/OKRs';
//import ProductDevelopment from './profilePage/ProfilePage';
// import WorkManagement from './workManagement/EmployeeListing';
// import ProductManagement from './productManagement/DocumentRequestPage';
import DocumentRequestPage from './productManagement/DocumentRequestPage';

//Subikshan Integration
//Dasboard
import MainDashboard from './MainDashboard';
//Recruitment
import RecruitmentDashboard from './Recruitment/RecruitmentDashboard';
import RecruitmentPipeline from './Recruitment/RecruitmentPipeline';
import RecruitmentSurvey from './Recruitment/RecruitmentSurvey';
import RecruitmentCandidate from './Recruitment/RecruitmentCandidate';
import Interview from './Recruitment/Interview';
import OpenJobs from './Recruitment/OpenJobs';
import SkillZone from './Recruitment/SkillZone';
//Onboarding
import OnboardingView from './Onboarding/OnboardingView';
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
import { fetchHolidays, createHoliday, updateHoliday, deleteHoliday, fetchFilteredHolidays } from './configuration/Holidays';

 
// import OnboardingView from './onboarding/OnboardingView';

        // Sangeeta integration
//Payroll
import PayrollDashboard from './Payroll/PayrollDashboard';
import Allowances from './Payroll/Allowances';
import CreateAllowance from './Payroll/CreateAllowance';
import Contract from './Payroll/Contract';
import Deductions from './Payroll/Deductions';
import FederalTax from './Payroll/FederalTax';
import Payslips from './Payroll/Payslips';
import CreateDeduction from './Payroll/CreateDeduction';
//Performance
import PerformanceDashboard from './Performance/PerformanceDashboard';
import Objectives from './Performance/Objectives';
import Feedback from './Performance/Feedback';
import CreateFeedback from './Performance/CreateFeedback';
//offboarding
import HomePage  from './Offboarding/HomePage';
import ResignationPage from './Offboarding/ResignationPage';

import QuickActionButton from './QuickActionButton';



 
 
 
function Dashboard() {
  const {categoryId} = useParams();// for category id of faq
  // State to manage the active screen
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('67343940a35795672c4c79a1');
  const [feedbackData, setFeedbackData] = useState({
    selfFeedback: [
      { type: 'selfFeedback', id: 1, employee: 'Hannah Brooks', title: 'Bewertung', status: 'Not Started', startDate: 'Nov. 1, 2024', dueDate: 'Nov. 1, 2024' },
      { type: 'selfFeedback', id: 2, employee: 'Virat Kohli', title: 'Cricketer', status: 'Started', startDate: 'Dec. 1, 2022', dueDate: 'Dec. 1, 2024' },
      { type: 'selfFeedback', id: 3, employee: 'Anusha Shetty', title: 'Trainer', status: 'Started', startDate: 'Jul. 21, 2024', dueDate: 'Jun. 1, 2025' },
    ],
    requestedFeedback: [
      { type: 'requestedFeedback', id: 4, employee: 'Caleb Fisher', title: 'Tinubu’s Performance', status: 'On Track', startDate: 'Oct. 31, 2024', dueDate: 'Oct. 31, 2024' },
      { type: 'requestedFeedback', id: 5, employee: 'John Admin', title: 'Administrator', status: 'Closed', startDate: 'Oct. 12, 2020', dueDate: 'Nov. 31, 2020' },
      { type: 'requestedFeedback', id: 6, employee: 'Sania Fisher', title: 'Developer', status: 'On Track', startDate: 'Jan. 31, 2016', dueDate: 'Feb. 1, 2016' },
    ],
    feedbackToReview: [
      { type: 'feedbackToReview', id: 7, employee: 'Lucy Cruz', title: 'Tinubu’s Performance', status: 'Closed', startDate: 'Mar. 31, 2022', dueDate: 'Apr. 31, 2023' },
      { type: 'feedbackToReview', id: 8, employee: 'Amitha Chaudhary', title: 'React Developer', status: 'On Track', startDate: 'May. 17, 2004', dueDate: 'Jun. 17, 2004' },
      { type: 'feedbackToReview', id: 9, employee: 'Ravi Gautam', title: 'Civil Engineer', status: 'Started', startDate: 'Aug. 15, 2019', dueDate: 'Sept. 15, 2019' },
    ],
    anonymousFeedback: [
      { type: 'anonymousFeedback', id: 10, employee: 'Alice Foster', title: 'Django Developer Feedback', status: 'On Track', startDate: 'May 1, 2024', dueDate: 'May 31, 2024' },
      { type: 'anonymousFeedback', id: 11, employee: 'Priyanka Gautam', title: 'Node Developer Feedback', status: 'Not Started', startDate: 'Sept 1, 2024', dueDate: 'Oct 31, 2024' },
      { type: 'anonymousFeedback', id: 12, employee: 'Sheetal Yadav', title: 'Redux Developer Feedback', status: 'Started', startDate: 'Nov 1, 2021', dueDate: 'Dec 31, 2021' },
    ],
  });


  const addFeedback = (newFeedback) => {
    setFeedbackData([...feedbackData, newFeedback]);
  };

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
        return <MyLeaveRequests /> 
      
        //dinesh
        //assets
      case "assetsDashboard":
        return <AssetDashboard />
      case "assetView":
        return <AssetView />      
      case "assetBatches":
        return <AssetBatch />
      case "assetHistory":
        return <AssetHistory />
        
      //faq    
      // In the renderScreen switch statement:
      case 'faqCategory':
        return <FaqCategory/>;
      case 'faqPage':
        return <FaqPage categoryId={categoryId} />;
  
      // case 'faqCategory':
      //   return <FaqCategory />;
      // case `faq/${categoryId}`:
      //   return <FaqPage />;


       //config       
      case "holidays":
        return <Holidays />
      case "companyLeaves":
        return <CompanyHolidays />
      case "restrictLeaves":
        return <RestrictLeaves />

      
        
      
      case "payrollDashboard":
        return <PayrollDashboard />;
      case "allowances":
        return <Allowances />;
      case "/allowances/create":
        return <CreateAllowance setActiveScreen={setActiveScreen}  />;
      case "contract":
        return <Contract />;
      case "deductions":
        return <Deductions />;
      case 'createDeduction':
        return <CreateDeduction />;
      case "federalTax":
        return <FederalTax />;
      case "payslips":
        return <Payslips />;

      // Performance Routes  
      case 'performanceDashboard':
        return <PerformanceDashboard />;
      case 'objectives':
        return <Objectives />;
      case 'feedback':
        return <Feedback feedbackData={feedbackData} setFeedbackData={setFeedbackData} />;
      case '/feedback/create':
        return <CreateFeedback addFeedback={addFeedback} />;

      // Offboarding Routes
      case 'exitProcess':
        return <HomePage />;
      case 'resignationLetter':
        return <ResignationPage />;


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
      <QuickActionButton setSelectedPage={setActiveScreen} />
    </div>
  );
  
}

export default Dashboard;