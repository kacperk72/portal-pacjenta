const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Appointment = sequelize.define(
  "Appointment",
  {
    AppointmentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    PatientID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DoctorID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    AppointmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Diagnosis: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Treatment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    SurveyID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "appointments",
    timestamps: false,
  }
);

module.exports = Appointment;
