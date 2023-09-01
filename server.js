require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const dbConnect = require("./db/connect");
const dbErrors = require("./middleware/dbErrors");
const cors = require("cors");
require("express-async-errors");
app.use(express.json());
app.use("/", cors(), require("./routes"));
app.use(dbErrors);

const start = async () => {
  try {
    await dbConnect(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
