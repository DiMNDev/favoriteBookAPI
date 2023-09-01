const { StatusCodes } = require("http-status-codes");
const dbErrorHandler = (err, req, res, next) => {
  //set default error object for response
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later",
  };
  //Throw error if values and schema do not match
  if (err.name === "ValidationError") {
    // console.log(Object)
    console.log(Object.values(err.errors));
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = 400;
  }
  //Throw error if values already exist in the database on post (register)
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }
  //If value doesn't exist in the database on GET, PATCH
  if (err.name === "CastError") {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = 404;
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = dbErrorHandler;
