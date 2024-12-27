import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './LoginPage.css'
import {Link} from 'react-router-dom'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', formData);
      alert('User logged in successfully');
      console.log(response.data.token)
      localStorage.setItem('token', response.data.token);
      navigate('/home')
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="form">
        <h4>Login</h4>
        <label htmlFor='email'>Email</label>
        <input type="email" id='email' name="email" placeholder="Your Email..." onChange={handleChange} />
        <label htmlFor='password'>Password</label>
        <input type="password" id='password' name="password" placeholder="Your Password..." onChange={handleChange} />
        <button type="submit">  Login</button>
        <p>New user? <Link to='/register' >Register here</Link></p>  
      </form>
    </div>
  );
};

export default LoginPage;
