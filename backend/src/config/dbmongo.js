const mongoose = require("mongoose");

// Upewnij się, że korzystasz ze zmiennej środowiskowej DB_URI
const mongoURI = process.env.DB_URI || "mongodb://mongo:27017/portal_pacjenta";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));
