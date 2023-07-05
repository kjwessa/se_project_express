const ERROR_CODES = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  AlreadyExistsError: 409,
  ServerError: 500,
  MongoError: 11000,
};

const handleOnFailError = () => {
  const error = new Error("User not found");
  error.statusCode = ERROR_CODES.NotFound;
  throw error;
};

const handleError = (res, err) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    res
      .status(ERROR_CODES.BadRequest)
      .send({ message: "Bad Request, Invalid input" });
  } else if (err.message === "Incorrect email or password") {
    res
      .status(ERROR_CODES.Unauthorized)
      .send({ message: "You are not authorized to do this" });
  } else if (err.statusCode === ERROR_CODES.Forbidden) {
    res.status(ERROR_CODES.Forbidden).send({ message: "Access forbidden" });
  } else if (err.statusCode === ERROR_CODES.NotFound) {
    res.status(ERROR_CODES.NotFound).send({ err, message: "Item not found" });
  } else if (err.code === ERROR_CODES.MongoError) {
    res.status(ERROR_CODES.AlreadyExistsError).send({
      message: "Email address is already being used, please try another email.",
    });
  } else {
    res
      .status(ERROR_CODES.ServerError)
      .send({ message: "Something went wrong" });
  }
};

module.exports = {
  ERROR_CODES,
  handleError,
  handleOnFailError,
};
