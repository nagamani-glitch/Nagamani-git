import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(''); // State to hold the error message

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user modifies input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', formData);
      alert('User registered successfully');
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError('User already exists. Please try login!'); // Show specific error message
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="form">
        <h4>Register</h4>
        <label htmlFor='name'>Name</label>
        <input type="text" name="name" id='name' placeholder="Your name..." onChange={handleChange} />
        <label htmlFor='email'>Email</label>
        <input type="email" name="email" id='email' placeholder="Your email..." onChange={handleChange} />
        <label htmlFor='password'>Password</label>
        <input type="password" id='password' name="password" placeholder="Your password..." onChange={handleChange} />
        {error && <p className="error">{error}</p>} {/* Display error message */}
        <button type="submit">Register</button>
        <p>Already a user? <Link to='/login' >Login here</Link></p>
      </form>
    </div>
  );
};

export default RegisterPage;
