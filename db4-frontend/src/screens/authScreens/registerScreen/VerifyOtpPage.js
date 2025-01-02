// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './VerifyOtpPage.css';
// const VerifyOtpPage = ({ email }) => {
//   const [otp, setOtp] = useState('');
//   const [errorOtp, setErrorOtp] = useState('');
//   const navigate = useNavigate();

//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Send OTP and email to the backend for verification
//       await axios.post('/api/auth/verify-otp', { email, otp });
//       alert('Email verified successfully');
//       navigate('/login'); // Redirect to the login page after successful OTP verification
//     } catch (error) {
//       setErrorOtp('Invalid OTP. Please try again.');
//     }
//   };

//   return (
//     <div className="verify-otp-container">
//       <form onSubmit={handleOtpSubmit} className="form">
//         <h4>Verify OTP</h4>
//         <label htmlFor='otp'>Enter OTP</label>
//         <input
//           type="text"
//           id='otp'
//           name="otp"
//           placeholder="Enter OTP"
//           onChange={(e) => setOtp(e.target.value)}
//         />
//         {errorOtp && <p className="error">{errorOtp}</p>}
//         <button type="submit">Verify OTP</button>
//       </form>
//     </div>
//   );
// };

// export default VerifyOtpPage;



import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyOtpPage = ({ email }) => {
  const [otp, setOtp] = useState('');
  const [errorOtp, setErrorOtp] = useState('');
  const navigate = useNavigate();

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send OTP and email to the backend for verification
      await axios.post('/api/auth/verify-otp', { email, otp });
      alert('Email verified successfully');
      navigate('/login'); // Redirect to the login page after successful OTP verification
    } catch (error) {
      setErrorOtp('Invalid OTP. Please try again.');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '0 15px',
      backgroundColor: '#f8f9fa',
    },
    form: {
      backgroundColor: '#fff',
      padding: '20px',
      width: '90%',
      maxWidth: '400px',
      borderRadius: '8px',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    header: {
      marginBottom: '20px',
      fontFamily: 'Georgia, "Times New Roman", Times, serif',
      textDecoration: 'underline',
      color: '#d67070',
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      textAlign: 'left',
      marginBottom: '5px',
      display: 'block',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '16px',
    },
    error: {
      color: 'red',
      fontSize: '14px',
      textAlign: 'left',
    },
    button: {
      padding: '10px',
      backgroundColor: '#28a745',
      color: '#fff',
      fontSize: '16px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#218838',
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleOtpSubmit} style={styles.form}>
        <h4 style={styles.header}>Verify OTP</h4>
        <label htmlFor="otp" style={styles.label}>
          Enter OTP
        </label>
        <input
          type="text"
          id="otp"
          name="otp"
          placeholder="Enter OTP"
          style={styles.input}
          onChange={(e) => setOtp(e.target.value)}
        />
        {errorOtp && <p style={styles.error}>{errorOtp}</p>}
        <button
          type="submit"
          style={styles.button}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtpPage;

