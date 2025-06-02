// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * ฟังก์ชันสำหรับลงทะเบียนผู้ใช้ใหม่
 * @param {string} username - ชื่อผู้ใช้
 * @param {string} password - รหัสผ่าน
 * @param {string} email - อีเมลของผู้ใช้
 * @param {string} [role='member'] - บทบาทของผู้ใช้ (admin หรือ member)
 * @returns {Promise<object>} - ข้อมูลการตอบกลับจากการลงทะเบียน
 * @throws {string} - ข้อความแสดงข้อผิดพลาดหากการลงทะเบียนล้มเหลว
 */
const register = async (username, password, email, role = 'member') => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, { username, email, password, role });
        return response.data;
    } catch (error) {
        console.error('Registration error:', error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Registration failed';
    }
};

/**
 * ฟังก์ชันสำหรับเข้าสู่ระบบ
 * @param {string} username - ชื่อผู้ใช้
 * @param {string} password - รหัสผ่าน
 * @returns {Promise<object>} - ข้อมูลการตอบกลับจากการเข้าสู่ระบบ (รวมถึง token)
 * @throws {string} - ข้อความแสดงข้อผิดพลาดหากการเข้าสู่ระบบล้มเหลว
 */
const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { username, password });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
            localStorage.setItem('user', JSON.stringify(decodedToken.user));
        }
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Login failed';
    }
};

/**
 * ฟังก์ชันสำหรับออกจากระบบ (ล้างข้อมูลใน localStorage)
 */
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

/**
 * ฟังก์ชันสำหรับดึง Token จาก localStorage
 * @returns {string|null} - Token หรือ null ถ้าไม่มี
 */
const getToken = () => {
    return localStorage.getItem('token');
};

/**
 * ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้จาก localStorage
 * @returns {object|null} - ข้อมูลผู้ใช้ (id, username, role) หรือ null ถ้าไม่มี
 */
const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

/**
 * ฟังก์ชันสำหรับดึงข้อมูลเฉพาะ Admin (ต้องมี Token และเป็น Admin)
 * @returns {Promise<object>} - ข้อมูล Admin
 * @throws {string} - ข้อความแสดงข้อผิดพลาดหากไม่สามารถดึงข้อมูลได้
 */
const getAdminData = async () => {
    const token = getToken();
    if (!token) throw 'No token found';

    try {
        const response = await axios.get(`${API_URL}/auth/admin`, {
            headers: { 'x-auth-token': token }
        });
        return response.data;
    } catch (error) {
        console.error('Admin data fetch error:', error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Failed to fetch admin data';
    }
};

export default {
    register,
    login,
    logout,
    getToken,
    getUser,
    getAdminData,
};
