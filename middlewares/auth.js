const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { handleError } = require("../utils/errors");

const handleAuthError = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      res.status(401).send({ message: "Authorization required" });
      return;
    }

    const token = authorization.replace("Bearer ", "");
    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      res.status(401).send({ message: "Authorization required" });
      return;
    }
    req.user = payload;
    next();
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  handleAuthError,
};
