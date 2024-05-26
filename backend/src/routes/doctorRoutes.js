const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");

// Pobranie wszystkich lekarzy
router.get("/", doctorController.getAllDoctors);

router.get("/filters", doctorController.getDataFilters);

router.post("/visits", doctorController.getVisits);

router.get("/scheduled-visits/:doctorId", doctorController.getScheduledVisits);

router.get("/schedule/:doctorId", doctorController.getDoctorScheduleById);

router.post("/schedule/create", doctorController.createSchedules);

router.get("/:doctorId", doctorController.getDoctorById);

module.exports = router;
