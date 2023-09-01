const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./customError");

class AuthorizationError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = AuthorizationError;
