const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

// MongoDB connection
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

