// frontend/src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo'; // ตรวจสอบเส้นทาง
import '../assets/styles/global.css'; // ตรวจสอบเส้นทาง
import '../assets/styles/LoginPage.css'; // ใช้สไตล์เดียวกันกับ Login Page (สำหรับ card)

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // เพิ่ม state สำหรับ email
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
        navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      await register(username, password, email); // ส่ง username, password, email ไปด้วย
      setMessage('Registration successful! Please login.');
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000); // หน่วงเวลา 2 วินาที ก่อนนำทาง
    } catch (error) {
      setMessage(error);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <Logo />
        <h2 className="signin-text">Register</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              id="username-reg"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="form-group"> {/* เพิ่มช่อง Email */}
            <input
              type="email"
              id="email-reg"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="form-group password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password-reg"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye-off">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.06 18.06 0 0 1 4.75-5.32"></path>
                  <path d="M1 1l22 22"></path>
                  <path d="M10.59 10.59a2 2 0 0 1-2.83-2.83"></path>
                  <path d="M9.31 4.93A10.09 10.09 0 0 1 12 4c7 0 11 8 11 8a18.06 18.06 0 0 1-4.75 5.32"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </span>
          </div>
          <div className="form-group password-group">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirm-password-reg"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input-field"
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye-off">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.06 18.06 0 0 1 4.75-5.32"></path>
                  <path d="M1 1l22 22"></path>
                  <path d="M10.59 10.59a2 2 0 0 1-2.83-2.83"></path>
                  <path d="M9.31 4.93A10.09 10.09 0 0 1 12 4c7 0 11 8 11 8a18.06 18.06 0 0 1-4.75 5.32"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </span>
          </div>
          
          <button type="submit" className="login-button">Register</button>
        </form>
        {message && (
          <p className={isSuccess ? 'success-message' : 'error-message'}>{message}</p>
        )}
        <p className="form-links" style={{ justifyContent: 'center', marginTop: '20px' }}>
            Already have an account? <Link to="/login" className="forgot-password-link">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
