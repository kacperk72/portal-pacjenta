const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.post("/add", appointmentController.createAppointment);

// Pobieranie wizyt pacjenta
router.get("/patient/:patientId", appointmentController.getPatientAppointments);

module.exports = router;
