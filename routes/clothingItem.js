const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateId,
  validateClothingItem,
} = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

router.post("/", auth.handleAuthError, validateClothingItem, createItem);
router.get("/", getItems);

router.put("/:itemId/likes", auth.handleAuthError, validateId, likeItem);
router.delete("/:itemId", auth.handleAuthError, validateId, deleteItem);
router.delete("/:itemId/likes", auth.handleAuthError, validateId, dislikeItem);

module.exports = router;
