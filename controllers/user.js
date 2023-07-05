const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  handleError,
  handleOnFailError,
  ERROR_CODES,
} = require("../utils/errors");

// const createUser = (req, res) => {
//   const { name, avatar, email, password } = req.body;

//   bcrypt
//     .hash(password, 10)
//     .then((hash) => {
//       User.create({ name, avatar, email, password: hash })
//         .then((user) => {
//           const userData = user.toObject();
//           delete userData.password;
//           res.status(201).send({ data: userData });
//         })
//         .catch((err) => handleError(res, err));
//     })
//     .catch((err) => handleError(res, err));
// };

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        res.status(ERROR_CODES.AlreadyExistsError).json({
          message: "Email address is already in use",
        });
        return;
      }

      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.create({ name, avatar, email, password: hash })
            .then((user) => {
              const userData = user.toObject();
              delete userData.password;
              res.status(201).json({ data: userData });
            })
            .catch((err) => handleError(res, err));
        })
        .catch((err) => handleError(res, err));
    })
    .catch((err) => handleError(res, err));
};
// const createUser = (req, res) => {
//   const { name, avatar, email, password } = req.body;

//   if (!password) {
//     res
//       .status(ERROR_CODES.Unauthorized)
//       .send({ message: "Password is required" });
//   }

//   return bcrypt
//     .hash(password, 10)
//     .then((hash) => User.create({ name, avatar, email, password: hash }))
//     .then((user) => {
//       res.send({ name, avatar, _id: user._id, email: user.email });
//     })
//     .catch((error) => {
//       if (error.name === "ValidationError") {
//         res
//           .status(ERROR_CODES.MongoError)
//           .send({ message: "Invalid data provided" });
//       } else if (error.code === 11000) {
//         res
//           .status(ERROR_CODES.AlreadyExistsError)
//           .send({ message: "Email already exists in database" });
//       } else {
//         res
//           .status(ERROR_CODES.ServerError)
//           .send({ message: "An error has occurred on the server" });
//       }
//     });
// };

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      handleOnFailError();
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => handleError(res, err));
};

const updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      handleOnFailError();
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => handleError(res, err));
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERROR_CODES.Unauthorized)
      .send({ message: "You are not authorized to do this" });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      });
    })
    .catch((err) => handleError(res, err));
};

module.exports = {
  createUser,
  getCurrentUser,
  updateCurrentUser,
  login,
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
