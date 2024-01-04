const express = require("express");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(express.json());

// Definicje tras
app.use("/patients", patientRoutes);
app.use("/doctors", doctorRoutes);
app.use("/admin", adminRoutes);

// Obsługa błędów
app.use((req, res, next) => {
  res.status(404).send("Sorry, that route does not exist!");
});

module.exports = app;
