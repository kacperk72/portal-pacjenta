const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};

module.exports = dbConnection;
