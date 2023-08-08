class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BAD_REQUEST_ERROR";
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
