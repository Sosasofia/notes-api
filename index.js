require("dotenv").config();
require("./mongo");
const express = require("express");
const noteRouter = require("./routes/notes");
const app = express();
const cors = require("cors");


//Middlewares
app.use( express.json());
app.use( express.urlencoded({ extended:true }));
app.use( cors());


//Test
app.get("/", (req,res) => {
  res.send("Working");
});


//Routes
app.use("/api", noteRouter);


//Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

