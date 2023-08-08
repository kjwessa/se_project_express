class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "CONFLICT_ERROR";
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
