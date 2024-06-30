const Survey = require("../schemas/surveySchema");

const saveSurvey = async (surveyData) => {
  try {
    const survey = await Survey.create(surveyData);
    return survey;
  } catch (error) {
    throw error;
  }
};

const getAllSurveys = async () => {
  try {
    const surveys = await Survey.find({});
    return surveys;
  } catch (error) {
    throw error;
  }
};

const getSurveyByAppointmentID = async (appointmentID) => {
  try {
    const survey = await Survey.findOne({ AppointmentID: appointmentID });
    return survey;
  } catch (error) {
    throw error;
  }
};

const getSurveysByDoctorID = async (doctorID) => {
  try {
    const surveys = await Survey.find({ DoctorID: doctorID });
    return surveys;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  saveSurvey,
  getAllSurveys,
  getSurveyByAppointmentID,
  getSurveysByDoctorID,
};
