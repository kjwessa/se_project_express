const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (res) => {
    console.log("We are connected to the DB", res);
  },
  (err) => console.log("There is an error connecting to DB", err)
);

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// our routes
app.use(routes);

// our logger
app.use(errorLogger);

// celebrate error handler
app.use(errors());

// our centralized handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
