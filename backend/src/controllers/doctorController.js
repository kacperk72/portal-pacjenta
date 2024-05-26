const doctorService = require("../services/doctorService");

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorService.getAllDoctors();
    res.json(doctors);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctorId = parseInt(req.params.doctorId, 10); // Ensure doctorId is a number
    if (isNaN(doctorId)) {
      throw new Error("Invalid doctor ID");
    }
    const doctor = await doctorService.getDoctorById(doctorId);
    res.json(doctor);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getDoctorScheduleById = async (req, res) => {
  try {
    const doctorId = parseInt(req.params.doctorId, 10); // Ensure doctorId is a number
    if (isNaN(doctorId)) {
      throw new Error("Invalid doctor ID");
    }
    const schedule = await doctorService.getDoctorScheduleById(doctorId);
    res.json(schedule);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getDataFilters = async (req, res) => {
  try {
    const filters = await doctorService.getDataFilters();
    res.json(filters);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getVisits = async (req, res) => {
  try {
    const params = req.body;
    const visits = await doctorService.getVisits(params);
    res.json(visits);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createSchedules = async (req, res) => {
  try {
    const schedules = req.body;
    await doctorService.createSchedules(schedules);
    res.status(201).send("Schedules created successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getScheduledVisits = async (req, res) => {
  try {
    const doctorId = parseInt(req.params.doctorId, 10); // Ensure doctorId is a number
    if (isNaN(doctorId)) {
      throw new Error("Invalid doctor ID");
    }
    const visits = await doctorService.getScheduledVisits(doctorId);
    res.json(visits);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
