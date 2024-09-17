const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "mysql",
  user: "root",
  database: "portal_pacjenta",
});

module.exports = pool.promise();
