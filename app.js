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


//Routes
app.use("/api", noteRouter);
app.use("/api", usersRouter);

app.use(notFound);
app.use(errorHandler);


module.exports = { app };