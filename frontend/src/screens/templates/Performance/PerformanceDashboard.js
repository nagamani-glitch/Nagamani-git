import React from 'react';
import { Pie } from 'react-chartjs-2';
import './PerformanceDashboard.css';

const PerformanceDashboard = () => {
  return (
    <div className="dashboard">
      <div className="stats-row">
        <StatBox title="Total employee objectives" count={10} color="green" />
        <StatBox title="Total key results" count={6} color="blue" />
        <StatBox title="Total feedbacks" count={5} color="red" />
        <StatBox title="Objectives At-Risk" count={0} color="grey" message="No OKRs are currently At-Risk." />
      </div>

      <div className="charts-row">
        <ChartComponent title="Objective Status" dataKey="objectives" />
        <ChartComponent title="Key Result Status" dataKey="keyResults" />
        <ChartComponent title="Feedback Status" dataKey="feedback" />
      </div>
    </div>
  );
};

const StatBox = ({ title, count, color, message }) => {
  return (
    <div className="stat-box" style={{ borderTop: `4px solid ${color}` }}>
      <h3>{title}</h3>
      <p className="count">{count}</p>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

const ChartComponent = ({ title, dataKey }) => {
  const data = {
    labels: ['On Track', 'At Risk', 'Not Started', 'Closed'],
    datasets: [
      {
        label: title,
        data: dataKey === 'objectives' ? [5, 3, 1, 1] : dataKey === 'keyResults' ? [4, 1, 1] : [3, 1, 1],
        backgroundColor: ['#4CAF50', '#FF5252', '#FFC107', '#9E9E9E'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="chart-box">
      <h4>{title}</h4>
      <Pie data={data} />
    </div>
  );
};

export default PerformanceDashboard;
