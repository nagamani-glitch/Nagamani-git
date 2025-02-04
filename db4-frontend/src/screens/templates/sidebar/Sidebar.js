// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faChartPie,
//   faBullseye,
//   faRocket,
//   faUsers,
//   faCalendarCheck,
//   faCalendarTimes,
//   faMoneyBillWave,
//   faChartLine,
//   faSignOutAlt,
//   faLaptop,
//   faHeadset,
//   faCogs,
// } from '@fortawesome/free-solid-svg-icons';
// import './Sidebar.css';

// function Sidebar({ setActiveScreen }) {
//   const [activeMenu, setActiveMenu] = useState('');
//   const [activeSubMenu, setActiveSubMenu] = useState('');

//   const handleMainClick = (menu) => {
//     setActiveMenu(menu === activeMenu ? '' : menu); // Toggle menu
//     setActiveSubMenu(''); // Reset sub-menu on main menu change
//   };

//   const handleSubClick = (subMenu) => {
//     setActiveSubMenu(subMenu);
//     setActiveScreen(subMenu); // Pass the active sub-menu to the main screen
//     console.log(activeSubMenu)
//   };

//   return (
//     <aside className="sidebar">
//       <div>
//         <h5 style={{ color: "white" }}>DB4Cloud</h5>
//         <p style={{ color: "white" }}>My Company</p>
//         <hr />
//       </div>
//       <ul>
//         <li onClick={() => handleSubClick('dashboard')}>
//           <FontAwesomeIcon icon={faChartPie} /> Dashboard
//         </li>
//         <li onClick={() => handleMainClick('recruitment')}>
//           <FontAwesomeIcon icon={faBullseye} /> Recruitment
//         </li>
//         {activeMenu === 'recruitment' && (
//           <ul className="sub-menu">
//             <li onClick={() => handleSubClick('recruitmentdashboard')}>Dashboard</li>
//             <li onClick={() => handleSubClick('recruitmentPipeline')}>Recruitment Pipeline</li>
//             <li onClick={() => handleSubClick('recruitmentSurvey')}>Recruitment Survey</li>
//             <li onClick={() => handleSubClick('candidates')}>Candidates</li>
//             <li onClick={() => handleSubClick('interview')}>Interview</li>
//             {/* <li onClick={() => handleSubClick('openJobs')}>Open Jobs</li> */}
//             <li onClick={() => handleSubClick('skillZone')}>Skill Zone</li>
//           </ul>
//         )}

//         <li onClick={() => handleMainClick('onboarding')}>
//           <FontAwesomeIcon icon={faRocket} /> Onboarding
//         </li>
//         {activeMenu === 'onboarding' && (
//           <ul className="sub-menu">
//             <li onClick={() => handleSubClick('onboardingView')}>Onboarding View </li>
//             <li onClick={() => handleSubClick('candidatesView')}>Candidates View</li>
//             <li onClick={() => handleSubClick('onboardingForm')}>Onboarding Form </li>
//           </ul>
//         )}

//         <li onClick={() => handleMainClick('employee')}>
//           <FontAwesomeIcon icon={faUsers} /> Employee
//         </li>
//         {activeMenu === 'employee' && (
//           <ul className="sub-menu">
//             <li onClick={() => handleSubClick('profile')}>Profile</li>
//             <li onClick={() => handleSubClick('employee')}>Employees</li>
//             <li onClick={() => handleSubClick('documentRequest')}>Document Requests</li>
//             <li onClick={() => handleSubClick('shiftRequests')}>Shift Requests</li>
//             <li onClick={() => handleSubClick('workTypeRequest')}>Work Type Request</li>
//             <li onClick={() => handleSubClick('rotatingShiftAssign')}>Rotating Shift Assign</li>
//             <li onClick={() => handleSubClick('rotatingWorktypeAssign')}>Rotating Work Type Assign</li>
//             <li onClick={() => handleSubClick('disciplinaryActions')}>Disciplinary Actions</li>
//             <li onClick={() => handleSubClick('policies')}>Policies</li>
//             <li onClick={() => handleSubClick('organizationChart')}>Organization Chart</li>
//           </ul>
//         )}

//         <li onClick={() => handleMainClick('attendance')}>
//           <FontAwesomeIcon icon={faCalendarCheck} /> Attendance
//         </li>
//         {activeMenu === 'attendance' && (
//           <ul className="sub-menu">
//             <li onClick={() => handleSubClick('attendanceRecords')}>Attendance Records</li>
//             <li onClick={() => handleSubClick('timeOffRequests')}>Time Off Requests</li>
//           </ul>
//         )}

//         <li onClick={() => handleMainClick('leave')}>
//           <FontAwesomeIcon icon={faCalendarTimes} /> Leave
//         </li>
//         {activeMenu === 'leave' && (
//           <ul className="sub-menu">
//             <li onClick={() => handleSubClick('myLeaveRequests')}>My Leave Requests</li>
//             <li onClick={() => handleSubClick('leaveRequests')}>Leave Requests</li>
//           </ul>
//         )}


//         <li onClick={() => handleMainClick('payroll')}>
//           <FontAwesomeIcon icon={faMoneyBillWave} /> Payroll
//         </li>
//         {activeMenu === 'payroll' && (
//           <ul className="sub-menu">
//             <li onClick={() => handleSubClick('payrollDashboard')}>Dashboard</li>
//             <li onClick={() => handleSubClick('allowances')}>Allowances</li>
//             {/* <li onClick={() => handleSubClick('createAllowance')}>Create Allowance</li> */}
//             <li onClick={() => handleSubClick('contract')}>Contract</li>
//             <li onClick={() => handleSubClick('deductions')}>Deductions</li>
//             {/* <li onClick={() => handleSubClick('createDeduction')}>Create Deduction</li> */}
//             <li onClick={() => handleSubClick('payslips')}>Payslips</li>
//             <li onClick={() => handleSubClick('federalTax')}>Federal Tax</li>
//           </ul>
//         )}

//         <li onClick={() => handleMainClick('performance')}>
//           <FontAwesomeIcon icon={faChartLine} /> Performance
//         </li>
//         {activeMenu === 'performance' && (
//           <ul className="sub-menu">
//             <li onClick={() => handleSubClick('performanceDashboard')}>Dashboard</li>
//             <li onClick={() => handleSubClick('objectives')}>Objectives</li>
//             <li onClick={() => handleSubClick('feedback')}>360 Feedback</li>
//             {/* <li onClick={() => handleSubClick('createFeedback')}>Create Feedback</li> */}
//           </ul>
//         )}

//         <li onClick={() => handleMainClick('offboarding')}>
//           <FontAwesomeIcon icon={faSignOutAlt} /> Offboarding
//         </li>
//         {activeMenu === 'offboarding' && (
//           <ul className="sub-menu">
//             <li onClick={() => handleSubClick('exitProcess')}>Exit Process</li>
//             <li onClick={() => handleSubClick('resignationLetter')}>Resignation Letters</li>
//           </ul>
//         )}

//         <li onClick={() => handleMainClick('assets')}>
//           <FontAwesomeIcon icon={faLaptop} /> Assets
//         </li>
//         {activeMenu === 'assets' && (
//           <ul className="sub-menu">
//             <li onClick={() => handleSubClick('assetsDashboard')}>Dashboard</li>
//             <li onClick={() => handleSubClick('assetView')}>Asset View</li>
//             <li onClick={() => handleSubClick('assetBatches')}>Asset Batches</li>
//             {/* <li onClick={() => handleSubClick('requestAndAllocation')}>Request and Allocation</li> */}
//             <li onClick={() => handleSubClick('assetHistory')}>Asset History</li>
//           </ul>
//         )}

//         <li onClick={() => handleMainClick('helpDesk')}>
//           <FontAwesomeIcon icon={faHeadset} /> Help Desk
//         </li>
//         {activeMenu === 'helpDesk' && (
//           <ul className="sub-menu">
//             <li onClick={() => handleSubClick('faqCategory')}>FAQs</li>
//             {/* <li onClick={() => handleSubClick('tickets')}>Tickets</li> */}

//           </ul>
//         )}
//         <li onClick={() => handleMainClick('configuration')}>
//           <FontAwesomeIcon icon={faCogs} />  Configuration
//         </li>
//         {activeMenu === 'configuration' && (
//           <ul className="sub-menu">

//             <li onClick={() => handleSubClick('holidays')}>Holidays</li>
//             <li onClick={() => handleSubClick('companyLeaves')}>Company Leaves</li>
//             <li onClick={() => handleSubClick('restrictLeaves')}>Restrict Leaves</li>
//           </ul>
//         )}


//       </ul>
//     </aside>
//   );
// }

// export default Sidebar;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie, faBullseye, faRocket, faUsers, 
  faCalendarCheck, faCalendarTimes, faMoneyBillWave, 
  faChartLine, faSignOutAlt, faLaptop, faHeadset, faCogs
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

function Sidebar() {
  const [activeMenu, setActiveMenu] = useState('');
  const navigate = useNavigate();

  const handleMainClick = (menu) => {
    setActiveMenu(menu === activeMenu ? '' : menu);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside className="sidebar">
      <div>
        <h5 style={{ color: "white" }}>DB4Cloud</h5>
        <p style={{ color: "white" }}>My Company</p>
        <hr />
      </div>
      <ul>
        <li onClick={() => handleNavigation('/Dashboards')}>
          <FontAwesomeIcon icon={faChartPie} /> Dashboard
        </li>

        <li onClick={() => handleMainClick('recruitment')}>
          <FontAwesomeIcon icon={faBullseye} /> Recruitment
        </li>
        {activeMenu === 'recruitment' && (
          <ul className="sub-menu">
            <li onClick={() => handleNavigation('/Dashboards/recruitment-dashboard')}>Dashboard</li>
            <li onClick={() => handleNavigation('/Dashboards/recruitment-pipeline')}>Recruitment Pipeline</li>
            <li onClick={() => handleNavigation('/Dashboards/recruitment-survey')}>Recruitment Survey</li>
            <li onClick={() => handleNavigation('/Dashboards/candidates')}>Candidates</li>
            <li onClick={() => handleNavigation('/Dashboards/interview')}>Interview</li>
            <li onClick={() => handleNavigation('/Dashboards/skill-zone')}>Skill Zone</li>
          </ul>
        )}

        <li onClick={() => handleMainClick('onboarding')}>
          <FontAwesomeIcon icon={faRocket} /> Onboarding
        </li>
        {activeMenu === 'onboarding' && (
          <ul className="sub-menu">
            <li onClick={() => handleNavigation('/Dashboards/onboarding-view')}>Onboarding View</li>
            <li onClick={() => handleNavigation('/Dashboards/candidates-view')}>Candidates View</li>
            <li onClick={() => handleNavigation('/Dashboards/onboarding-form')}>Onboarding Form</li>
          </ul>
        )}

        <li onClick={() => handleMainClick('employee')}>
          <FontAwesomeIcon icon={faUsers} /> Employee
        </li>
        {activeMenu === 'employee' && (
          <ul className="sub-menu">
            <li onClick={() => handleNavigation('/Dashboards/profile')}>Profile</li>
            <li onClick={() => handleNavigation('/Dashboards/employees')}>Employees</li>
            <li onClick={() => handleNavigation('/Dashboards/document-request')}>Document Requests</li>
            <li onClick={() => handleNavigation('/Dashboards/shift-requests')}>Shift Requests</li>
            <li onClick={() => handleNavigation('/Dashboards/work-type-request')}>Work Type Request</li>
            <li onClick={() => handleNavigation('/Dashboards/rotating-shift-assign')}>Rotating Shift Assign</li>
            <li onClick={() => handleNavigation('/Dashboards/rotating-worktype-assign')}>Rotating Work Type Assign</li>
            <li onClick={() => handleNavigation('/Dashboards/disciplinary-actions')}>Disciplinary Actions</li>
            <li onClick={() => handleNavigation('/Dashboards/policies')}>Policies</li>
            <li onClick={() => handleNavigation('/Dashboards/organization-chart')}>Organization Chart</li>
          </ul>
        )}

        <li onClick={() => handleMainClick('attendance')}>
          <FontAwesomeIcon icon={faCalendarCheck} /> Attendance
        </li>
        {activeMenu === 'attendance' && (
          <ul className="sub-menu">
            <li onClick={() => handleNavigation('/Dashboards/attendance-records')}>Attendance Records</li>
            <li onClick={() => handleNavigation('/Dashboards/time-off-requests')}>Time Off Requests</li>
          </ul>
        )}

        <li onClick={() => handleMainClick('leave')}>
          <FontAwesomeIcon icon={faCalendarTimes} /> Leave
        </li>
        {activeMenu === 'leave' && (
          <ul className="sub-menu">
            <li onClick={() => handleNavigation('/Dashboards/my-leave-requests')}>My Leave Requests</li>
            <li onClick={() => handleNavigation('/Dashboards/leave-requests')}>Leave Requests</li>
          </ul>
        )}

        <li onClick={() => handleMainClick('payroll')}>
          <FontAwesomeIcon icon={faMoneyBillWave} /> Payroll
        </li>
        {activeMenu === 'payroll' && (
          <ul className="sub-menu">
            <li onClick={() => handleNavigation('/Dashboards/payroll-dashboard')}>Dashboard</li>
            <li onClick={() => handleNavigation('/Dashboards/allowances')}>Allowances</li>
            <li onClick={() => handleNavigation('/Dashboards/contract')}>Contract</li>
            <li onClick={() => handleNavigation('/Dashboards/deductions')}>Deductions</li>
            <li onClick={() => handleNavigation('/Dashboards/payslips')}>Payslips</li>
            <li onClick={() => handleNavigation('/Dashboards/federal-tax')}>Federal Tax</li>
          </ul>
        )}

        <li onClick={() => handleMainClick('performance')}>
          <FontAwesomeIcon icon={faChartLine} /> Performance
        </li>
        {activeMenu === 'performance' && (
          <ul className="sub-menu">
            <li onClick={() => handleNavigation('/Dashboards/performance-dashboard')}>Dashboard</li>
            <li onClick={() => handleNavigation('/Dashboards/objectives')}>Objectives</li>
            <li onClick={() => handleNavigation('/Dashboards/feedback')}>360 Feedback</li>
          </ul>
        )}

        <li onClick={() => handleMainClick('offboarding')}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Offboarding
        </li>
        {activeMenu === 'offboarding' && (
          <ul className="sub-menu">
            <li onClick={() => handleNavigation('/Dashboards/exit-process')}>Exit Process</li>
            <li onClick={() => handleNavigation('/Dashboards/resignation-letter')}>Resignation Letters</li>
          </ul>
        )}

        <li onClick={() => handleMainClick('assets')}>
          <FontAwesomeIcon icon={faLaptop} /> Assets
        </li>
        {activeMenu === 'assets' && (
          <ul className="sub-menu">
            <li onClick={() => handleNavigation('/Dashboards/assets-dashboard')}>Dashboard</li>
            <li onClick={() => handleNavigation('/Dashboards/asset-view')}>Asset View</li>
            <li onClick={() => handleNavigation('/Dashboards/asset-batches')}>Asset Batches</li>
            <li onClick={() => handleNavigation('/Dashboards/asset-history')}>Asset History</li>
          </ul>
        )}

        <li onClick={() => handleMainClick('helpDesk')}>
          <FontAwesomeIcon icon={faHeadset} /> Help Desk
        </li>
        {activeMenu === 'helpDesk' && (
          <ul className="sub-menu">
            <li onClick={() => handleNavigation('/Dashboards/faq-category')}>FAQs</li>
          </ul>
        )}

        <li onClick={() => handleMainClick('configuration')}>
          <FontAwesomeIcon icon={faCogs} /> Configuration
        </li>
        {activeMenu === 'configuration' && (
          <ul className="sub-menu">
            <li onClick={() => handleNavigation('/Dashboards/holidays')}>Holidays</li>
            <li onClick={() => handleNavigation('/Dashboards/company-leaves')}>Company Leaves</li>
            <li onClick={() => handleNavigation('/Dashboards/restrict-leaves')}>Restrict Leaves</li>
          </ul>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;
