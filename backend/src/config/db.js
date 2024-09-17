const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("portal_pacjenta", "root", "", {
  host: "mysql",
  dialect: "mysql",
});

module.exports = sequelize;
