require('dotenv').config();

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: process.env.DB_PATH || './data/database.sqlite',
    logging: false, // Set to true to see SQL queries in console
  },
  // You can add production, test configurations here later
};
