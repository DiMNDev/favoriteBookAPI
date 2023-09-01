const mongoose = require("mongoose");

const dbConnect = (URL) => {
  console.log("Connecting to the Database...");
  return mongoose.connect(URL);
};

module.exports = dbConnect;
