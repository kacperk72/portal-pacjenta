const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Appointment = require("./appointmentModel");
const Profile = require("./profileModel");

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

Doctor.hasMany(DoctorSchedule, { foreignKey: "DoctorID" });
DoctorSchedule.belongsTo(Doctor, { foreignKey: "DoctorID" });

DoctorSchedule.belongsTo(Appointment, { foreignKey: "AppointmentID" });
Appointment.hasOne(DoctorSchedule, { foreignKey: "AppointmentID" });

Appointment.belongsTo(Profile, {
  as: "PatientProfile",
  foreignKey: "PatientID",
  targetKey: "ProfileID",
});

Doctor.belongsTo(Profile, {
  as: "DoctorProfile",
  foreignKey: "DoctorID",
  targetKey: "ProfileID",
});

Appointment.belongsTo(Doctor, { foreignKey: "DoctorID" });

module.exports = { Doctor, DoctorSchedule, Profile, Appointment };
