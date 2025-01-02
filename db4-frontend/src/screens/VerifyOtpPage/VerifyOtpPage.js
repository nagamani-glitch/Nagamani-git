// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const VerifyOtpPage = () => {
//   const [otp, setOtp] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/api/auth/verify-otp', { otp });
//       setSuccess('OTP verified successfully!');
//       setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
//     } catch (error) {
//       setError('Invalid OTP. Please try again.');
//     }
//   };

//   return (
//     <div className="verify-otp-container">
//       <h2>Verify OTP</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="otp">Enter OTP</label>
//           <input
//             type="text"
//             id="otp"
//             name="otp"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Verify</button>
//       </form>

//       {error && <div className="error">{error}</div>}
//       {success && <div className="success">{success}</div>}
//     </div>
//   );
// };

// export default VerifyOtpPage;
