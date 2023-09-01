const BadRequestError = require("./bad-request");
const EmailInUse = require("./email-in-use");
const NotFound = require("./not-found");
const CustomAPIError = require("./customError");
const AuthorizationError = require("./unauthorized");

module.exports = {
  BadRequestError,
  EmailInUse,
  NotFound,
  CustomAPIError,
  AuthorizationError,
};
