const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("portal_pacjenta", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
