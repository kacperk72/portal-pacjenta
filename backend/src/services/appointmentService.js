const Appointment = require("../models/appointmentModel");
const { DoctorSchedule } = require("../models/doctorModel");
const { Profile } = require("../models/doctorModel");
const { Doctor } = require("../models/doctorModel");
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

const getPatientAppointments = async (patientId) => {
  try {
    return await Appointment.findAll({
      where: {
        PatientID: patientId,
      },
      include: [
        {
          model: Doctor,
          include: [
            {
              model: Profile,
              as: "DoctorProfile",
              attributes: ["FirstName", "LastName"],
            },
          ],
        },
        {
          model: DoctorSchedule,
          attributes: ["AvailableDate", "TimeSlotFrom", "TimeSlotTill"],
        },
      ],
      order: [["AppointmentDate", "ASC"]],
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createAppointment,
  getPatientAppointments,
};
