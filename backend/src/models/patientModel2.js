const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Patient = sequelize.define(
  "Patient",
  {
    profileID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    contactInfo: DataTypes.STRING,
    address: DataTypes.STRING,
  },
  {
    tableName: "Profiles",
    timestamps: false,
  }
);

module.exports = Patient;
