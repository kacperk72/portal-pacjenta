const express = require("express");
const cors = require("cors");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Definicje tras
app.use("/patients", patientRoutes);
// app.use("/doctors", doctorRoutes);
// app.use("/admin", adminRoutes);

// Obsługa błędów
app.use((req, res, next) => {
  res.status(404).send("Nie znaleziono strony");
});

module.exports = app;
