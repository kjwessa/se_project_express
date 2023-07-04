const router = require("express").Router();
const User = require("./user");
const clothingItem = require("./clothingItem");
const { createUser, login } = require("../controllers/user");
const { errorCode404 } = require("../utils/errors");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/items", clothingItem);
router.use("/users", User);

router.use((req, res) => {
  res.status(errorCode404).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
