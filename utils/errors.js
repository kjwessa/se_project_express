const ERROR_CODES = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  AlreadyExistsError: 409,
  ServerError: 500,
  MongoError: 11000,
};

module.exports = {
  ERROR_CODES,
};
