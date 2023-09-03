const router = require("express").Router();
const clothingItem = require("./clothingItem");
const User = require("./user");
const NotFoundError = require("../errors/notFound");
const { createUser, login } = require("../controllers/user");
const auth = require("../middlewares/auth");
const { validateUser, validateAuth } = require("../middlewares/validation");

router.use("/items", clothingItem);
router.use("/users", auth.handleAuthError, User);
router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

router.post("/signup", validateUser, createUser);
router.post("/signin", validateAuth, login);

router.use("*", (req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;
