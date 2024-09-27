const {
  Doctor,
  DoctorSchedule,
  Profile,
  Appointment,
} = require("../models/doctorModel");
const { Sequelize } = require("sequelize");

const getAllDoctors = async () => {
  try {
    return await Doctor.findAll({
      include: [
        {
          model: Profile,
          as: "DoctorProfile",
          attributes: ["FirstName", "LastName"],
        },
      ],
    });
  } catch (error) {
    throw error;
  }
};

const getDoctorById = async (doctorId) => {
  try {
    return await Doctor.findByPk(doctorId, {
      include: [
        {
          model: Profile,
          as: "DoctorProfile",
          attributes: ["FirstName", "LastName"],
        },
      ],
    });
  } catch (error) {
    throw error;
  }
};

const getDoctorScheduleById = async (doctorId) => {
  try {
    return await DoctorSchedule.findAll({
      where: {
        DoctorID: doctorId,
      },
      include: [
        {
          model: Appointment,
          include: [
            {
              model: Profile,
              as: "PatientProfile",
              attributes: ["FirstName", "LastName"],
            },
          ],
        },
      ],
      order: [
        ["AvailableDate", "ASC"],
        ["TimeSlotFrom", "ASC"],
      ],
    });
  } catch (error) {
    throw error;
  }
};

const getDataFilters = async () => {
  try {
    return await Doctor.findAll({
      attributes: [
        [
          Sequelize.fn("DISTINCT", Sequelize.col("Specialization")),
          "Specialization",
        ],
        "Cities",
      ],
    });
  } catch (error) {
    throw error;
  }
};

const getVisits = async (params) => {
  try {
    return await DoctorSchedule.findAll({
      where: {
        AvailableDate: {
          [Sequelize.Op.gte]: params.date,
        },
        AppointmentID: {
          [Sequelize.Op.is]: null,
        },
      },
      include: [
        {
          model: Doctor,
          where: {
            Specialization: params.specialization,
            Cities: {
              [Sequelize.Op.like]: `%${params.location}%`,
            },
          },
          include: [
            {
              model: Profile,
              as: "DoctorProfile",
              attributes: ["FirstName", "LastName"],
            },
          ],
        },
        {
          model: Appointment,
          include: [
            {
              model: Profile,
              as: "PatientProfile",
              attributes: ["FirstName", "LastName"],
            },
          ],
        },
      ],
      order: [
        ["AvailableDate", "ASC"],
        ["TimeSlotFrom", "ASC"],
      ],
    });
  } catch (error) {
    throw error;
  }
};

const createSchedules = async (schedules) => {
  console.log(schedules);
  try {
    await DoctorSchedule.bulkCreate(schedules);
  } catch (error) {
    throw error;
  }
};

const getScheduledVisits = async (doctorId) => {
  try {
    return await DoctorSchedule.findAll({
      where: {
        DoctorID: doctorId,
        AppointmentID: {
          [Sequelize.Op.not]: null,
        },
      },
      include: [
        {
          model: Appointment,
          include: [
            {
              model: Profile,
              as: "PatientProfile",
              attributes: ["FirstName", "LastName"],
            },
          ],
        },
      ],
      order: [
        ["AvailableDate", "ASC"],
        ["TimeSlotFrom", "ASC"],
      ],
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getDoctorScheduleById,
  getDataFilters,
  getVisits,
  createSchedules,
  getScheduledVisits,
};
