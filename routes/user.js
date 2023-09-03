const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateCurrentUser } = require("../controllers/user");
const { validateProfileAvatar } = require("../middlewares/validation");

router.get("/me", auth.handleAuthError, getCurrentUser);
router.patch(
  "/me",
  auth.handleAuthError,
  validateProfileAvatar,
  updateCurrentUser
);

module.exports = router;
