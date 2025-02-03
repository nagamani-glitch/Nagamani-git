import React, { useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import { useParams } from "react-router-dom";
import DocumentRequestPage from "./productManagement/DocumentRequestPage";

//Subikshan Integration
//Dasboard
import MainDashboard from "./MainDashboard";
//Recruitment
import RecruitmentDashboard from "./Recruitment/RecruitmentDashboard";
import RecruitmentPipeline from "./Recruitment/RecruitmentPipeline";
import RecruitmentSurvey from "./Recruitment/RecruitmentSurvey";
import RecruitmentCandidate from "./Recruitment/RecruitmentCandidate";
import Interview from "./Recruitment/Interview";
// import OpenJobs from './Recruitment/OpenJobs';
import SkillZone from "./Recruitment/SkillZone";
//Onboarding
import OnboardingView from "./Onboarding/OnboardingView_1";
//harish
import OnboardingForms from "./Onboarding/OnboardingForms";
import CandidatesView from "./Onboarding/CandidateView";
import "./Dashboard.css";
import { useSidebar } from "../../Context";
import EmployeeListing from "./employeeListing/EmployeeListing";
import WorkTypeRequest from "./workTypeRequest/WorkTypeRequest";
import ShiftRequests from "./shiftRequest/ShiftRequest";
import RotatingShiftAssign from "./rotatingShiftAssign/RotatingShiftAssign";
import DisciplinaryActions from "./disciplinaryActions/DisciplinaryActions";
import Policies from "./policies/Policies";
import OrganizationChart from "./organizationChart/OrganizationChart";
import RotatingWorktypeAssign from "./rotatingWorktypeAssign/RotatingWorktypeAssign";
import AttendanceRecords from "./attendanceRecords/AttendanceRecords";
import TimeOffRequests from "./timeOffRequests/TimeOffRequests";
import ProfilePage from "./profilePage/ProfilePage";
import MyLeaveRequests from "./myLeaveRequests/MyLeaveRequests";
import LeaveRequests from "./leaveRequests/LeaveRequests";
import AssetHistory from "./Assets/AssetHistory";
import AssetView from "./Assets/AssetView";
import AssetBatch from "./Assets/AssetBatch";
import AssetDashboard from "./Assets/AssetDashboard";
import Holidays from "./configuration/Holidays";
import CompanyHolidays from "./configuration/CompanyHolidays";
import RestrictLeaves from "./configuration/RestrictLeaves";
import FaqCategory from "./faqs/FaqCategory";
import FaqPage from "./faqs/FaqPage";

// Sangeeta integration
//Payroll
import PayrollDashboard from "./Payroll/PayrollDashboard";
import Allowances from "./Payroll/Allowances";
import CreateAllowance from "./Payroll/CreateAllowance";
import Contract from "./Payroll/Contract";
import Deductions from "./Payroll/Deductions";
import FederalTax from "./Payroll/FederalTax";
import Payslips from "./Payroll/Payslips";
import CreateDeduction from "./Payroll/CreateDeduction";
//Performance
import PerformanceDashboard from "./Performance/PerformanceDashboard";
import Objectives from "./Performance/Objectives";
import Feedback from "./Performance/Feedback";
import CreateFeedback from "./Performance/CreateFeedback";
//offboarding
import ExitPage from "./Offboarding/ExitPage";
import ResignationPage from "./Offboarding/ResignationPage";

import QuickActionButton from "./QuickActionButton";

function Dashboard() {
  const { categoryId } = useParams(); // for category id of faq
  // State to manage the active screen
  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(
    "67343940a35795672c4c79a1"
  );

  const { isSidebarOpen } = useSidebar();

  // Function to render the correct component based on the active screen
  const renderScreen = () => {
    switch (activeScreen) {
      case "onboardingView":
        return <OnboardingView />;
      case "onboardingForm":
        return <OnboardingForms />;
      case "dashboard":
        return <MainDashboard />;
      case "recruitmentdashboard":
        return <RecruitmentDashboard />;
      case "recruitmentPipeline":
        return <RecruitmentPipeline />;
      case "recruitmentSurvey":
        return <RecruitmentSurvey />;
      case "candidates":
        return <RecruitmentCandidate />;
      case "interview":
        return <Interview />;
      // case 'openJobs':
      //   return <OpenJobs />;
      case "skillZone":
        return <SkillZone />;
      case "candidatesView":
        return <CandidatesView />;
      case "profile":
        return <ProfilePage employeeId={selectedEmployeeId} />;
      case "employee":
        return <EmployeeListing onEmployeeClick={handleEmployeeClick} />;
      case "documentRequest":
        return <DocumentRequestPage />;
      case "workTypeRequest":
        return <WorkTypeRequest />;
      case "shiftRequests":
        return <ShiftRequests />;
      case "rotatingShiftAssign":
        return <RotatingShiftAssign />;
      case "disciplinaryActions":
        return <DisciplinaryActions />;
      case "policies":
        return <Policies />;
      case "organizationChart":
        return <OrganizationChart />;
      case "rotatingWorktypeAssign":
        return <RotatingWorktypeAssign />;
      case "attendanceRecords":
        return <AttendanceRecords />;
      case "timeOffRequests":
        return <TimeOffRequests />;
      case "leaveRequests":
        return <LeaveRequests />;
      case "myLeaveRequests":
        return <MyLeaveRequests />;

      //dinesh
      //assets
      case "assetsDashboard":
        return <AssetDashboard />;
      case "assetView":
        return <AssetView />;
      case "assetBatches":
        return <AssetBatch />;
      case "assetHistory":
        return <AssetHistory />;

      //faq
      // In the renderScreen switch statement:
      case "faqCategory":
        return <FaqCategory />;
      case "faq/:categoryId":
        return <FaqPage />;

      //config
      case "holidays":
        return <Holidays />;
      case "companyLeaves":
        return <CompanyHolidays />;
      case "restrictLeaves":
        return <RestrictLeaves />;

        // Sangeeta
        return <RestrictLeaves />;

      case "payrollDashboard":
        return <PayrollDashboard />;
      case "allowances":
        return <Allowances />;
      case "/allowances/create":
        return <CreateAllowance setActiveScreen={setActiveScreen} />;
      case "contract":
        return <Contract />;
      case "deductions":
        return <Deductions />;
      case "createDeduction":
        return <CreateDeduction />;
      case "federalTax":
        return <FederalTax />;
      case "payslips":
        return <Payslips />;

      // Performance Routes
      case "performanceDashboard":
        return <PerformanceDashboard />;
      case "objectives":
        return <Objectives />;

      case "feedback":
        return <Feedback />;
      case "createFeedback":
        return <CreateFeedback />;

      // Offboarding Routes
      case "exitProcess":
        return <ExitPage />;
      case "resignationLetter":
        return <ResignationPage />;
      default:
        return null;
    }
  };

  const handleEmployeeClick = (id) => {
    setSelectedEmployeeId(id);
    setActiveScreen("profile");
  };

  return (
    <div
      className={`dashboard-container ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      <Sidebar setActiveScreen={setActiveScreen} />
      <div className="main-content">{renderScreen()}</div>
      <QuickActionButton setSelectedPage={setActiveScreen} />
    </div>
  );
}

export default Dashboard;
