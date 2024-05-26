const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.post("/add", appointmentController.createAppointment);

module.exports = router;
