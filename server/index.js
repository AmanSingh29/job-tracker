require("dotenv").config();
const app = require("./src/app");
const { connectDB } = require("./src/config/db");
const { PORT } = require("./src/config/env");
const path = require("path");
const fs = require("fs");
const globalErrorHandlerMw = require("./src/middlewares/globalErrorHandler.mw");
const express = require("express");
const cors = require("cors");
const port = PORT || 7070;

app.use(express.json());
app.use(cors());

connectDB();

const models = path.join(__dirname, "/src/models");
fs.readdirSync(models)
  .filter((file) => ~file.search(/^[^.].*\.js$/))
  .forEach((file) => require(path.join(models, file)));

app.use(globalErrorHandlerMw);

app.listen(port, () => console.log(`Server running on port ${port}`));
