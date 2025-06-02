const { Sequelize } = require('sequelize');
const path = require('path');
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Ensure the directory for the database exists
const dbPath = dbConfig.storage;
const dbDir = path.dirname(dbPath);
const fs = require('fs');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
  logging: dbConfig.logging,
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize);

// Function to synchronize database and create admin user
db.connectAndSync = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
    await sequelize.sync({ alter: true }); // Sync models to database, alter existing tables if needed
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database or sync:', error);
  }
};

module.exports = db;
