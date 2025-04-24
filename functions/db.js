const mysql = require('mysql2');
const pc = require("picocolors");

const pool = mysql.createPool({
  host: 'localhost',     // e.g., 'localhost' or '127.0.0.1'
  user: 'root',
  password: 'dbR!A@9_IpB0iVOH',
  database: 'AJNXBanking',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();  // Use promise wrapper for async/await