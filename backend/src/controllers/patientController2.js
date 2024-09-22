const patientService = require("../services/patientService");

exports.getPatientProfile = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const patient = await patientService.getPatientById(patientId);
    console.log("Patient:", patient);
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
    const id = req.params.id;
    await patientService.updatePatientProfile(id, req.body); // Aktualizacja danych pacjenta
    res.send(`Profil pacjenta o ID ${id} został zaktualizowany.`);
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
