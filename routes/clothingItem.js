const router = require("express").Router();

const { createItem } = require("../controllers/clothingItem");

router.post("/", createItem);
module.exports = router;
