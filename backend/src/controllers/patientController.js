const Patient = require("../models/patientModel");

// Profil pacjenta
exports.getPatientProfile = (req, res) => {
  const patientId = req.params.patientId;

  Patient.getPatientProfileWithDetails(patientId)
    .then(([results]) => {
      if (results.length === 0) {
        return res.status(404).send("Profil pacjenta nie został znaleziony.");
      }
      res.json(results);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

// Aktualizacja profilu pacjenta
exports.updatePatientProfile = (req, res) => {
  const userId = req.params.userId;
  const { firstName, lastName, dateOfBirth, contactInfo, address } = req.body;

  Patient.updateByUserId(
    userId,
    firstName,
    lastName,
    dateOfBirth,
    contactInfo,
    address
  )
    .then(() => {
      res
        .status(200)
        .send(`Profil pacjenta o ID ${userId} został zaktualizowany.`);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

// Utworzenie nowego profilu pacjenta
exports.createPatientProfile = (req, res) => {
  const { userId, firstName, lastName, dateOfBirth, contactInfo, address } =
    req.body;

  Patient.create(userId, firstName, lastName, dateOfBirth, contactInfo, address)
    .then(() => {
      res.status(201).send("Profil pacjenta został utworzony.");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

// Usunięcie profilu pacjenta
exports.deletePatientProfile = (req, res) => {
  Patient.deleteByUserId(req.params.userId)
    .then(() => {
      res
        .status(200)
        .send(`Profil pacjenta o ID ${req.params.userId} został usunięty.`);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
