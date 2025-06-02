// frontend/src/pages/AdminPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import '../assets/styles/AdminPage.css'; // สร้างไฟล์ CSS นี้ด้วย (หรือใช้ร่วมกับ OverviewPage.css)

const AdminPage = () => {
  const { user } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const data = await authService.getAdminData(); // เรียกข้อมูล Admin จาก Backend
        setAdminData(data);
      } catch (err) {
        setError(err);
      }
    };

    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <div className="admin-container"><div className="admin-card"><h2>Access Denied</h2><p>You do not have administrative privileges to view this page.</p></div></div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h1>Admin Panel</h1>
        {error && <p className="error-message">Error: {error}</p>}
        {adminData ? (
          <div>
            <p>This is confidential data for administrators.</p>
            <p>{adminData.message}</p> {/* แสดงข้อความจาก Backend: "This is admin data..." */}
            {/* คุณสามารถแสดงข้อมูลการจัดการผู้ใช้, สถิติระบบ ฯลฯ ได้ที่นี่ */}
          </div>
        ) : (
          <p>Loading admin data...</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
