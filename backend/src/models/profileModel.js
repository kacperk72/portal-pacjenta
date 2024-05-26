const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Profile = sequelize.define(
  "Profile",
  {
    ProfileID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ContactInfo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Profiles",
    timestamps: false,
  }
);

module.exports = Profile;
