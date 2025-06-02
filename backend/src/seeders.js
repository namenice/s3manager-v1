require('dotenv').config();
const db = require('./models');
const bcrypt = require('bcryptjs');

const createAdminUser = async () => {
  await db.connectAndSync(); // Ensure DB is connected and synced first

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD; // This will be hashed by the model hook
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'; // You can make this configurable too

  try {
    let adminUser = await db.User.findOne({ where: { username: adminUsername } });

    if (!adminUser) {
      adminUser = await db.User.create({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log(`Admin user '${adminUsername}' created successfully.`);
    } else {
      console.log(`Admin user '${adminUsername}' already exists.`);
      // Optionally update admin password if it's different (careful with this in production)
      // if (!(await adminUser.comparePassword(adminPassword))) {
      //   adminUser.password = adminPassword; // Model hook will hash it
      //   await adminUser.save();
      //   console.log(`Admin user '${adminUsername}' password updated.`);
      // }
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await db.sequelize.close(); // Close connection after seeding
  }
};

if (require.main === module) {
  createAdminUser();
}
