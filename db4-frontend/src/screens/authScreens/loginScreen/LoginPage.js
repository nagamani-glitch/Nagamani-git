// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {Link} from 'react-router-dom'

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });

//   const navigate = useNavigate()

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/api/auth/login', formData);
//       alert('User logged in successfully');
//       console.log(response.data.token)
//       localStorage.setItem('token', response.data.token);
//       navigate('/home')
      
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="login-container">
//       <form onSubmit={handleSubmit} className="form">
//         <h4>Login</h4>
//         <label htmlFor='email'>Email</label>
//         <input type="email" id='email' name="email" placeholder="Your Email..." onChange={handleChange} />
//         <label htmlFor='password'>Password</label>
//         <input type="password" id='password' name="password" placeholder="Your Password..." onChange={handleChange} />
//         <button type="submit">  Login</button>
//         <p>New user? <Link to='/register' >Register here</Link></p>  
//       </form>
//     </div>
//   );
// };

// export default LoginPage;





// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError(''); // Clear the error message when the user starts typing
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Send login request to backend
//       const response = await axios.post('/api/auth/login', formData);
//       alert('User logged in successfully');
//       console.log(response.data.token);

//       // Store the token in localStorage
//       localStorage.setItem('token', response.data.token);

//       // Redirect to home page after successful login
//       navigate('/home');
      
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         setError('Invalid email or password. Please try again.');
//       } else {
//         setError('An error occurred. Please try again later.');
//       }
//     }
//   };

//   return (
//     <div className="login-container">
//       <form onSubmit={handleSubmit} className="form">
//         <h4>Login</h4>
        
//         {/* Email Input */}
//         <label htmlFor='email'>Email</label>
//         <input 
//           type="email" 
//           id='email' 
//           name="email" 
//           placeholder="Your Email..." 
//           onChange={handleChange} 
//           value={formData.email}
//         />

//         {/* Password Input */}
//         <label htmlFor='password'>Password</label>
//         <input 
//           type="password" 
//           id='password' 
//           name="password" 
//           placeholder="Your Password..." 
//           onChange={handleChange} 
//           value={formData.password}
//         />

//         {/* Display error if login fails */}
//         {error && <p className="error">{error}</p>}

//         {/* Submit Button */}
//         <button type="submit">Login</button>

//         {/* Registration link for new users */}
//         <p>New user? <Link to='/register'>Register here</Link></p>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;




import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear the error message when the user starts typing
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to backend
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      alert('User logged in successfully');
      
      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);

      // Redirect to home page after successful login
      navigate('/home');
      
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="form">
        <h4>Login</h4>
        
        {/* Email Input */}
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          placeholder="Your Email..." 
          onChange={handleChange} 
          value={formData.email}
        />

        {/* Password Input */}
        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          placeholder="Your Password..." 
          onChange={handleChange} 
          value={formData.password}
        />

        {/* Display error if login fails */}
        {error && <p className="error">{error}</p>}

        {/* Submit Button */}
        <button type="submit">Login</button>

        {/* Registration link for new users */}
        <p>New user? <Link to="/register">Register here</Link></p>
      </form>
    </div>
  );
};

export default LoginPage;
