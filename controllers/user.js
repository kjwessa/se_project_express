const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  errorCode400,
  errorCode404,
  errorCode500,
  handleCatchMethod,
  handleError,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        const userData = user.toObject();
        delete userData.password;
        return res.status(201).send({ data: userData });
      })
      .catch((err) => handleError(req, res, err));
  });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      handleCatchMethod(req, res, err);
    });
};

const getUser = (req, res) => {
  const { itemId } = req.params;

  User.findById(itemId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(errorCode404).send({
          message:
            "There is no user with the requested id, or the request was sent to a non-existent address",
        });
      }
      if (
        err.name === "ValidationError" ||
        err.name === "AssertionError" ||
        err.name === "CastError"
      ) {
        return res.status(errorCode400).send({
          message:
            "Invalid data passed to the methods for creating an user or invalid ID passed to the params.",
        });
      }
      return res
        .status(errorCode500)
        .send({ message: "An error has occurred on the server", err });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};

// Backup below
// const createUser = (req, res) => {
//   const { name, avatar } = req.body;

//   User.create({ name, avatar })
//     .then((user) => res.status(200).send({ data: user }))
//     .catch((err) => {
//       handleCatchMethod(req, res, err);
//     });
// };

// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(200).send(users))
//     .catch((err) => {
//       handleCatchMethod(req, res, err);
//     });
// };

// const getUser = (req, res) => {
//   const { itemId } = req.params;

//   User.findById(itemId)
//     .orFail()
//     .then((user) => res.status(200).send({ data: user }))
//     .catch((err) => {
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(errorCode404).send({
//           message:
//             "There is no user with the requested id, or the request was sent to a non-existent address",
//         });
//       }
//       if (
//         err.name === "ValidationError" ||
//         err.name === "AssertionError" ||
//         err.name === "CastError"
//       ) {
//         return res.status(errorCode400).send({
//           message:
//             "Invalid data passed to the methods for creating an user or invalid ID passed to the params.",
//         });
//       }
//       return res
//         .status(errorCode500)
//         .send({ message: "An error has occurred on the server", err });
//     });
// };
