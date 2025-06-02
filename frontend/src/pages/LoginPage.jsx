// frontend/src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import '../assets/styles/global.css'; // ตรวจสอบเส้นทาง
import '../assets/styles/LoginPage.css'; // ตรวจสอบเส้นทาง

const LoginPage = () => {
  const [username, setUsername] = useState(''); // ใช้ username
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // นำทางไปหน้าหลัก (HomePage) หลังล็อกอิน
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    try {
      await login(username, password); // ส่ง username
      setMessage('เข้าสู่ระบบสำเร็จ! กำลังนำทาง...');
      setIsSuccess(true);
    } catch (error) {
      setMessage(error);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <Logo />
        <h2 className="signin-text">Sign In</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text" // เปลี่ยนเป็น type="text"
              id="username" // เปลี่ยน id
              placeholder="Username" // เปลี่ยน placeholder
              value={username}
              onChange={(e) => setUsername(e.target.value)} // เปลี่ยน handler
              required
              className="input-field"
            />
          </div>
          <div className="form-group password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
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
          <button type="submit" className="login-button">Sign In</button>
        </form>
        {message && (
          <p className={isSuccess ? 'success-message' : 'error-message'}>{message}</p>
        )}
        <p className="form-links" style={{ justifyContent: 'center', marginTop: '20px' }}>
            Don't have an account? <Link to="/register" className="forgot-password-link">Register</Link>
        </p>
        <p className="form-links" style={{ justifyContent: 'center', marginTop: '20px' }}>
            Remember Password? <Link to="/forgot-password" className="forgot-password-link">Forgot</Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
