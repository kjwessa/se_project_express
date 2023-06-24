const router = require("express").Router();

const { getUsers, getUser, createUser } = require("../controllers/user");

// CREATE
router.post("/", createUser);

// READ
router.get("/", getUsers);
router.get("/:itemId", getUser);

module.exports = router;
