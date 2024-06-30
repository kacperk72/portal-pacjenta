const express = require("express");
const cors = require("cors");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const userRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const surveyRoutes = require("./routes/surveyRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const sequelize = require("./config/db");
const session = require("express-session");
const passport = require("./config/passportConfig");
const mongoose = require("mongoose");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();

// Połączenie z MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

// Konfiguracja sesji
app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

sequelize
  .authenticate()
  .then(() => console.log("Połączenie z bazą danych zostało nawiązane."))
  .catch((err) => console.error("Nie można połączyć się z bazą danych:", err));

app.use("/patients", patientRoutes);
app.use("/doctor", doctorRoutes);
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/survey", surveyRoutes);

app.use((req, res, next) => {
  res.status(404).send("Nie znaleziono strony");
});

module.exports = app;
