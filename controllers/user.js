const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const ConflictError = require("../errors/conflict");
const NotFoundError = require("../errors/notFound");
const UnauthorizedError = require("../errors/unauthorized");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!password) {
    return next(new UnauthorizedError("Password is required"));
  }

  User.findOne({ email }).then((res) => {
    if (res) {
      return next(new ConflictError("Email already exists in database"));
    }
  });
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      res.send({ name, avatar, _id: user._id, email: user.email });
    })
    .catch((error) => {
      next(error);
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id: userId } = req.user;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      res.send({ data: user });
    })
    .catch((error) => {
      next(error);
    });
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
