// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // ตรวจสอบเส้นทางว่าถูกต้อง
const authMiddleware = require('../middleware/authMiddleware'); // ตรวจสอบเส้นทางว่าถูกต้อง

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getAuthUser); // ต้องการ token เพื่อเข้าถึง
router.get('/admin', authMiddleware, authController.getAdminData); // ต้องการ token เพื่อเข้าถึง

module.exports = router;
