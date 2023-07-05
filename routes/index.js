const router = require("express").Router();
const clothingItem = require("./clothingItem");
const User = require("./user");
const { createUser, login } = require("../controllers/user");
const { ERROR_CODES } = require("../utils/errors");
const auth = require("../middlewares/auth");

router.use("/items", clothingItem);
router.use("/users", auth.handleAuthError, User);
router.post("/signup", createUser);
router.post("/signin", login);

router.use((req, res) => {
  res.status(ERROR_CODES.NotFound).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
