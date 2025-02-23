import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';
import { useSidebar } from "../../Context";
import QuickActionButton from './QuickActionButton';
import TimesheetDashboard from '../../components/TimesheetDashboard';
import "./Dashboard.css";
import axios from 'axios';

// All component imports remain the same as in previous code...
import MainDashboard from "./MainDashboard";
import DocumentRequestPage from './productManagement/DocumentRequestPage';
import RecruitmentDashboard from "./Recruitment/RecruitmentDashboard";
import RecruitmentPipeline from "./Recruitment/RecruitmentPipeline";
import RecruitmentSurvey from "./Recruitment/RecruitmentSurvey";
import RecruitmentCandidate from "./Recruitment/RecruitmentCandidate";
import Interview from "./Recruitment/Interview";
import SkillZone from "./Recruitment/SkillZone";
import OnboardingView from "./Onboarding/OnboardingView_1";
import OnboardingForms from "./Onboarding/OnboardingForms";
import CandidatesView from "./Onboarding/CandidateView";
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
import PayrollDashboard from "./Payroll/PayrollDashboard";
import Allowances from "./Payroll/Allowances";
import CreateAllowance from "./Payroll/CreateAllowance";
import Contract from "./Payroll/Contract";
import Deductions from "./Payroll/Deductions";
import CreateDeduction from "./Payroll/CreateDeduction";
import FederalTax from "./Payroll/FederalTax";
import Payslips from "./Payroll/Payslips";
import PerformanceDashboard from "./Performance/PerformanceDashboard";
import Objectives from "./Performance/Objectives";
import Feedback from "./Performance/Feedback";
import CreateFeedback from "./Performance/CreateFeedback";
import ExitPage from "./Offboarding/ExitPage";
import ResignationPage from "./Offboarding/ResignationPage";
import PayrollSystem from "./Payroll/Payrollsystem";


function Dashboard() {
  const { isSidebarOpen } = useSidebar();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleProfileNavigation = async (employeeId) => {
    try {
      const response = await axios.get(`/api/employees/verify/${employeeId}`);
      if (response.data.email) {
        navigate(`/Dashboards/profile/${employeeId}`);
      }
    } catch (error) {
      console.log('User verification failed');
    }
  };

  return (
    <div className={`dashboard-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Sidebar onNavigate={handleNavigation} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<MainDashboard />} />
          <Route path="/timesheet" element={<TimesheetDashboard />} />
          <Route path="/onboarding-view" element={<OnboardingView />} />
          <Route path="/onboarding-form" element={<OnboardingForms />} />
          <Route path="/recruitment-dashboard" element={<RecruitmentDashboard />} />
          <Route path="/recruitment-pipeline" element={<RecruitmentPipeline />} />
          <Route path="/recruitment-survey" element={<RecruitmentSurvey />} />
          <Route path="/candidates" element={<RecruitmentCandidate />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/skill-zone" element={<SkillZone />} />
          <Route path="/candidates-view" element={<CandidatesView />} />

          <Route path="/profile/:id" element={<ProfilePage 
      onVerify={handleProfileNavigation}
    />
          }
          />

          {/* <Route path="/profile/:Id" element={<ProfilePage />} /> */}
          <Route path="/employees" element={<EmployeeListing onNavigate={handleNavigation} />} />
          <Route path="/document-request" element={<DocumentRequestPage />} />
          <Route path="/work-type-request" element={<WorkTypeRequest />} />
          <Route path="/shift-requests" element={<ShiftRequests />} />
          <Route path="/rotating-shift-assign" element={<RotatingShiftAssign />} />
          <Route path="/disciplinary-actions" element={<DisciplinaryActions />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/organization-chart" element={<OrganizationChart />} />
          <Route path="/rotating-worktype-assign" element={<RotatingWorktypeAssign />} />
          <Route path="/attendance-records" element={<AttendanceRecords />} />
          <Route path="/time-off-requests" element={<TimeOffRequests />} />
          <Route path="/leave-requests" element={<LeaveRequests />} />
          <Route path="/my-leave-requests" element={<MyLeaveRequests />} />
          <Route path="/assets-dashboard" element={<AssetDashboard />} />
          <Route path="/asset-view" element={<AssetView />} />
          <Route path="/asset-batches" element={<AssetBatch />} />
          <Route path="/asset-history" element={<AssetHistory />} />
          <Route path="/faq-category" element={<FaqCategory />} />
          <Route path="/faq/:categoryId" element={<FaqPage />} />
          <Route path="/holidays" element={<Holidays />} />
          <Route path="/company-leaves" element={<CompanyHolidays />} />
          <Route path="/restrict-leaves" element={<RestrictLeaves />} />
          <Route path="/payroll-dashboard" element={<PayrollDashboard />} />
          <Route path="/allowances" element={<Allowances />} />
          <Route path="/allowances/create" element={<CreateAllowance onNavigate={handleNavigation} />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/deductions" element={<Deductions />} />
          <Route path="/create-deduction" element={<CreateDeduction />} />
          <Route path="/federal-tax" element={<FederalTax />} />
          <Route path="/payslips" element={<Payslips />} />
          <Route path="/performance-dashboard" element={<PerformanceDashboard />} />
          <Route path="/objectives" element={<Objectives />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/create-feedback" element={<CreateFeedback />} />
          <Route path="/exit-process" element={<ExitPage />} />
          <Route path="/resignation-letter" element={<ResignationPage />} />
          <Route path="/payroll-system" element={<PayrollSystem />} />
        </Routes>
      </div>
      <QuickActionButton onNavigate={handleNavigation} />
    </div>
  );
}

export default Dashboard;

