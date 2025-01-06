import React, { useState } from "react";
import axios from "axios";
import "./CreateAllowance.css";

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
    <div className="create-allowance-popup">
      <h2>Create Allowance</h2>
      <form onSubmit={handleSave}>
        <div className="group">
          <label>
            Code
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </label>
        </div>

        <div className="group">
          <label>
            Amount
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
            />
          </label>
          <label>
            One-Time
            <select
              name="oneTime"
              value={formData.oneTime}
              onChange={handleInputChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
        </div>

        <div className="group">
          <label>
            Taxable
            <select
              name="taxable"
              value={formData.taxable}
              onChange={handleInputChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
          <label>
            Fixed
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                name="fixed"
                checked={formData.fixed}
                onChange={handleInputChange}
              />
            </div>
          </label>
        </div>

        <button type="submit" className="save-btn" >
          Save
        </button>
      </form>
    </div>

  );
};

export default CreateAllowance;
