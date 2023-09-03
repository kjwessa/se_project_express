const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const ConflictError = require("../errors/conflict");
const NotFoundError = require("../errors/notFound");
const UnauthorizedError = require("../errors/unauthorized");
const BadRequestError = require("../errors/invalidData");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!password) {
    return next(new UnauthorizedError("Password is required"));
  }

  return User.findOne({ email })
    .then((userRes) => {
      if (userRes) {
        throw new ConflictError("Email already exists in database");
      } else {
        return bcrypt
          .hash(password, 10)
          .then((hash) => User.create({ name, avatar, email, password: hash }))
          .then((user) => {
            res.send({ name, avatar, _id: user._id, email: user.email });
          });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Validation Error"));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id: userId } = req.user;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return res.send({ data: user });
    })
    .catch((error) => {
      next(error);
    });
};

const updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return res.send({ data: user });
    })
    .catch((error) => {
      next(error);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError("Email or Password not found"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return next(new UnauthorizedError("Email or Password not found"));
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.send({ token });
      });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  updateCurrentUser,
  login,
};
