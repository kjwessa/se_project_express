const errorCode400 = 400;
const errorCode404 = 404;
const errorCode500 = 500;

const handleOnFailError = () => {
  const error = new Error("User not found");
  error.statusCode = errorCode404;
  throw error;
};

function handleError(res, err) {
  if (
    err.name === "ValidationError" ||
    err.name === "AssertionError" ||
    err.name === "CastError"
  ) {
    return res.status(errorCode400).send({
      message:
        "Invalid data passed to the methods for creating an item or updating an item, or invalid ID passed to the params.",
    });
  }

  if (err.statusCode && err.statusCode === 404) {
    return res.status(err.statusCode).send({
      message:
        "There is no clothing item with the requested id, or the request was sent to a non-existent address.",
    });
  }

  return res
    .status(errorCode500)
    .send({ message: "An error has occurred on the server", err });
}

function handleCatchMethod(req, res, err) {
  if (err.name === "ValidationError" || err.name === "AssertionError") {
    return res.status(errorCode400).send({
      message:
        "Invalid data passed to the methods for creating a user or invalid ID passes to the params.",
    });
  }

  if (err.name === "CastError") {
    return res.status(errorCode404).send({
      message:
        "There is no user with the requested id, or the request was sent to a non-existent address",
    });
  }

  return res
    .status(errorCode500)
    .send({ message: "An error occurred on the server", err });
}

module.exports = {
  errorCode400,
  errorCode404,
  errorCode500,
  handleError,
  handleCatchMethod,
  handleOnFailError,
};
