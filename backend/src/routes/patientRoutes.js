const express = require("express");
const router = express.Router();
// const patientController = require("../controllers/patientController");
const patientController = require("../controllers/patientController2");

// Pobranie profilu pacjenta po ID użytkownika
router.get("/profile/:patientId", patientController.getPatientProfile);

// Aktualizacja profilu pacjenta
router.put("/profile/:userId", patientController.updatePatientProfile);

// Utworzenie nowego profilu pacjenta
router.post("/profile", patientController.createPatientProfile);

// Usunięcie profilu pacjenta
router.delete("/profile/:userId", patientController.deletePatientProfile);

module.exports = router;
