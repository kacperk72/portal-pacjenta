const Doctor = require("../models/doctorModel");

exports.getAllDoctors = (req, res) => {
  Doctor.findAll()
    .then(([data]) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.getDoctorById = (req, res) => {
  Doctor.findById(req.params.doctorId)
    .then(([data]) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.getDoctorScheduleById = (req, res) => {
  Doctor.findScheduleByDoctorId(req.params.doctorId)
    .then(([data]) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
