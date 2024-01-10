const express = require("express");
const cors = require("cors");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/patients", patientRoutes);
app.use("/doctor", doctorRoutes);

app.use((req, res, next) => {
  res.status(404).send("Nie znaleziono strony");
});

module.exports = app;
