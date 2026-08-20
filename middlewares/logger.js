const winston = require("winston");

const requestLog = winston.createLogger({
  transports: [new winston.transports.File({ filename: "request.log" })],
  format: winston.format.json(),
});

const errorLog = winston.createLogger({
  transports: [new winston.transports.File({ filename: "error.log" })],
  format: winston.format.json(),
});

const requestLogger = (req, _res, next) => {
  requestLog.info({ method: req.method, url: req.originalUrl });
  next();
};

const errorLogger = (err, req, _res, next) => {
  errorLog.error({
    message: err.message,
    method: req.method,
    stack: err.stack,
    url: req.originalUrl,
  });
  next(err);
};

module.exports = {
  requestLogger,
  errorLogger,
};

