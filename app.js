require("./mongo");
require("express-async-errors");
const express = require("express");
const app = express();
const cors = require("cors");

const noteRouter = require("./routes/notes");
const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");
const middleware = require("./utils/middleware");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);


app.get("/", (req, res) => {
  res.send("Working");
});


app.use("/api/notes", middleware.userExtractor, noteRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);


app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports =  app ;
