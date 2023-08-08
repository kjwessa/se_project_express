class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UNAUTHORIZED_ERROR";
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
