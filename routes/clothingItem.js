const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItem");

//  Create  a new item
router.post("/", createItem);

// Read all items

router.get("/", getItems);

// Update an item

router.put("/:itemId", updateItem);

// Delete an item

router.delete("/:itemId", deleteItem);

module.exports = router;
