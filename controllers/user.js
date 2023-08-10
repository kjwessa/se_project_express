const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    res.status(ERROR_CODES.BadRequest).json({
      message: "Email and password are required",
    });
    return;
  }

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
      .send({ message: "You are not authorized to do this." });
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
