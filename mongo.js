const mongoose = require("mongoose");
const connection = require("./utils/config");

const url = connection.MONGODB_URI;


mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

