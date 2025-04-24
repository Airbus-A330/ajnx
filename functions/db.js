const mysql = require('mysql2');
const pc = require("picocolors");

const pool = mysql.createPool({
  host: 'db.aerex.tk',     // e.g., 'localhost' or '127.0.0.1'
  user: 'webapp_user',
  password: 'AaplMsft+.15',
  database: 'AJNXBanking',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();  // Use promise wrapper for async/await