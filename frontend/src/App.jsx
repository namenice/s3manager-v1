// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'; // เพิ่ม useLocation
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OverviewPage from './pages/OverviewPage';
import AdminPage from './pages/AdminPage';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import NotFoundPage from './pages/NotFoundPage'; 

import './assets/styles/global.css';

// Component สำหรับจัดการการ Redirect หน้าแรก
const HomeRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // หรือ spinner
  }

  return isAuthenticated ? <Navigate to="/overview" replace /> : <Navigate to="/login" replace />;
};


function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent /> {/* แยก Component เพื่อให้ใช้ useLocation ได้ */}
      </AuthProvider>
    </Router>
  );
}

// สร้าง Component ใหม่เพื่อใช้ useLocation
function AppContent() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register']; // Path ที่ต้องการซ่อน Navbar

  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />} {/* แสดง Navbar เฉพาะเมื่อ shouldShowNavbar เป็น true */}
      <div className="content-area">
        <Routes>
          <Route path="/" element={<HomeRedirect />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/profile" element={<div><h1>User Profile Page</h1><p>Coming Soon...</p></div>} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin-panel" element={<AdminPage />} />
          </Route>

	  <Route path="*" element={<NotFoundPage />} /> 

          <Route path="/unauthorized" element={<div><h1>Unauthorized Access</h1><p>You do not have permission to view this page.</p></div>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
