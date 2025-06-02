// backend/src/controllers/authController.js
const db = require('../models'); // ใช้ db object เพื่อเข้าถึง User model
const User = db.User;             // เข้าถึง User model
const jwt = require('jsonwebtoken'); // ตรวจสอบว่าได้ติดตั้ง jsonwebtoken แล้ว (npm install jsonwebtoken)

// Register User
exports.register = async (req, res) => {
    // รับ username, email, password, role จาก req.body
    // email ยังคงจำเป็นเพราะเป็น allowNull: false ใน User model
    const { username, email, password, role } = req.body;

    try {
        // 1. ตรวจสอบว่า username ซ้ำหรือไม่
        let existingUserByUsername = await User.findOne({ where: { username: username } });
        if (existingUserByUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // 2. ตรวจสอบว่า email ซ้ำหรือไม่ (ยังจำเป็นเพราะ email unique ใน Model)
        let existingUserByEmail = await User.findOne({ where: { email: email } });
        if (existingUserByEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        
        // 3. สร้างผู้ใช้ใหม่ในฐานข้อมูลด้วย Sequelize
        // Password จะถูก Hash โดย hook ใน User model ก่อนบันทึก
        const newUser = await User.create({
            username: username,
            email: email, // บันทึก email ลงฐานข้อมูล
            password: password, // ส่ง password ที่ยังไม่ได้ hash ไปให้ hook จัดการ
            role: role || 'member', // ใช้ 'member' เป็น default ตามที่คุณกำหนดใน Model
        });

        res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, username: newUser.username, role: newUser.role } });

    } catch (err) {
        console.error('Registration error:', err.message);
        // สามารถเพิ่มการจัดการ error ที่เฉพาะเจาะจงมากขึ้นได้หากต้องการ
        res.status(500).send('Server Error');
    }
};

// Login User
exports.login = async (req, res) => {
    const { username, password } = req.body; // รับ username จาก req.body

    try {
        // 1. ค้นหาผู้ใช้ด้วย username
        let user = await User.findOne({ where: { username: username } });
        if (!user) {
            // ใช้ข้อความรวมๆ เพื่อความปลอดภัย
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 2. ตรวจสอบรหัสผ่านโดยใช้ method comparePassword จาก User model prototype
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            // ใช้ข้อความรวมๆ เพื่อความปลอดภัย
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 3. สร้าง JWT Payload (เก็บ id, role, username)
        const payload = {
            user: {
                id: user.id,
                role: user.role,
                username: user.username // สำคัญ: เพิ่ม username เข้าไปใน payload ด้วย
            },
        };

        // 4. ลงนาม JWT Token
        jwt.sign(
            payload,
            process.env.JWT_SECRET, // ต้องตั้งค่า JWT_SECRET ใน .env file
            { expiresIn: '1h' }, // Token หมดอายุใน 1 ชั่วโมง
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).send('Server Error');
    }
};

// Get authenticated user's data (ไม่จำเป็นต้องแก้ไข)
exports.getAuthUser = async (req, res) => {
    try {
        // req.user.id มาจาก Auth Middleware ที่ถอดรหัส JWT
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } }); // ค้นหาด้วย Primary Key และไม่ดึง password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Get auth user error:', err.message);
        res.status(500).send('Server Error');
    }
};

// Admin specific data (ไม่จำเป็นต้องแก้ไข)
exports.getAdminData = (req, res) => {
    res.json({ message: 'This is admin data, only accessible by admin role.' });
};
