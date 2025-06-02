// frontend/src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return null; // หรือ return <div>Loading...</div>; (ถ้าอยากแสดง Loading)
  }

  // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบแล้วหรือไม่ (isAuthenticated)
  if (!isAuthenticated) {
    // ถ้าไม่ authenticated ให้ Redirect ไปหน้า Login ทันที
    return <Navigate to="/login" replace />;
  }

  // ตรวจสอบ Role (ถ้ามีการกำหนด allowedRoles)
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // ถ้า authenticated แล้ว แต่ไม่มีสิทธิ์
    return <Navigate to="/unauthorized" replace />;
  }

  // ถ้าผ่านทุกเงื่อนไข ให้แสดง Component ที่ถูกห่อไว้ (Outlet)
  return <Outlet />;
};

export default PrivateRoute;
