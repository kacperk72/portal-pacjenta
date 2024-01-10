const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "portal_pacjenta",
});

module.exports = pool.promise();
