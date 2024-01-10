const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");

// Pobranie wszystkich lekarzy
router.get("/", doctorController.getAllDoctors);

// Pobranie lekarza po ID
router.get("/:doctorId", doctorController.getDoctorById);

// Pobranie harmonogramu lekarza po ID lekarza
router.get("/schedule/:doctorId", doctorController.getDoctorScheduleById);

module.exports = router;
