const Patient = require("../models/patientModel2");

const getPatientById = async (id) => {
  try {
    const patient = await Patient.findOne({
      where: { UserID: id },
    });
    return patient;
  } catch (error) {
    throw error;
  }
};

const updatePatientProfile = async (id, updateData) => {
  try {
    const patient = await Patient.findOne({ where: { UserID: id } });
    if (!patient) {
      throw new Error("Pacjent nie został znaleziony");
    }
    await patient.update(updateData);
  } catch (error) {
    throw error;
  }
};

const createPatientProfile = async (profileData) => {
  try {
    const patient = await Patient.create(profileData);
    return patient;
  } catch (error) {
    throw error;
  }
};

const deletePatientProfile = async (patientId) => {
  try {
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      throw new Error("Pacjent nie został znaleziony");
    }
    await patient.destroy();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getPatientById,
  updatePatientProfile,
  createPatientProfile,
  deletePatientProfile,
};
