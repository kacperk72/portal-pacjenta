const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Patient = sequelize.define(
  "Patient",
  {
    ProfileID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    FirstName: DataTypes.STRING,
    LastName: DataTypes.STRING,
    DateOfBirth: DataTypes.DATE,
    ContactInfo: DataTypes.STRING,
    Address: DataTypes.STRING,
  },
  {
    tableName: "profiles",
    timestamps: false,
  }
);

module.exports = Patient;
