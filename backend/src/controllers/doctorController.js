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

exports.getDataFilters = (req, res) => {
  Doctor.getDataFilters()
    .then(([data]) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  }

  
exports.getVisits = (req, res) => {
  console.log(req.body)
  Doctor.getVisits(req.body)
    .then(([data]) => {
      console.log(data)
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  }