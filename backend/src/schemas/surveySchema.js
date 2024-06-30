const mongoose = require("mongoose");

const PreAppointmentSurveySchema = new mongoose.Schema(
  {
    PatientID: { type: Number, required: true },
    DoctorID: { type: Number, required: true },
    AppointmentID: { type: Number, required: true },
    VisitReason: { type: String, required: true },
    SymptomsTime: String,
    HighTemperature: String,
    HaveCough: String,
    HaveNoBreath: String,
    HaveThroatAche: String,
    HaveRunnyNose: String,
    HaveStomachAche: String,
    HaveOtherSymptoms: String,
    TakeMedications: String,
    MedicationsDetails: String,
    HasAllergy: String,
    AllergyDetails: String,
    HasChronicDiseases: String,
    ChronicDiseasesDetails: String,
    NeededMedications: String,
    CurrentMedications: String,
    ReferralReason: String,
    ReferralCause: String,
    TestResults: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PreAppointmentSurvey",
  PreAppointmentSurveySchema
);
