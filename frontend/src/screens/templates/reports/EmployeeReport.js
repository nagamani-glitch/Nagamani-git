import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  DatePicker,
  Select,
  Button,
  Badge,
  Space,
  Statistic,
  Progress,
  message,
} from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import {
  DownloadOutlined,
  ReloadOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import axios from "axios";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import "./EmployeeReport.css"; // Add a separate CSS file for this component

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const EmployeeReport = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    stats: {
      totalOnboarded: 0,
      totalOffboarded: 0,
      averageOnboardingTime: 0,
      completionRate: 0,
    },
    trendData: [],
    departmentData: [],
    employeeData: [],
  });
  const [filterDepartment, setFilterDepartment] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState(null);
  const [timePeriod, setTimePeriod] = useState("6m");

  const { RangePicker } = DatePicker;
  const { Option } = Select;

  // Fetch report data from backend
  const fetchReportData = async (period = "6m") => {
    setLoading(true);
    try {
      // Get the current date
      const today = new Date();

      // Calculate the start date based on the selected time period
      let startDate = new Date();
      switch (period) {
        case "1m":
          startDate.setMonth(today.getMonth() - 1);
          break;
        case "3m":
          startDate.setMonth(today.getMonth() - 3);
          break;
        case "6m":
          startDate.setMonth(today.getMonth() - 6);
          break;
        case "1y":
          startDate.setFullYear(today.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(today.getMonth() - 6);
      }

      const response = await axios.get(
        `/api/employees/report?period=${period}&startDate=${startDate.toISOString()}`
      );
      if (response.data.success) {
        setReportData(response.data.data);
      } else {
        message.error("Failed to load report data");
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      message.error("Error loading report data");

      // Set some demo data for development/testing
      setReportData({
        stats: {
          totalOnboarded: 156,
          totalOffboarded: 42,
          averageOnboardingTime: 14,
          completionRate: 92,
        },
        trendData: [
          { month: "Jan", onboarded: 30, offboarded: 10 },
          { month: "Feb", onboarded: 25, offboarded: 8 },
          { month: "Mar", onboarded: 35, offboarded: 12 },
          { month: "Apr", onboarded: 28, offboarded: 15 },
          { month: "May", onboarded: 32, offboarded: 9 },
          { month: "Jun", onboarded: 40, offboarded: 7 },
        ],
        departmentData: [
          { name: "IT", value: 40 },
          { name: "HR", value: 25 },
          { name: "Finance", value: 20 },
          { name: "Marketing", value: 15 },
          { name: "Operations", value: 30 },
        ],
        employeeData: [
          {
            key: "1",
            empId: "EMP001",
            name: "John Doe",
            department: "IT",
            status: "Active",
            progress: 100,
            email: "john.doe@example.com",
            joiningDate: "2023-01-15",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=male",
          },
          {
            key: "2",
            empId: "EMP002",
            name: "Jane Smith",
            department: "HR",
            status: "Active",
            progress: 85,
            email: "jane.smith@example.com",
            joiningDate: "2023-02-20",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=female",
          },
          {
            key: "3",
            empId: "EMP003",
            name: "Mike Johnson",
            department: "Finance",
            status: "Inactive",
            progress: 90,
            email: "mike.johnson@example.com",
            joiningDate: "2022-11-05",
            avatar: "https://xsgames.co/randomusers/avatar.php?g=male",
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData(timePeriod);
  }, [timePeriod]);

  const handleRefresh = () => {
    fetchReportData(timePeriod);
    message.success("Report data refreshed");
  };
  
  // Export data to Excel
  const handleExport = () => {
    try {
      // Get filtered data
      const filteredData = getFilteredEmployeeData();

      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Create worksheets for different data

      // 1. Employee Data worksheet
      const employeeWorksheetData = filteredData.map((emp) => ({
        "Employee ID": emp.empId,
        Name: emp.name,
        Department: emp.department,
        Designation: emp.designation,
        Status: emp.status,
        Progress: `${emp.progress}%`,
        Email: emp.email || "N/A",
        "Joining Date": emp.joiningDate || "N/A",
      }));

      const employeeWorksheet = XLSX.utils.json_to_sheet(employeeWorksheetData);
      XLSX.utils.book_append_sheet(workbook, employeeWorksheet, "Employees");

      // 2. Department Distribution worksheet
      const departmentWorksheetData = reportData.departmentData.map((dept) => ({
        Department: dept.name,
        "Number of Employees": dept.value,
      }));

      const departmentWorksheet = XLSX.utils.json_to_sheet(
        departmentWorksheetData
      );
      XLSX.utils.book_append_sheet(
        workbook,
        departmentWorksheet,
        "Departments"
      );

      // 3. Monthly Trends worksheet
      const trendWorksheetData = reportData.trendData.map((trend) => ({
        Month: trend.month,
        Onboarded: trend.onboarded,
        Offboarded: trend.offboarded,
      }));

      const trendWorksheet = XLSX.utils.json_to_sheet(trendWorksheetData);
      XLSX.utils.book_append_sheet(workbook, trendWorksheet, "Monthly Trends");

      // 4. Summary Statistics worksheet
      const statsWorksheetData = [
        { Metric: "Total Onboarded", Value: reportData.stats.totalOnboarded },
        { Metric: "Total Offboarded", Value: reportData.stats.totalOffboarded },
        {
          Metric: "Average Onboarding Time (days)",
          Value: reportData.stats.averageOnboardingTime,
        },
        {
          Metric: "Completion Rate (%)",
          Value: reportData.stats.completionRate,
        },
      ];

      const statsWorksheet = XLSX.utils.json_to_sheet(statsWorksheetData);
      XLSX.utils.book_append_sheet(
        workbook,
        statsWorksheet,
        "Summary Statistics"
      );

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Get current date for filename
      const date = new Date();
      const dateString = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      // Save file
      FileSaver.saveAs(data, `Employee_Report_${dateString}.xlsx`);

      message.success("Report exported successfully");
    } catch (error) {
      console.error("Error exporting report:", error);
      message.error("Failed to export report");
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    // Filter data based on date range
  };

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "empId",
      key: "empId",
      sorter: (a, b) => a.empId.localeCompare(b.empId),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <Space>
          <img
            src={record.avatar}
            alt={text}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://xsgames.co/randomusers/avatar.php?g=pixel";
            }}
          />
          {text}
        </Space>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      filters: [
        { text: "Unassigned", value: "Unassigned" },
        ...reportData.departmentData
          .filter((dept) => dept.name !== "Unassigned")
          .map((dept) => ({ text: dept.name, value: dept.name })),
      ],
      onFilter: (value, record) => record.department === value,
      render: (department) => <span>{department}</span>,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      sorter: (a, b) => a.designation.localeCompare(b.designation),
      render: (designation) => <span>{designation}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "Active" },
        { text: "Incomplete", value: "Incomplete" },
        { text: "Inactive", value: "Inactive" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Badge
          status={
            status === "Active"
              ? "success"
              : status === "Incomplete"
              ? "warning"
              : "error"
          }
          text={status}
        />
      ),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      sorter: (a, b) => a.progress - b.progress,
      render: (progress) => (
        <Progress
          percent={progress}
          size="small"
          status={progress < 100 ? "active" : "success"}
        />
      ),
    },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      key: "joiningDate",
      sorter: (a, b) => {
        if (!a.joiningDate) return -1;
        if (!b.joiningDate) return 1;
        return new Date(a.joiningDate) - new Date(b.joiningDate);
      },
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() =>
              (window.location.href = `/Dashboards/profile/${record.empId}`)
            }
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  // Filter employee data based on selected filters
  const getFilteredEmployeeData = () => {
    let filteredData = [...reportData.employeeData];

    // Filter by status
    if (filterStatus !== "all") {
      const statusMap = {
        onboarded: "Active",
        offboarded: "Inactive",
        incomplete: "Incomplete",
      };
      filteredData = filteredData.filter(
        (emp) => emp.status === statusMap[filterStatus]
      );
    }

    // Filter by department
    if (filterDepartment.length > 0) {
      filteredData = filteredData.filter((emp) =>
        filterDepartment.includes(emp.department)
      );
    }

    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      filteredData = filteredData.filter((emp) => {
        if (!emp.joiningDate) return false;
        const joinDate = new Date(emp.joiningDate);
        return joinDate >= dateRange[0] && joinDate <= dateRange[1];
      });
    }

    return filteredData;
  };

  // Get time period options for trend chart
  const getTimePeriodOptions = () => {
    return [
      { label: "Last Month", value: "1m" },
      { label: "Last 3 Months", value: "3m" },
      { label: "Last 6 Months", value: "6m" },
      { label: "Last Year", value: "1y" },
    ];
  };

  // Handle time period change for trend chart
  const handleTimePeriodChange = (value) => {
    setTimePeriod(value);
    message.info(`Showing data for ${value}`);
  };

  return (
    <div className="employee-report-wrapper" style={{ padding: "24px" }}>
      <div className="employee-report-header" style={{ marginBottom: "24px" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: "16px" }}>
          <Col>
            <h1 className="employee-report-title" style={{ margin: 0, fontSize: "24px", fontWeight: "600" }}>
              Employee Analytics Dashboard
            </h1>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                Export Report
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Stats Cards - Fixed with specific class names and improved spacing */}
      <div className="employee-report-stats-container" style={{ marginBottom: "24px" }}>
        <Row gutter={[16, 16]} className="employee-report-stats-row">
          <Col xs={24} sm={12} md={6} className="employee-report-stat-col">
            <Card className="employee-report-stat-card" loading={loading} bordered={false}>
              <Statistic
                title="Total Onboarded"
                value={reportData.stats.totalOnboarded}
                prefix={<UserAddOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} className="employee-report-stat-col">
            <Card className="employee-report-stat-card" loading={loading} bordered={false}>
              <Statistic
                title="Total Offboarded"
                value={reportData.stats.totalOffboarded}
                prefix={<UserDeleteOutlined style={{ color: "#ff4d4f" }} />}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} className="employee-report-stat-col">
            <Card className="employee-report-stat-card" loading={loading} bordered={false}>
              <Statistic
                title="Avg. Onboarding Time"
                value={reportData.stats.averageOnboardingTime}
                suffix="days"
                prefix={<span style={{ color: "#1890ff" }}>~</span>}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} className="employee-report-stat-col">
            <Card className="employee-report-stat-card" loading={loading} bordered={false}>
              <Statistic
                title="Completion Rate"
                value={reportData.stats.completionRate}
                suffix="%"
                prefix={
                  <Progress
                    type="circle"
                    percent={reportData.stats.completionRate}
                    width={20}
                    style={{ marginRight: 8 }}
                    showInfo={false}
                  />
                }
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Row gutter={[16, 16]}>
        {/* Trend Chart */}
        <Col xs={24} lg={16}>
          <Card
            title="Employee Onboarding Trends"
            className="employee-report-chart-card"
            extra={
              <Select
                defaultValue={timePeriod}
                style={{ width: 140 }}
                onChange={handleTimePeriodChange}
                options={getTimePeriodOptions()}
              />
            }
            loading={loading}
          >
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={reportData.trendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="onboarded"
                    stroke="#52c41a"
                    activeDot={{ r: 8 }}
                    name="Onboarded"
                  />
                  <Line
                    type="monotone"
                    dataKey="offboarded"
                    stroke="#ff4d4f"
                    name="Offboarded"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Department Distribution */}
        <Col xs={24} lg={8}>
          <Card
            title="Department Distribution"
            className="employee-report-chart-card"
            loading={loading}
          >
            <div style={{ height: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {reportData.departmentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} employees`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Employee Table */}
      <Card
        title="Employee List"
        className="employee-report-table-card"
        style={{ marginTop: "16px" }}
        extra={
          <Space>
            <RangePicker onChange={handleDateRangeChange} />
            <Select
              placeholder="Filter by Status"
              style={{ width: 150 }}
              onChange={(value) => setFilterStatus(value)}
              defaultValue="all"
            >
              <Option value="all">All Status</Option>
              <Option value="onboarded">Active</Option>
              <Option value="offboarded">Inactive</Option>
              <Option value="incomplete">Incomplete</Option>
            </Select>
            <Select
              mode="multiple"
              placeholder="Filter by Department"
              style={{ width: 200 }}
              onChange={(value) => setFilterDepartment(value)}
              allowClear
              maxTagCount={2}
            >
              {reportData.departmentData.map((dept) => (
                <Option key={dept.name} value={dept.name}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={getFilteredEmployeeData()}
          loading={loading}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
};

export default EmployeeReport;

