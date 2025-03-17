// import React, { useState, useEffect } from 'react';
// import { Card, Row, Col, Table, DatePicker, Select, Button, Badge, Space, Statistic, Progress, message } from 'antd';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
// import { DownloadOutlined, ReloadOutlined, UserAddOutlined, UserDeleteOutlined, FilterOutlined } from '@ant-design/icons';
// import axios from 'axios';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// const EmployeeReport = () => {
//   const [loading, setLoading] = useState(true);
//   const [reportData, setReportData] = useState({
//     stats: {
//       totalOnboarded: 0,
//       totalOffboarded: 0,
//       averageOnboardingTime: 0,
//       completionRate: 0
//     },
//     trendData: [],
//     departmentData: [],
//     employeeData: []
//   });
//   const [filterDepartment, setFilterDepartment] = useState([]);
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [dateRange, setDateRange] = useState(null);
  
//   const { RangePicker } = DatePicker;
//   const { Option } = Select;

//   // Fetch report data from backend
//   const fetchReportData = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('/api/employees/report');
//       if (response.data.success) {
//         setReportData(response.data.data);
//       } else {
//         message.error('Failed to load report data');
//       }
//     } catch (error) {
//       console.error('Error fetching report data:', error);
//       message.error('Error loading report data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//   }, []);

//   const handleRefresh = () => {
//     fetchReportData();
//     message.success('Report data refreshed');
//   };

//   const handleExport = () => {
//     message.success('Report exported successfully');
//     // Implement actual export functionality here
//   };

//   const handleDateRangeChange = (dates) => {
//     setDateRange(dates);
//     // You could implement filtering by date range here
//   };

//   const columns = [
//     {
//       title: 'Employee ID',
//       dataIndex: 'empId',
//       key: 'empId',
//       sorter: (a, b) => a.empId.localeCompare(b.empId),
//     },
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//       sorter: (a, b) => a.name.localeCompare(b.name),
//       render: (text, record) => (
//         <Space>
//           <img 
//             src={record.avatar} 
//             alt={text} 
//             style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} 
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.src = 'https://xsgames.co/randomusers/avatar.php?g=pixel';
//             }}
//           />
//           {text}
//         </Space>
//       ),
//     },
//     {
//       title: 'Department',
//       dataIndex: 'department',
//       key: 'department',
//       filters: [
//         { text: 'Unassigned', value: 'Unassigned' },
//         ...(reportData.departmentData
//           .filter(dept => dept.name !== 'Unassigned')
//           .map(dept => ({ text: dept.name, value: dept.name })))
//       ],
//       onFilter: (value, record) => record.department === value,
//       render: (department) => (
//         <span>{department}</span>
//       ),
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       filters: [
//         { text: 'Active', value: 'Active' },
//         { text: 'Incomplete', value: 'Incomplete' },
//         { text: 'Inactive', value: 'Inactive' }
//       ],
//       onFilter: (value, record) => record.status === value,
//       render: (status) => (
//         <Badge 
//           status={status === 'Active' ? 'success' : status === 'Incomplete' ? 'warning' : 'error'} 
//           text={status} 
//         />
//       ),
//     },
//     {
//       title: 'Progress',
//       dataIndex: 'progress',
//       key: 'progress',
//       sorter: (a, b) => a.progress - b.progress,
//       render: (progress) => (
//         <Progress 
//           percent={progress} 
//           size="small" 
//           status={progress < 100 ? "active" : "success"}
//         />
//       ),
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space>
//           <Button 
//             type="link" 
//             size="small" 
//             onClick={() => window.location.href = `/employee/profile/${record.empId}`}
//           >
//             View
//           </Button>
//           <Button 
//             type="link" 
//             size="small" 
//             onClick={() => window.location.href = `/employee/edit/${record.empId}`}
//           >
//             Edit
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   // Filter employee data based on selected filters
//   const getFilteredEmployeeData = () => {
//     let filteredData = [...reportData.employeeData];
    
//     // Filter by status
//     if (filterStatus !== 'all') {
//       const statusMap = {
//         'onboarded': 'Active',
//         'offboarded': 'Inactive',
//         'incomplete': 'Incomplete'
//       };
//       filteredData = filteredData.filter(emp => emp.status === statusMap[filterStatus]);
//     }
    
//     // Filter by department
//     if (filterDepartment.length > 0) {
//       filteredData = filteredData.filter(emp => filterDepartment.includes(emp.department));
//     }
    
//     // Filter by date range (if implemented)
//     if (dateRange && dateRange[0] && dateRange[1]) {
//       // This would require joiningDate to be a Date object in your data
//       // filteredData = filteredData.filter(emp => {
//       //   const joinDate = new Date(emp.joiningDate);
//       //   return joinDate >= dateRange[0] && joinDate <= dateRange[1];
//       // });
//     }
    
//     return filteredData;
//   };

//   // Get time period options for trend chart
//   const getTimePeriodOptions = () => {
//     return [
//       { label: 'Last Month', value: '1m' },
//       { label: 'Last 3 Months', value: '3m' },
//       { label: 'Last 6 Months', value: '6m' },
//       { label: 'Last Year', value: '1y' }
//     ];
//   };

//   // Handle time period change for trend chart
//   const handleTimePeriodChange = (value) => {
//     // This would filter the trend data based on the selected time period
//     // For now, we'll just show a message
//     message.info(`Showing data for ${value}`);
//   };

//   return (
//     <div className="employee-report-wrapper" style={{ padding: '24px' }}>
//       <div className="report-header" style={{ marginBottom: '24px' }}>
//         <Row justify="space-between" align="middle">
//           <Col>
//             <h1 style={{ margin: 0, fontSize: '24px' }}>Employee Onboarding & Offboarding Analytics</h1>
//           </Col>
//           <Col>
//             <Space>
//               <RangePicker onChange={handleDateRangeChange} />
//               <Button 
//                 type="primary" 
//                 icon={<DownloadOutlined />} 
//                 onClick={handleExport}
//               >
//                 Export Report
//               </Button>
//               <Button 
//                 icon={<ReloadOutlined />} 
//                 onClick={handleRefresh}
//               >
//                 Refresh
//               </Button>
//             </Space>
//           </Col>
//         </Row>
//       </div>

//       <div className="stats-cards" style={{ marginBottom: '24px' }}>
//         <Row gutter={[16, 16]}>
//           <Col xs={24} sm={12} md={6}>
//             <Card>
//               <Statistic
//                 title="Total Onboarded"
//                 value={reportData.stats.totalOnboarded}
//                 prefix={<UserAddOutlined />}
//                 valueStyle={{ color: '#3f8600' }}
//               />
//               <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '8px' }}>
//                 Active employees
//               </div>
//             </Card>
//           </Col>
//           <Col xs={24} sm={12} md={6}>
//             <Card>
//               <Statistic
//                 title="Total Offboarded"
//                 value={reportData.stats.totalOffboarded}
//                 prefix={<UserDeleteOutlined />}
//                 valueStyle={{ color: '#cf1322' }}
//               />
//               <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '8px' }}>
//                 Inactive employees
//               </div>
//             </Card>
//           </Col>
//           <Col xs={24} sm={12} md={6}>
//             <Card>
//               <Statistic
//                 title="Average Onboarding Time"
//                 value={reportData.stats.averageOnboardingTime}
//                 suffix="days"
//               />
//               <Progress percent={70} size="small" />
//             </Card>
//           </Col>
//           <Col xs={24} sm={12} md={6}>
//             <Card>
//               <Statistic
//                 title="Completion Rate"
//                 value={reportData.stats.completionRate}
//                 suffix="%"
//               />
//               <Progress 
//                 percent={reportData.stats.completionRate} 
//                 size="small"
//                 status={reportData.stats.completionRate < 50 ? "exception" : "success"}
//               />
//             </Card>
//           </Col>
//         </Row>
//       </div>

//       <div className="charts-section" style={{ marginBottom: '24px' }}>
//         <Row gutter={[16, 16]}>
//           <Col xs={24} lg={16}>
//             <Card 
//               title="Employee Trends" 
//               extra={
//                 <Select 
//                   defaultValue="6m" 
//                   style={{ width: 120 }}
//                   onChange={handleTimePeriodChange}
//                   options={getTimePeriodOptions()}
//                 />
//               }
//             >
//               {reportData.trendData.length > 0 ? (
//                 <BarChart 
//                   width={800} 
//                   height={300} 
//                   data={reportData.trendData}
//                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                   style={{ maxWidth: '100%' }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="onboarded" name="Onboarded" fill="#8884d8" />
//                   <Bar dataKey="offboarded" name="Offboarded" fill="#82ca9d" />
//                 </BarChart>
//               ) : (
//                 <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                   No trend data available
//                 </div>
//               )}
//             </Card>
//           </Col>
//           <Col xs={24} lg={8}>
//             <Card title="Department Distribution">
//               {reportData.departmentData.length > 0 ? (
//                 <PieChart width={300} height={300} style={{ margin: '0 auto' }}>
//                   <Pie
//                     data={reportData.departmentData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={100}
//                     fill="#8884d8"
//                     label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                   >
//                     {reportData.departmentData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip formatter={(value, name) => [`${value} employees`, name]} />
//                   <Legend />
//                 </PieChart>
//               ) : (
//                 <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                   No department data available
//                 </div>
//               )}
//             </Card>
//           </Col>
//         </Row>
//       </div>

//       <Card className="table-section">
//         <div style={{ marginBottom: '16px' }}>
//           <Space wrap>
//             <Select 
//               defaultValue="all" 
//               style={{ width: 120 }}
//               onChange={value => setFilterStatus(value)}
//             >
//               <Option value="all">All Employees</Option>
//               <Option value="onboarded">Onboarded</Option>
//               <Option value="incomplete">Incomplete</Option>
//               <Option value="offboarded">Offboarded</Option>
//             </Select>
//             <Select 
//               mode="multiple" 
//               placeholder="Select Department" 
//               style={{ width: 200 }}
//               onChange={values => setFilterDepartment(values)}
//               options={[
//                 { label: 'Unassigned', value: 'Unassigned' },
//                 ...(reportData.departmentData
//                   .filter(dept => dept.name !== 'Unassigned')
//                   .map(dept => ({ label: dept.name, value: dept.name })))
//               ]}
//             />
//             <Button icon={<FilterOutlined />}>More Filters</Button>
//           </Space>
//         </div>
//         <Table 
//           columns={columns}
//           dataSource={getFilteredEmployeeData()}
//           loading={loading}
//           rowKey="key"
//           pagination={{
//             total: getFilteredEmployeeData().length,
//             pageSize: 10,
//             showSizeChanger: true,
//             showQuickJumper: true,
//             showTotal: (total) => `Total ${total} employees`,
//           }}
//           scroll={{ x: 'max-content' }}
//         />
//       </Card>
//     </div>
//   );
// };

// export default EmployeeReport;

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, DatePicker, Select, Button, Badge, Space, Statistic, Progress, message } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { DownloadOutlined, ReloadOutlined, UserAddOutlined, UserDeleteOutlined, FilterOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const EmployeeReport = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    stats: {
      totalOnboarded: 0,
      totalOffboarded: 0,
      averageOnboardingTime: 0,
      completionRate: 0
    },
    trendData: [],
    departmentData: [],
    employeeData: []
  });
  const [filterDepartment, setFilterDepartment] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  
  const { RangePicker } = DatePicker;
  const { Option } = Select;

  // Fetch report data from backend
  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/employees/report');
      if (response.data.success) {
        setReportData(response.data.data);
      } else {
        message.error('Failed to load report data');
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      message.error('Error loading report data');
      
      // Set some demo data for development/testing
      setReportData({
        stats: {
          totalOnboarded: 156,
          totalOffboarded: 42,
          averageOnboardingTime: 14,
          completionRate: 92
        },
        trendData: [
          { month: 'Jan', onboarded: 30, offboarded: 10 },
          { month: 'Feb', onboarded: 25, offboarded: 8 },
          { month: 'Mar', onboarded: 35, offboarded: 12 },
          { month: 'Apr', onboarded: 28, offboarded: 15 },
          { month: 'May', onboarded: 32, offboarded: 9 },
          { month: 'Jun', onboarded: 40, offboarded: 7 }
        ],
        departmentData: [
          { name: 'IT', value: 40 },
          { name: 'HR', value: 25 },
          { name: 'Finance', value: 20 },
          { name: 'Marketing', value: 15 },
          { name: 'Operations', value: 30 }
        ],
        employeeData: [
          {
            key: '1',
            empId: 'EMP001',
            name: 'John Doe',
            department: 'IT',
            status: 'Active',
            progress: 100,
            email: 'john.doe@example.com',
            joiningDate: '2023-01-15',
            avatar: 'https://xsgames.co/randomusers/avatar.php?g=male'
          },
          {
            key: '2',
            empId: 'EMP002',
            name: 'Jane Smith',
            department: 'HR',
            status: 'Active',
            progress: 85,
            email: 'jane.smith@example.com',
            joiningDate: '2023-02-20',
            avatar: 'https://xsgames.co/randomusers/avatar.php?g=female'
          },
          {
            key: '3',
            empId: 'EMP003',
            name: 'Mike Johnson',
            department: 'Finance',
            status: 'Inactive',
            progress: 90,
            email: 'mike.johnson@example.com',
            joiningDate: '2022-11-05',
            avatar: 'https://xsgames.co/randomusers/avatar.php?g=male'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const handleRefresh = () => {
    fetchReportData();
    message.success('Report data refreshed');
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
      const employeeWorksheetData = filteredData.map(emp => ({
        'Employee ID': emp.empId,
        'Name': emp.name,
        'Department': emp.department,
        'Status': emp.status,
        'Progress': `${emp.progress}%`,
        'Email': emp.email || 'N/A',
        'Joining Date': emp.joiningDate || 'N/A'
      }));
      
      const employeeWorksheet = XLSX.utils.json_to_sheet(employeeWorksheetData);
      XLSX.utils.book_append_sheet(workbook, employeeWorksheet, 'Employees');
      
      // 2. Department Distribution worksheet
      const departmentWorksheetData = reportData.departmentData.map(dept => ({
        'Department': dept.name,
        'Number of Employees': dept.value
      }));
      
      const departmentWorksheet = XLSX.utils.json_to_sheet(departmentWorksheetData);
      XLSX.utils.book_append_sheet(workbook, departmentWorksheet, 'Departments');
      
      // 3. Monthly Trends worksheet
      const trendWorksheetData = reportData.trendData.map(trend => ({
        'Month': trend.month,
        'Onboarded': trend.onboarded,
        'Offboarded': trend.offboarded
      }));
      
      const trendWorksheet = XLSX.utils.json_to_sheet(trendWorksheetData);
      XLSX.utils.book_append_sheet(workbook, trendWorksheet, 'Monthly Trends');
      
      // 4. Summary Statistics worksheet
      const statsWorksheetData = [
        { 'Metric': 'Total Onboarded', 'Value': reportData.stats.totalOnboarded },
        { 'Metric': 'Total Offboarded', 'Value': reportData.stats.totalOffboarded },
        { 'Metric': 'Average Onboarding Time (days)', 'Value': reportData.stats.averageOnboardingTime },
        { 'Metric': 'Completion Rate (%)', 'Value': reportData.stats.completionRate }
      ];
      
      const statsWorksheet = XLSX.utils.json_to_sheet(statsWorksheetData);
      XLSX.utils.book_append_sheet(workbook, statsWorksheet, 'Summary Statistics');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Get current date for filename
      const date = new Date();
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      // Save file
      FileSaver.saveAs(data, `Employee_Report_${dateString}.xlsx`);
      
      message.success('Report exported successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      message.error('Failed to export report');
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    // You could implement filtering by date range here
  };

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'empId',
      key: 'empId',
      sorter: (a, b) => a.empId.localeCompare(b.empId),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <Space>
          <img 
            src={record.avatar} 
            alt={text} 
            style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://xsgames.co/randomusers/avatar.php?g=pixel';
            }}
          />
          {text}
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      filters: [
        { text: 'Unassigned', value: 'Unassigned' },
        ...(reportData.departmentData
          .filter(dept => dept.name !== 'Unassigned')
          .map(dept => ({ text: dept.name, value: dept.name })))
      ],
      onFilter: (value, record) => record.department === value,
      render: (department) => (
        <span>{department}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Incomplete', value: 'Incomplete' },
        { text: 'Inactive', value: 'Inactive' }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Badge 
          status={status === 'Active' ? 'success' : status === 'Incomplete' ? 'warning' : 'error'} 
          text={status} 
        />
      ),
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            onClick={() => window.location.href = `/employee/profile/${record.empId}`}
          >
            View
          </Button>
          <Button 
            type="link" 
            size="small" 
            onClick={() => window.location.href = `/employee/edit/${record.empId}`}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  // Filter employee data based on selected filters
  const getFilteredEmployeeData = () => {
    let filteredData = [...reportData.employeeData];
    
    // Filter by status
    if (filterStatus !== 'all') {
      const statusMap = {
        'onboarded': 'Active',
        'offboarded': 'Inactive',
        'incomplete': 'Incomplete'
      };
      filteredData = filteredData.filter(emp => emp.status === statusMap[filterStatus]);
    }
    
    // Filter by department
    if (filterDepartment.length > 0) {
      filteredData = filteredData.filter(emp => filterDepartment.includes(emp.department));
    }
    
    // Filter by date range (if implemented)
    if (dateRange && dateRange[0] && dateRange[1]) {
      filteredData = filteredData.filter(emp => {
        if (!emp.joiningDate) return true;
        const joinDate = new Date(emp.joiningDate);
        return joinDate >= dateRange[0] && joinDate <= dateRange[1];
      });
    }
    
    return filteredData;
  };

  // Get time period options for trend chart
  const getTimePeriodOptions = () => {
    return [
      { label: 'Last Month', value: '1m' },
      { label: 'Last 3 Months', value: '3m' },
      { label: 'Last 6 Months', value: '6m' },
      { label: 'Last Year', value: '1y' }
    ];
  };

  // Handle time period change for trend chart
  const handleTimePeriodChange = (value) => {
    // This would filter the trend data based on the selected time period
    message.info(`Showing data for ${value}`);
  };

  return (
    <div className="employee-report-wrapper" style={{ padding: '24px' }}>
      <div className="report-header" style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <h1 style={{ margin: 0, fontSize: '24px' }}>Employee Onboarding & Offboarding Analytics</h1>
          </Col>
          <Col>
            <Space>
              <RangePicker onChange={handleDateRangeChange} />
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                onClick={handleExport}
              >
                Export Report
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleRefresh}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      <div className="stats-cards" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Onboarded"
                value={reportData.stats.totalOnboarded}
                prefix={<UserAddOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '8px' }}>
                Active employees
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Offboarded"
                value={reportData.stats.totalOffboarded}
                prefix={<UserDeleteOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '8px' }}>
                Inactive employees
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Average Onboarding Time"
                value={reportData.stats.averageOnboardingTime}
                suffix="days"
              />
              <Progress percent={70} size="small" />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Completion Rate"
                value={reportData.stats.completionRate}
                suffix="%"
              />
              <Progress 
                percent={reportData.stats.completionRate} 
                size="small"
                status={reportData.stats.completionRate < 50 ? "exception" : "success"}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <div className="charts-section" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card 
              title="Employee Trends" 
              extra={
                <Select 
                  defaultValue="6m" 
                  style={{ width: 120 }}
                  onChange={handleTimePeriodChange}
                  options={getTimePeriodOptions()}
                />
              }
            >
              {reportData.trendData.length > 0 ? (
                <BarChart 
                  width={800} 
                  height={300} 
                  data={reportData.trendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  style={{ maxWidth: '100%' }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="onboarded" name="Onboarded" fill="#8884d8" />
                  <Bar dataKey="offboarded" name="Offboarded" fill="#82ca9d" />
                </BarChart>
              ) : (
                <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  No trend data available
                </div>
              )}
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Department Distribution">
              {reportData.departmentData.length > 0 ? (
                <PieChart width={300} height={300} style={{ margin: '0 auto' }}>
                  <Pie
                    data={reportData.departmentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {reportData.departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} employees`, name]} />
                  <Legend />
                </PieChart>
              ) : (
                <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  No department data available
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>

      <Card className="table-section">
        <div style={{ marginBottom: '16px' }}>
          <Space wrap>
            <Select 
              defaultValue="all" 
              style={{ width: 120 }}
              onChange={value => setFilterStatus(value)}
            >
              <Option value="all">All Employees</Option>
              <Option value="onboarded">Onboarded</Option>
              <Option value="incomplete">Incomplete</Option>
              <Option value="offboarded">Offboarded</Option>
            </Select>
            <Select 
              mode="multiple" 
              placeholder="Select Department" 
              style={{ width: 200 }}
              onChange={values => setFilterDepartment(values)}
              options={reportData.departmentData.map(dept => ({ label: dept.name, value: dept.name }))}
            />
            <Button icon={<FilterOutlined />}>More Filters</Button>
          </Space>
        </div>
        <Table 
          columns={columns}
          dataSource={getFilteredEmployeeData()}
          loading={loading}
          rowKey="key"
          pagination={{
            total: getFilteredEmployeeData().length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} employees`,
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default EmployeeReport;

