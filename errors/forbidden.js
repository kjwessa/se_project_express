class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "FORBIDDEN_ERROR";
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
