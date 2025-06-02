// frontend/src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  // ลบ handleProfileClick และ handleAdminClick ออกไป เพราะไม่มีแล้ว

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">S3 Manager</Link>
      </div>
      <div className="navbar-right">
        {isAuthenticated ? (
          <div className="user-dropdown-container" ref={dropdownRef}>
            <button className="user-display-name" onClick={toggleDropdown}>
              Hello, {user?.username} ▼
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {/* เหลือแค่ Logout */}
                <div className="dropdown-item" onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        ) : (
          <>
            {location.pathname !== '/login' && location.pathname !== '/register' && (
              <>
                <Link to="/login" className="navbar-auth-link">Login</Link>
                <Link to="/register" className="navbar-auth-link">Register</Link>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
