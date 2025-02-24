import React, { useState } from 'react';
import { Card, Row, Col, Table, DatePicker, Select, Button, Badge, Space, Statistic, Progress } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { DownloadOutlined, ReloadOutlined, UserAddOutlined, UserDeleteOutlined, FilterOutlined } from '@ant-design/icons';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const trendData = [
  { month: 'Jan', onboarded: 30, offboarded: 10 },
  { month: 'Feb', onboarded: 25, offboarded: 8 },
  { month: 'Mar', onboarded: 35, offboarded: 12 },
  { month: 'Apr', onboarded: 28, offboarded: 15 },
  { month: 'May', onboarded: 32, offboarded: 9 },
  { month: 'Jun', onboarded: 40, offboarded: 7 }
];

const departmentData = [
  { name: 'IT', value: 40 },
  { name: 'HR', value: 25 },
  { name: 'Finance', value: 20 },
  { name: 'Marketing', value: 15 },
  { name: 'Operations', value: 30 }
];

const employeeData = [
  {
    key: '1',
    empId: 'EMP001',
    name: 'John Doe',
    department: 'IT',
    status: 'Active',
    progress: 100,
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=male'
  },
  {
    key: '2',
    empId: 'EMP002',
    name: 'Jane Smith',
    department: 'HR',
    status: 'Active',
    progress: 85,
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=female'
  },
  {
    key: '3',
    empId: 'EMP003',
    name: 'Mike Johnson',
    department: 'Finance',
    status: 'Inactive',
    progress: 90,
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=male'
  }
];

const EmployeeReport = () => {
  const [loading, setLoading] = useState(false);
  const { RangePicker } = DatePicker;
  const { Option } = Select;

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
      render: (text, record) => (
        <Space>
          <img 
            src={record.avatar} 
            alt={text} 
            style={{ width: 30, height: 30, borderRadius: '50%' }} 
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
        { text: 'IT', value: 'IT' },
        { text: 'HR', value: 'HR' },
        { text: 'Finance', value: 'Finance' },
      ],
      onFilter: (value, record) => record.department === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'Active' ? 'success' : 'error'} 
          text={status} 
        />
      ),
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <Progress percent={progress} size="small" />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small">View</Button>
          <Button type="link" size="small">Edit</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="employee-report-wrapper" style={{ padding: '24px' }}>
      <div className="report-header" style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <h1 style={{ margin: 0, fontSize: '24px' }}>Employee Onboarding & Offboarding Analytics</h1>
          </Col>
          <Col>
            <Space>
              <RangePicker />
              <Button type="primary" icon={<DownloadOutlined />}>
                Export Report
              </Button>
              <Button icon={<ReloadOutlined />}>Refresh</Button>
            </Space>
          </Col>
        </Row>
      </div>

      <div className="stats-cards" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Onboarded"
                value={156}
                prefix={<UserAddOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '8px' }}>
                +23.4% vs last month
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Offboarded"
                value={42}
                prefix={<UserDeleteOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '8px' }}>
                -12.1% vs last month
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Average Onboarding Time"
                value={14}
                suffix="days"
              />
              <Progress percent={78} size="small" />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Completion Rate"
                value={92}
                suffix="%"
              />
              <Progress percent={92} size="small" />
            </Card>
          </Col>
        </Row>
      </div>

      <div className="charts-section" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Card title="Employee Trends" extra={<Select defaultValue="6m" style={{ width: 120 }}>
              <Option value="1m">Last Month</Option>
              <Option value="3m">Last 3 Months</Option>
              <Option value="6m">Last 6 Months</Option>
              <Option value="1y">Last Year</Option>
            </Select>}>
              <BarChart width={800} height={300} data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="onboarded" fill="#8884d8" />
                <Bar dataKey="offboarded" fill="#82ca9d" />
              </BarChart>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Department Distribution">
              <PieChart width={300} height={300}>
                <Pie
                  data={departmentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Card>
          </Col>
        </Row>
      </div>

      <Card className="table-section">
        <div style={{ marginBottom: '16px' }}>
          <Space>
            <Select defaultValue="all" style={{ width: 120 }}>
              <Option value="all">All Employees</Option>
              <Option value="onboarded">Onboarded</Option>
              <Option value="offboarded">Offboarded</Option>
            </Select>
            <Select mode="multiple" placeholder="Select Department" style={{ width: 200 }}>
              <Option value="it">IT</Option>
              <Option value="hr">HR</Option>
              <Option value="finance">Finance</Option>
            </Select>
            <Button icon={<FilterOutlined />}>More Filters</Button>
          </Space>
        </div>
        <Table 
          columns={columns}
          dataSource={employeeData}
          loading={loading}
          pagination={{
            total: 100,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  );
};

export default EmployeeReport;
