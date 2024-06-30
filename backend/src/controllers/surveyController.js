const surveyService = require("../services/surveyService");

exports.saveSurvey = async (req, res) => {
  try {
    console.log(req.body);
    const { surveyData, visitData } = req.body;

    // Wybieranie odpowiednich pól z surveyData
    const filteredSurveyData = {
      PatientID: visitData.PatientID,
      DoctorID: visitData.DoctorID,
      AppointmentID: visitData.AppointmentID,
      VisitReason: surveyData.visitReason.name,
      SymptomsTime: surveyData.symptomsTime?.name || "",
      HighTemperature: surveyData.highTemperature?.name || "",
      HaveCough: surveyData.haveCough?.name || "",
      HaveNoBreath: surveyData.haveNoBreath?.name || "",
      HaveThroatAche: surveyData.haveThroatAche?.name || "",
      HaveRunnyNose: surveyData.haveRunnyNose?.name || "",
      HaveStomachAche: surveyData.haveStomachAche?.name || "",
      HaveOtherSymptoms: surveyData.haveOtherSymptoms?.name || "",
      TakeMedications: surveyData.takeMedications.name,
      MedicationsDetails: surveyData.medicationsDetails || "",
      HasAllergy: surveyData.hasAllergy.name,
      AllergyDetails: surveyData.allergyDetails || "",
      HasChronicDiseases: surveyData.hasChronicDiseases.name,
      ChronicDiseasesDetails: surveyData.chronicDiseasesDetails || "",
      NeededMedications: surveyData.neededMedications || "",
      CurrentMedications: surveyData.currentMedications || "",
      ReferralReason: surveyData.referralReason || "",
      ReferralCause: surveyData.referralCause || "",
      TestResults: surveyData.testResults || "",
    };

    const newSurvey = await surveyService.saveSurvey(filteredSurveyData);
    res.status(201).json(newSurvey);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllSurveys = async (req, res) => {
  try {
    const surveys = await surveyService.getAllSurveys();
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getSurveyByAppointmentID = async (req, res) => {
  try {
    const appointmentID = req.params.appointmentID;
    const survey = await surveyService.getSurveyByAppointmentID(appointmentID);
    if (!survey) {
      return res.status(404).send("Survey not found");
    }
    res.status(200).json(survey);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getSurveysByDoctorID = async (req, res) => {
  try {
    const doctorID = req.params.doctorID;
    const surveys = await surveyService.getSurveysByDoctorID(doctorID);
    console.log("surveys", surveys, doctorID);
    if (!surveys || surveys.length === 0) {
      return res.status(404).send("Surveys not found for this doctor");
    }
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
