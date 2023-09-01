const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./customError");

class EmailInUse extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
  }
}

module.exports = EmailInUse;
