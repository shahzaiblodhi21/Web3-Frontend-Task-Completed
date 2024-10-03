// db.js
const mysql = require('mysql2');

// Create a MySQL connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'mydb@12212021', // Replace with your MySQL password
  database: 'web3_db', // Replace with your MySQL database name
});

db.getConnection((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

module.exports = db;
