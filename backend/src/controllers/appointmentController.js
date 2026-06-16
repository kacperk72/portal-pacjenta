const appointmentService = require("../services/appointmentService");

// Lustrzany walidator kontraktu booka (FE: BookAppointmentPayload). Bez biblioteki.
// F1: pola liczbowe sprawdzamy jako obecne i KOERCOWALNE do liczby (FE może przysłać
// liczbę lub string z localStorage) — nie surowe typeof === 'number'.
const isCoercibleNumber = (v) =>
  v !== null && v !== undefined && v !== "" && !Number.isNaN(Number(v));

const validateBookAppointmentBody = (body) => {
  const details = [];
  if (!body || typeof body !== "object") {
    return ["Body wizyty jest wymagane"];
  }
  if (!isCoercibleNumber(body.PatientID)) details.push("PatientID musi być liczbą");
  if (!isCoercibleNumber(body.DoctorID)) details.push("DoctorID musi być liczbą");
  if (!isCoercibleNumber(body.ScheduleID)) details.push("ScheduleID musi być liczbą");
  if (typeof body.Status !== "string" || body.Status.trim() === "")
    details.push("Status musi być niepustym tekstem");
  if (
    typeof body.AppointmentDate !== "string" ||
    body.AppointmentDate.trim() === "" ||
    Number.isNaN(Date.parse(body.AppointmentDate))
  )
    details.push("AppointmentDate musi być parsowalną datą");
  return details;
};

exports.createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    const validationErrors = validateBookAppointmentBody(appointmentData);
    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json({ error: "Invalid appointment payload", details: validationErrors });
    }
    const newAppointment = await appointmentService.createAppointment(
      appointmentData
    );
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const appointments = await appointmentService.getPatientAppointments(
      patientId
    );
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
