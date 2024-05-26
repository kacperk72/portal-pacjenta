const appointmentService = require("../services/appointmentService");

exports.createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    const newAppointment = await appointmentService.createAppointment(
      appointmentData
    );
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
