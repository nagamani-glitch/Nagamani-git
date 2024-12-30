import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateFeedback.css'

const CreateFeedback = ({ addFeedback }) => {
  const [formData, setFormData] = useState({
    title: '',
    employee: '',
    manager: '',
    subordinates: '',
    colleague: '',
    period: '',
    startDate: '',
    endDate: '',
    questionTemplate: '',
    keyResult: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addFeedback(formData); // Add new feedback
    navigate('/performance/feedback'); // Navigate back to FeedbackPage
  };

  return (
    <div className="create-filter-popup">
      <h3>Feedback</h3>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        
        <div className="group">
          <label>
            Employee
            <input type="text" name="employee" value={formData.employee} onChange={handleChange} />
          </label>
          <label>
            Manager
            <input type="text" name="manager" value={formData.manager} onChange={handleChange} />
          </label>
        </div>

        <div className="group">
          <label>
            Subordinates
            <input type="text" name="subordinates" value={formData.subordinates} onChange={handleChange} />
          </label>
          <label>
            Colleague
            <input type="text" name="colleague" value={formData.colleague} onChange={handleChange} />
          </label>
        </div>

        <div className="group">
          <label>
            Period
            <input type="text" name="period" value={formData.period} onChange={handleChange} />
          </label>
          <label>
            Start Date
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
          </label>
          <label>
            End Date
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
          </label>
        </div>

        <div className="group">
          <label>
            Question Template
            <input type="text" name="questionTemplate" value={formData.questionTemplate} onChange={handleChange} />
          </label>
          <label>
            Key Result
            <input type="text" name="keyResult" value={formData.keyResult} onChange={handleChange} />
          </label>
        </div>

        <button type="submit" className="save-btn">Save</button>
      </form>
    </div>
  );
};

export default CreateFeedback;
