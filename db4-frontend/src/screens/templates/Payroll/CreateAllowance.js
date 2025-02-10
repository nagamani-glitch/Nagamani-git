import React, { useState } from "react";
import axios from "axios";




const styles = {
  container: {
    background: 'linear-gradient(135deg, #f6f8fb 0%, #f1f5f9 100%)',
    minHeight: '100vh',
    padding: '24px'
  },
  paper: {
    background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '32px',
    border: '1px solid rgba(255,255,255,0.8)'
  },
  title: {
    background: 'linear-gradient(45deg, #3498db, #2980b9)',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #2980b9',
    color: 'white',
    fontWeight: 700,
    marginBottom: '12px',
    fontSize: '1.5rem',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(52, 152, 219, 0.2)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '28px'
  },
  formRow: {
    display: 'flex',
    gap: '24px',
    '@media (max-width: 600px)': {
      flexDirection: 'column'
    }
  },
  inputGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  label: {
    color: '#2c3e50',
    fontWeight: 600,
    fontSize: '1rem',
    background: 'linear-gradient(45deg, #34495e, #2c3e50)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  input: {
    padding: '10px',
    borderRadius: '12px',
    border: '2px solid #e0e7ff',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    '&:focus': {
      borderColor: '#3498db',
      boxShadow: '0 0 0 4px rgba(52, 152, 219, 0.2)',
      outline: 'none'
    }
  },
  select: {
    padding: '14px',
    borderRadius: '12px',
    border: '2px solid #e0e7ff',
    fontSize: '1rem',
    background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
  checkboxWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '8px',
    background: 'linear-gradient(to right, #f8fafc, #ffffff)',
    padding: '12px',
    borderRadius: '12px',
    border: '2px solid #e0e7ff'
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: '#3498db'
  },
  saveButton: {
    padding: '16px 40px',
    background: 'linear-gradient(45deg, #3498db, #2980b9)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'normal',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }
};

// Rest of the component code remains the same


const CreateAllowance = ({ addAllowance }) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    amount: "",
    oneTime: "No",
    taxable: "No",
    fixed: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: Number(formData.amount) || 0
    };
    
    try {
      const response = await axios.post("http://localhost:5000/api/allowances", payload);
      addAllowance(response.data);
      setFormData({
        code: "",
        name: "",
        amount: "",
        oneTime: "No",
        taxable: "No",
        fixed: false,
      });
    } catch (error) {
      console.error("Error creating allowance:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.paper}>
        <h2 style={styles.title}>Create Allowance</h2>
        <form onSubmit={handleSave} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Code</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>One-Time</label>
              <select
                name="oneTime"
                value={formData.oneTime}
                onChange={handleInputChange}
                style={styles.select}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Taxable</label>
              <select
                name="taxable"
                value={formData.taxable}
                onChange={handleInputChange}
                style={styles.select}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Fixed</label>
              <div style={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  name="fixed"
                  checked={formData.fixed}
                  onChange={handleInputChange}
                  style={styles.checkbox}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            style={styles.saveButton}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAllowance;
