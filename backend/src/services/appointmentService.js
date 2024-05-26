const { Appointment } = require("../models/appointmentModel");
const { DoctorSchedule } = require("../models/doctorModel");
const { Sequelize } = require("sequelize");
const sequelize = require("../config/db");

const createAppointment = async (appointmentData) => {
  const transaction = await sequelize.transaction();
  try {
    const newAppointment = await Appointment.create(appointmentData, {
      transaction,
    });

    await DoctorSchedule.update(
      { AppointmentID: newAppointment.AppointmentID },
      {
        where: {
          ScheduleID: appointmentData.ScheduleID,
        },
        transaction,
      }
    );

    await transaction.commit();
    return newAppointment;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createAppointment,
};
