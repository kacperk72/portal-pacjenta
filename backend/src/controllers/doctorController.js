const doctorService = require("../services/doctorService");
const moment = require("moment");

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
    const doctorId = req.params.doctorId;
    const doctor = await doctorService.getDoctorById(doctorId);
    if (!doctor) {
      return res.status(404).send("Doctor not found.");
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getDoctorScheduleById = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const schedule = await doctorService.getDoctorScheduleById(doctorId);
    if (!schedule) {
      return res.status(404).send("Schedule not found.");
    }
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
    const visits = await doctorService.getVisits(req.body);
    res.json(visits);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createSchedules = async (req, res) => {
  try {
    const { DoctorID, AvailableDate, TimeSlotFrom, TimeSlotTill, Duration } =
      req.body;
    const schedules = splitTimeSlots(TimeSlotFrom, TimeSlotTill, Duration).map(
      (slot) => ({
        DoctorID,
        AvailableDate,
        TimeSlotFrom: slot.from,
        TimeSlotTill: slot.till,
        Duration,
      })
    );
    await doctorService.createSchedules(schedules);
    res.status(201).send("Schedules created successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const splitTimeSlots = (TimeSlotFrom, TimeSlotTill, Duration) => {
  const start = convertToMinutes(TimeSlotFrom);
  const end = convertToMinutes(TimeSlotTill);
  const slots = [];

  for (let time = start; time + Duration <= end; time += Duration) {
    const from = convertToTime(time);
    const till = convertToTime(time + Duration);
    slots.push({ from, till });
  }

  return slots;
};

const convertToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const convertToTime = (minutes) => {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
};
