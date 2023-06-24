const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

// CREATE
router.post("/", createItem);

// READ
router.get("/", getItems);

// UPDATE
router.put("/:itemId", updateItem);
router.put("/:itemId/likes", likeItem);

// DELETE
router.delete("/:itemId", deleteItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
