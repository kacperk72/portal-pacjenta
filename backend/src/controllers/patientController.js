const patientModel = require("../models/patientModel"); // Zaimportuj model pacjenta

exports.getPatientDetails = (req, res) => {
  const userId = req.params.id;

  patientModel.getPatientDetails(userId, (error, patientDetails) => {
    if (error) {
      return res.status(500).send(error.message);
    }
    res.json(patientDetails);
  });
};
