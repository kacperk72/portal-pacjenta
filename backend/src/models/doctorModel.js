const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Appointment = require("./appointmentModel"); // Ensure correct path
const Profile = require("./profileModel"); // Ensure correct path

const Doctor = sequelize.define(
  "Doctor",
  {
    DoctorID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Cities: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Doctors",
    timestamps: false,
  }
);

const DoctorSchedule = sequelize.define(
  "DoctorSchedule",
  {
    ScheduleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    DoctorID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    AvailableDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    TimeSlotFrom: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    TimeSlotTill: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    Duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    AppointmentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "appointments",
        key: "AppointmentID",
      },
    },
  },
  {
    tableName: "DoctorSchedules",
    timestamps: false,
  }
);

// Define associations
Doctor.hasMany(DoctorSchedule, { foreignKey: "DoctorID" });
DoctorSchedule.belongsTo(Doctor, { foreignKey: "DoctorID" });

DoctorSchedule.belongsTo(Appointment, { foreignKey: "AppointmentID" });
Appointment.hasOne(DoctorSchedule, { foreignKey: "AppointmentID" });

Appointment.belongsTo(Profile, {
  as: "PatientProfile",
  foreignKey: "PatientID",
  targetKey: "ProfileID",
}); // Assuming PatientID refers to ProfileID

Doctor.belongsTo(Profile, {
  as: "DoctorProfile",
  foreignKey: "DoctorID",
  targetKey: "ProfileID",
}); // Ensure correct association without adding ProfileID to Doctor

module.exports = { Doctor, DoctorSchedule, Profile, Appointment };
