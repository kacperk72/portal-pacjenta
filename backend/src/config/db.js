const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("portal_pacjenta", "root", "", {
  host: process.env.DB_HOST || "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
