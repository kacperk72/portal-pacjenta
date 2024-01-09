const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");

router.get("/:id/details", patientController.getPatientDetails);

module.exports = router;
