// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OverviewPage from './pages/OverviewPage';
import AdminPage from './pages/AdminPage'; // คุณมี AdminPage อยู่แล้ว
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute'; // ตรวจสอบ path อีกครั้งว่าถูกต้อง
import NotFoundPage from './pages/NotFoundPage';

// *** Import Component ใหม่ที่คุณจะสร้าง (หรือใช้ div placeholder ไปก่อน) ***
// import TrashPage from './pages/TrashPage'; // ถ้าคุณสร้าง TrashPage.jsx
// import AdminUsersPage from './pages/AdminUsersPage'; // ถ้าคุณสร้าง AdminUsersPage.jsx
// import AdminBucketsPage from './pages/AdminBucketsPage'; // ถ้าคุณสร้าง AdminBucketsPage.jsx

import './assets/styles/global.css';

// Component สำหรับจัดการการ Redirect หน้าแรก
const HomeRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // หรือ <div>Loading...</div>; (ถ้าอยากแสดง Loading)
  }

  return isAuthenticated ? <Navigate to="/overview" replace /> : <Navigate to="/login" replace />;
};


function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

// สร้าง Component ใหม่เพื่อใช้ useLocation
function AppContent() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register']; 

  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      
      <div className="content-area">
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Route ที่ต้องการ Login เท่านั้น */}
          <Route element={<PrivateRoute />}>
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/profile" element={<div><h1>User Profile Page</h1><p>Coming Soon...</p></div>} />
            
            {/* <<< เพิ่ม Route สำหรับ My Bucket และ Trash >>> */}
            {/* My Bucket: ชี้ไปที่ OverviewPage ชั่วคราว หรือสร้าง Component ใหม่ */}
            <Route path="/my-bucket" element={<OverviewPage />} /> 
            {/* Trash: สร้าง Component ใหม่ หรือใช้ div placeholder */}
            <Route path="/trash" element={<div><h1>Trash Page</h1><p>Files in trash will appear here.</p></div>} /> 
          </Route>

          {/* Route ที่ต้องการ Login และเป็น Admin เท่านั้น */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin-panel" element={<AdminPage />} /> {/* AdminPage หลัก */}
            
            {/* <<< เพิ่ม Route สำหรับ Admin Sub-menus >>> */}
            {/* Admin: Users Management */}
            <Route path="/admin/users" element={<div><h1>Admin: Users Management</h1><p>Manage user accounts here.</p></div>} /> 
            {/* Admin: Buckets Management */}
            <Route path="/admin/buckets" element={<div><h1>Admin: Buckets Management</h1><p>Manage S3 buckets here.</p></div>} /> 
          </Route>

          {/* Route สำหรับ 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} /> 

          {/* ถ้าคุณมีหน้า Unauthorized โดยเฉพาะ */}
          <Route path="/unauthorized" element={<div><h1>Unauthorized Access</h1><p>You do not have permission to view this page.</p></div>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
