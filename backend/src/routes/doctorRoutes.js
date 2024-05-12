const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");

// Pobranie wszystkich lekarzy
router.get("/", doctorController.getAllDoctors);

router.get("/filters", doctorController.getDataFilters);

router.post("/visits", doctorController.getVisits);

// Pobranie harmonogramu lekarza po ID lekarza
router.get("/schedule/:doctorId", doctorController.getDoctorScheduleById);

// Pobranie lekarza po ID
router.get("/:doctorId", doctorController.getDoctorById);

module.exports = router;
