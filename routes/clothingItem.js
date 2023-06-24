const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
} = require("../controllers/clothingItem");

//  Create  a new item
router.post("/", createItem);

// Read all items

router.get("/", getItems);

// Update an item

router.put("/:itemId", updateItem);

// Delete an item

module.exports = router;
