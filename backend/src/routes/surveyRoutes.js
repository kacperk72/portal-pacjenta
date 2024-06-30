const express = require("express");
const router = express.Router();
const surveyController = require("../controllers/surveyController");

// Zapisywanie ankiety przed wizytą
router.post("/add", surveyController.saveSurvey);

// Pobieranie wszystkich ankiet
router.get("/all", surveyController.getAllSurveys);

// Pobieranie ankiet według DoctorID
router.get("/doctor/:doctorID", surveyController.getSurveysByDoctorID);

// Pobieranie ankiety według AppointmentID
router.get("/:appointmentID", surveyController.getSurveyByAppointmentID);

module.exports = router;
