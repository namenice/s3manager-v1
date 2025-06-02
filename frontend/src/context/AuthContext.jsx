// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // useEffect นี้จะทำงานเมื่อ Component ถูก Mount ครั้งแรก
  // เพื่อตรวจสอบสถานะการ Login จาก localStorage
  useEffect(() => {
    const initializeAuth = () => { // ไม่ต้องเป็น async ก็ได้ เพราะ authService.getUser() ไม่ใช่ Promise
      setLoading(true); // เริ่มต้นการตรวจสอบสถานะ
      const currentUser = authService.getUser(); // ดึง decoded user object จาก localStorage
      
      if (currentUser) {
        // ในโปรดักชัน ควรมีการตรวจสอบ token ว่ายังใช้ได้หรือไม่ (เช่น ตรวจสอบวันหมดอายุ หรือเรียก API verify)
        // เพื่อความง่ายใน dev เราจะถือว่าถ้ามี user ก็คือ authenticated
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        // หากไม่มี currentUser
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false); // สิ้นสุดการตรวจสอบสถานะ
    };

    initializeAuth();
  }, []); // [] คือทำงานแค่ครั้งเดียวเมื่อ Component Mount

  // *** ลบ useEffect ตัวนี้ออกไป ***
  // useEffect(() => {
  //   setIsAuthenticated(!!user); // ตั้งค่า isAuthenticated ตาม user state
  // }, [user]);
  // *** เราจะจัดการ setIsAuthenticated โดยตรงใน login/logout function แทน ***


  // ฟังก์ชัน login ที่จะอัปเดต state ใน Context
  const login = async (username, password) => {
    try {
      // 1. เรียก authService.login ซึ่งจะจัดการการติดต่อ Backend
      //    และเก็บ token + decoded user object ลง localStorage
      await authService.login(username, password);

      // 2. เมื่อ login สำเร็จ ให้ดึง decoded user object ล่าสุดจาก localStorage
      //    มาตั้งค่าให้กับ user state ใน Context
      const updatedUser = authService.getUser(); 
      setUser(updatedUser); // ตั้งค่า user state เป็น decoded user object
      setIsAuthenticated(true); // ตั้งค่า isAuthenticated เป็น true ทันที

      // ไม่จำเป็นต้อง return userData; แล้ว เพราะ LoginPage ไม่ได้ใช้โดยตรง
      // ถ้า LoginPage ต้องการ response จาก Backend ก็สามารถเรียก authService.login โดยตรงได้
    } catch (error) {
      // หาก login ไม่สำเร็จ ให้แน่ใจว่า state ถูกรีเซ็ต
      setUser(null);
      setIsAuthenticated(false);
      authService.logout(); // ล้าง localStorage เผื่อมี token ค้างไม่สมบูรณ์
      throw error; // โยน error ออกไปเพื่อให้ LoginPage จัดการต่อ
    }
  };

  // ฟังก์ชัน logout ที่จะรีเซ็ต state ใน Context
  const logout = () => {
    authService.logout(); // ลบ token และ user จาก localStorage
    setUser(null); // รีเซ็ต user state
    setIsAuthenticated(false); // รีเซ็ต isAuthenticated state
    // ไม่ต้อง navigate ตรงนี้ เพราะ Navbar หรือ Component อื่นที่เรียก logout จะจัดการ navigate เอง
  };

  const register = async (username, password, email) => {
    // register ไม่จำเป็นต้องอัปเดตสถานะ login ใน context เพราะผู้ใช้ยังไม่ได้ login
    await authService.register(username, password, email);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
