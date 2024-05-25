const { Doctor, DoctorSchedule } = require("../models/doctorModel");

const getAllDoctors = async () => {
  try {
    return await Doctor.findAll();
  } catch (error) {
    throw error;
  }
};

const getDoctorById = async (doctorId) => {
  try {
    return await Doctor.findByPk(doctorId);
  } catch (error) {
    throw error;
  }
};

const getDoctorScheduleById = async (doctorId) => {
  try {
    return await DoctorSchedule.findAll({ where: { DoctorID: doctorId } });
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
        // Add filtering conditions based on params
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
  try {
    await DoctorSchedule.bulkCreate(schedules);
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
};
