// import React, { useState } from 'react';
// import './CreateFeedback.css'

// const CreateFeedback = ({ addFeedback }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     employee: '',
//     manager: '',
//     subordinates: '',
//     colleague: '',
//     period: '',
//     startDate: '',
//     endDate: '', 
//     questionTemplate: '',
//     keyResult: '',
//   });


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };


//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newFeedback = {
//       id: Date.now(),
//       ...formData,
//       status: 'Not Started'
//     };
//     addFeedback(newFeedback);
//     setFormData({  // Reset form data
//       title: '',
//       employee: '',
//       manager: '',
//       subordinates: '',
//       colleague: '',
//       period: '',
//       startDate: '',
//       endDate: '', 
//       questionTemplate: '',
//       keyResult: '',
//     });
  
//   };  

//   return (
//     <div className="create-filter-popup">
//       <h3>Feedback</h3>
//       <form onSubmit={handleSubmit}>
//         <label>Employee</label>
//         <input type="text" name="employee" value={formData.employee} onChange={handleChange} required />
        
//         <div className="group">
//           <label>
//             Title
//             <input type="text" name="title" value={formData.title} onChange={handleChange} />
//           </label>
//           <label>
//             Manager
//             <input type="text" name="manager" value={formData.manager} onChange={handleChange} />
//           </label>
//         </div>

//         <div className="group">
//           <label>
//             Subordinates
//             <input type="text" name="subordinates" value={formData.subordinates} onChange={handleChange} />
//           </label>
//           <label>
//             Colleague
//             <input type="text" name="colleague" value={formData.colleague} onChange={handleChange} />
//           </label>
//         </div>

//         <div className="group">
//           <label>
//             Period
//             <input type="text" name="period" value={formData.period} onChange={handleChange} />
//           </label>
//           <label>
//             Start Date
//             <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
//           </label>
//           <label>
//             End Date
//             <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
//           </label>
//         </div>

//         <div className="group">
//           <label>
//             Question Template
//             <input type="text" name="questionTemplate" value={formData.questionTemplate} onChange={handleChange} />
//           </label>
//           <label>
//             Key Result
//             <input type="text" name="keyResult" value={formData.keyResult} onChange={handleChange} />
//           </label>
//         </div>

//         <button type="submit" className="save-btn">Save</button>
//       </form>
//     </div>
//   );
// };

// export default CreateFeedback;

import React, { useState } from 'react';
import './CreateFeedback.css'

const CreateFeedback = ({ addFeedback, editData, onClose }) => {
  const [formData, setFormData] = useState(editData || {
    title: '',
    employee: '',
    manager: '',
    subordinates: '',
    colleague: '',
    period: '',
    startDate: '',
    dueDate: '',
    questionTemplate: '',
    keyResult: '',
    status: 'Not Started'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFeedback = {
      id: editData ? editData.id : Date.now(),
      ...formData
    };
    addFeedback(newFeedback, editData ? true : false);
    onClose();
  };  

  return (
    <div className="create-filter-popup">
      <h3>{editData ? 'Edit Feedback' : 'Create Feedback'}</h3>
      <form onSubmit={handleSubmit}>
        <label>Employee</label>
        <input type="text" name="employee" value={formData.employee} onChange={handleChange} required />
        
        <div className="group">
          <label>
            Title
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </label>
          <label>
            Manager
            <input type="text" name="manager" value={formData.manager} onChange={handleChange} required />
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
            <input type="text" name="period" value={formData.period} onChange={handleChange} required />
          </label>
          <label>
            Start Date
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
          </label>
          <label>
            Due Date
            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
          </label>
        </div>

        <div className="group">
          <label>
            Question Template
            <input type="text" name="questionTemplate" value={formData.questionTemplate} onChange={handleChange} required />
          </label>
          <label>
            Key Result
            <input type="text" name="keyResult" value={formData.keyResult} onChange={handleChange} required />
          </label>
        </div>

        <div className="group">
          <label>
            Status
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </label>
        </div>

        <button type="submit" className="save-btn">{editData ? 'Update' : 'Save'}</button>
      </form>
    </div>
  );
};

export default CreateFeedback;

