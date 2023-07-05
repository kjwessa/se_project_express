const router = require("express").Router();
const auth = require("../middlewares/auth");

const { getCurrentUser, updateCurrentUser } = require("../controllers/user");

// CREATE
// router.post("/", createUser);

// READ
// router.get("/", getUsers);
// router.get("/:itemId", getUser);
router.get("/me", auth.handleAuthError, getCurrentUser);

// Update
router.patch("/me", auth.handleAuthError, updateCurrentUser);

module.exports = router;
