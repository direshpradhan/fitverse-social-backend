require("dotenv").config();
const mongoose = require("mongoose");

async function initializeDBConnection() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection is successful");
  } catch (error) {
    console.error("Database connection failed...", error);
  }
}

module.exports = { initializeDBConnection };
