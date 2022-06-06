require("./mongo");

const express = require("express");
const app = express();
const cors = require("cors");

const noteRouter = require("./routes/notes");
const usersRouter = require("./routes/users");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");


//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Test
app.get("/", (req, res) => {
  res.send("Working");
});

//Routes
app.use("/api", noteRouter);
app.use("/api", usersRouter);

app.use(notFound);
app.use(errorHandler);

//Server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});


module.exports = { app, server };