const router = require("express").Router();
const auth = require("../middlewares/auth");

const { getCurrentUser, updateCurrentUser } = require("../controllers/user");

router.get("/me", auth.handleAuthError, getCurrentUser);
router.patch("/me", auth.handleAuthError, updateCurrentUser);

module.exports = router;
