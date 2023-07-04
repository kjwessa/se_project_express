// const errorCode400 = 400;
// const errorCode404 = 404;
// const errorCode500 = 500;

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
  } else if (err.statusCode === 404) {
    res.status(ERROR_CODES.NotFound).send({ message: "Item not found" });
  } else if (err.code === 11000) {
    res.status(ERROR_CODES.AlreadyExistsError).send({
      message: "Email address is already being used, please try another email.",
    });
  } else {
    res
      .status(ERROR_CODES.ServerError)
      .send({ message: "Something went wrong" });
  }
};

// function handleError(res, err) {
//   if (
//     err.name === "ValidationError" ||
//     err.name === "AssertionError" ||
//     err.name === "CastError"
//   ) {
//     return res.status(errorCode400).send({
//       message:
//         "Invalid data passed to the methods for creating an item or updating an item, or invalid ID passed to the params.",
//     });
//   }

//   if (err.statusCode && err.statusCode === 404) {
//     return res.status(err.statusCode).send({
//       message:
//         "There is no clothing item with the requested id, or the request was sent to a non-existent address.",
//     });
//   }

//   return res
//     .status(errorCode500)
//     .send({ message: "An error has occurred on the server", err });
// }

// function handleCatchMethod(req, res, err) {
//   if (err.name === "ValidationError" || err.name === "AssertionError") {
//     return res.status(errorCode400).send({
//       message:
//         "Invalid data passed to the methods for creating a user or invalid ID passes to the params.",
//     });
//   }

//   if (err.name === "CastError") {
//     return res.status(errorCode404).send({
//       message:
//         "There is no user with the requested id, or the request was sent to a non-existent address",
//     });
//   }

//   return res
//     .status(errorCode500)
//     .send({ message: "An error occurred on the server", err });
// }

module.exports = {
  ERROR_CODES,
  handleError,
  // handleCatchMethod,
  handleOnFailError,
};
