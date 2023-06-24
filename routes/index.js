const router = require("express").Router();
const User = require("./user");
const clothingItem = require("./clothingItem");

router.use("/items", clothingItem);
router.use("/users", User);

router.use((req, res) => {
  res
    .status(404)
    .send({
      message:
        "There is no clothing item with the requested id, or the request was sent to a non-existent address",
    });
});

module.exports = router;
