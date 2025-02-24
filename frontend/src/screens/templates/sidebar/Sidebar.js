import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faChartBar,
  faClockRotateLeft,
  faBullseye,
  faRocket,
  faUsers,
  faCalendarCheck,
  faCalendarTimes,
  faMoneyBillWave,
  faChartLine,
  faSignOutAlt,
  faLaptop,
  faHeadset,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

function Sidebar() {
  const [activeMenu, setActiveMenu] = useState("");
  const navigate = useNavigate();

  const handleMainClick = (menu) => {
    setActiveMenu(menu === activeMenu ? "" : menu);
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
        <li onClick={() => handleNavigation("/Dashboards")}>
          <FontAwesomeIcon icon={faChartPie} />
          <span>Dashboard</span>
        </li>

        <li onClick={() => handleMainClick("timesheet")}>
          <FontAwesomeIcon icon={faClockRotateLeft} />
          <span>Timesheet</span>
        </li>
        {activeMenu === "timesheet" && (
          <ul className="sub-menu">
            <li onClick={() => handleNavigation("/Dashboards/timesheet")}>
              Timesheet Dashboard
            </li>
          </ul>
        )}

        <li onClick={() => handleMainClick("recruitment")}>
          <FontAwesomeIcon icon={faBullseye} />
          <span>Recruitment</span>
        </li>
        {activeMenu === "recruitment" && (
          <ul className="sub-menu">
            <li
              onClick={() =>
                handleNavigation("/Dashboards/recruitment-dashboard")
              }
            >
              Dashboard
            </li>
            <li
              onClick={() =>
                handleNavigation("/Dashboards/recruitment-pipeline")
              }
            >
              Recruitment Pipeline
            </li>
            <li
              onClick={() => handleNavigation("/Dashboards/recruitment-survey")}
            >
              Recruitment Survey
            </li>
            <li onClick={() => handleNavigation("/Dashboards/candidates")}>
              Candidates
            </li>
            <li onClick={() => handleNavigation("/Dashboards/interview")}>
              Interview
            </li>
            <li onClick={() => handleNavigation("/Dashboards/skill-zone")}>
              Skill Zone
            </li>
          </ul>
        )}

        <li onClick={() => handleMainClick("onboarding")}>
          <FontAwesomeIcon icon={faRocket} />
          <span>Onboarding</span>
        </li>
        {activeMenu === "onboarding" && (
          <ul className="sub-menu">
            <li onClick={() => handleNavigation("/Dashboards/onboarding-view")}>
              Onboarding View
            </li>
            <li onClick={() => handleNavigation("/Dashboards/candidates-view")}>
              Candidates View
            </li>
            <li onClick={() => handleNavigation("/Dashboards/onboarding-form")}>
              Onboarding Form
            </li>
          </ul>
        )}

        <li onClick={() => handleMainClick("reports")}>
          <FontAwesomeIcon icon={faChartBar} />
          <span>Reports</span>
        </li>
        {activeMenu === "reports" && (
          <ul className="sub-menu">
            <li onClick={() => handleNavigation("/Dashboards/employee-report")}>
              Employee Report
            </li>
          </ul>
        )}

        <li onClick={() => handleMainClick("employee")}>
          <FontAwesomeIcon icon={faUsers} />
          <span>Employee</span>
        </li>
        {activeMenu === "employee" && (
          <ul className="sub-menu">
            <li onClick={() => handleNavigation("/Dashboards/profile")}>
              Profile
            </li>
            <li onClick={() => handleNavigation("/Dashboards/employees")}>
              Employees
            </li>
            <li
              onClick={() => handleNavigation("/Dashboards/document-request")}
            >
              Document Requests
            </li>
            <li onClick={() => handleNavigation("/Dashboards/shift-requests")}>
              Shift Requests
            </li>
            <li
              onClick={() => handleNavigation("/Dashboards/work-type-request")}
            >
              Work Type Request
            </li>
            <li
              onClick={() =>
                handleNavigation("/Dashboards/rotating-shift-assign")
              }
            >
              Rotating Shift Assign
            </li>
            <li
              onClick={() =>
                handleNavigation("/Dashboards/rotating-worktype-assign")
              }
            >
              Rotating Work Type Assign
            </li>
            <li
              onClick={() =>
                handleNavigation("/Dashboards/disciplinary-actions")
              }
            >
              Disciplinary Actions
            </li>
            <li onClick={() => handleNavigation("/Dashboards/policies")}>
              Policies
            </li>
            <li
              onClick={() => handleNavigation("/Dashboards/organization-chart")}
            >
              Organization Chart
            </li>
          </ul>
        )}

        <li onClick={() => handleMainClick("attendance")}>
          <FontAwesomeIcon icon={faCalendarCheck} />
          <span>Attendance</span>
        </li>
        {activeMenu === "attendance" && (
          <ul className="sub-menu">
            <li
              onClick={() => handleNavigation("/Dashboards/attendance-records")}
            >
              Attendance Records
            </li>
            <li
              onClick={() => handleNavigation("/Dashboards/time-off-requests")}
            >
              Time Off Requests
            </li>
          </ul>
        )}

        <li onClick={() => handleMainClick("leave")}>
          <FontAwesomeIcon icon={faCalendarTimes} />
          <span>Leave</span>
        </li>
        {activeMenu === "leave" && (
          <ul className="sub-menu">
            <li
              onClick={() => handleNavigation("/Dashboards/my-leave-requests")}
            >
              My Leave Requests
            </li>
            <li onClick={() => handleNavigation("/Dashboards/leave-requests")}>
              Leave Requests
            </li>
          </ul>
        )}

        <li onClick={() => handleMainClick("payroll")}>
          <FontAwesomeIcon icon={faMoneyBillWave} />
          <span>Payroll</span>
        </li>
        {activeMenu === "payroll" && (
          <ul className="sub-menu">
            <li
              onClick={() => handleNavigation("/Dashboards/payroll-dashboard")}
            >
              Dashboard
            </li>
            <li onClick={() => handleNavigation("/Dashboards/payroll-system")}>
              Payroll system
            </li>
            <li onClick={() => handleNavigation("/Dashboards/allowances")}>
              Allowances
            </li>
            <li onClick={() => handleNavigation("/Dashboards/contract")}>
              Contract
            </li>
            <li onClick={() => handleNavigation("/Dashboards/deductions")}>
              Deductions
            </li>
            <li onClick={() => handleNavigation("/Dashboards/payslips")}>
              Payslips
            </li>
            <li onClick={() => handleNavigation("/Dashboards/federal-tax")}>
              Federal Tax
            </li>
          </ul>
        )}

        <li onClick={() => handleMainClick("performance")}>
          <FontAwesomeIcon icon={faChartLine} />
          <span>Performance</span>
        </li>
        {activeMenu === "performance" && (
          <ul className="sub-menu">
            <li
              onClick={() =>
                handleNavigation("/Dashboards/performance-dashboard")
              }
            >
              Dashboard
            </li>
            <li onClick={() => handleNavigation("/Dashboards/objectives")}>
              Objectives
            </li>
            <li onClick={() => handleNavigation("/Dashboards/feedback")}>
              360 Feedback
            </li>
          </ul>
        )}

        <li onClick={() => handleMainClick("offboarding")}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Offboarding</span>
        </li>
        {activeMenu === "offboarding" && (
          <ul className="sub-menu">
            <li onClick={() => handleNavigation("/Dashboards/exit-process")}>
              Exit Process
            </li>
            <li
              onClick={() => handleNavigation("/Dashboards/resignation-letter")}
            >
              Resignation Letters
            </li>
          </ul>
        )}

        <li onClick={() => handleMainClick("assets")}>
          <FontAwesomeIcon icon={faLaptop} />
          <span>Assets</span>
        </li>
        {activeMenu === "assets" && (
          <ul className="sub-menu">
            <li
              onClick={() => handleNavigation("/Dashboards/assets-dashboard")}
            >
              Dashboard
            </li>
            <li onClick={() => handleNavigation("/Dashboards/asset-view")}>
              Asset View
            </li>
            <li onClick={() => handleNavigation("/Dashboards/asset-batches")}>
              Asset Batches
            </li>
            <li onClick={() => handleNavigation("/Dashboards/asset-history")}>
              Asset History
            </li>
          </ul>
        )}

        <li onClick={() => handleMainClick("helpDesk")}>
          <FontAwesomeIcon icon={faHeadset} />
          <span>Help Desk</span>
        </li>
        {activeMenu === "helpDesk" && (
          <ul className="sub-menu">
            <li onClick={() => handleNavigation("/Dashboards/faq-category")}>
              FAQs
            </li>
          </ul>
        )}

        <li onClick={() => handleMainClick("configuration")}>
          <FontAwesomeIcon icon={faCogs} />
          <span>Configuration</span>
        </li>
        {activeMenu === "configuration" && (
          <ul className="sub-menu">
            <li onClick={() => handleNavigation("/Dashboards/holidays")}>
              Holidays
            </li>
            <li onClick={() => handleNavigation("/Dashboards/company-leaves")}>
              Company Leaves
            </li>
            <li onClick={() => handleNavigation("/Dashboards/restrict-leaves")}>
              Restrict Leaves
            </li>
          </ul>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;
