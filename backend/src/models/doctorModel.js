const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

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
    },
  },
  {
    tableName: "DoctorSchedules",
    timestamps: false,
  }
);

Doctor.hasMany(DoctorSchedule, { foreignKey: "DoctorID" });
DoctorSchedule.belongsTo(Doctor, { foreignKey: "DoctorID" });

module.exports = { Doctor, DoctorSchedule };
