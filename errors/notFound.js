class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NOT_FOUND_ERROR";
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
