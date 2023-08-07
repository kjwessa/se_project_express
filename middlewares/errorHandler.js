const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Error occurred with the server";
  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
