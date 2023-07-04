const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { PORT = 3001 } = process.env;
const app = express();
mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("We are connected to the DB", r);
  },
  (e) => console.log("There is an error connecting to DB", e)
);

// app.use((req, res, next) => {
//   req.user = {
//     _id: "6499b10103c44f72c26d9a0c",
//   };
//   next();
// });

const routes = require("./routes");

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
