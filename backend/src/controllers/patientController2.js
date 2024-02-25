const patientService = require("../services/patientService");

exports.getPatientProfile = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const patient = await patientService.getPatientById(patientId);
    if (!patient) {
      return res.status(404).send("Profil pacjenta nie został znaleziony.");
    }
    res.json(patient);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updatePatientProfile = async (req, res) => {
  try {
    const patientId = req.params.userId;
    await patientService.updatePatientProfile(patientId, req.body);
    res.send(`Profil pacjenta o ID ${patientId} został zaktualizowany.`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createPatientProfile = async (req, res) => {
  try {
    const patient = await patientService.createPatientProfile(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deletePatientProfile = async (req, res) => {
  try {
    const patientId = req.params.userId;
    await patientService.deletePatientProfile(patientId);
    res.send(`Profil pacjenta o ID ${patientId} został usunięty.`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
