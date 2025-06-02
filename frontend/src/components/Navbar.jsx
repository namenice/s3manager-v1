// frontend/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/Navbar.css'; // สร้างไฟล์ CSS นี้ด้วย

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect ไปหน้า Login หลังจาก Logout
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">My App</Link> {/* อาจจะลิงก์ไปหน้า Landing Page */}
      </div>
      <div className="navbar-center">
        {isAuthenticated && (
          <>
            {/* แท็บเมนูหลักที่แสดงหลัง Login */}
            <Link to="/overview" className="nav-item">Overview</Link>
            <Link to="/profile" className="nav-item">Profile</Link> {/* เพิ่มหน้า Profile ถ้าต้องการ */}
            
            {/* เมนูสำหรับ Admin เท่านั้น */}
            {user && user.role === 'admin' && (
              <Link to="/admin-panel" className="nav-item nav-admin">Admin Panel</Link>
            )}
          </>
        )}
      </div>
      <div className="navbar-right">
        {isAuthenticated ? (
          <>
            <span className="navbar-username">Hello, {user?.username}</span>
            <button onClick={handleLogout} className="nav-button logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-button">Login</Link>
            <Link to="/register" className="nav-button register-button">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
