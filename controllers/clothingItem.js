const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      handleError(res, err);
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      handleError(res, err);
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail(() => {
      handleOnFailError();
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => handleError(res, err));
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail(() => {
      handleOnFailError();
    })
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        const error = new Error("You are not authorized to delete this item");
        error.statusCode = ERROR_CODES.Forbidden;
        throw error;
      }
      return ClothingItem.findByIdAndDelete(item._id);
    })
    .then(() => {
      res.send({ message: "Item deleted successfully" });
    })
    .catch((err) => {
      handleError(res, err);
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = ERROR_CODES.NotFound;
      throw error;
    })
    .then((card) =>
      res.status(200).send({ card, message: "Item liked successfully" })
    )
    .catch((err) => handleError(res, err));
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = ERROR_CODES.NotFound;
      throw error;
    })
    .then((card) =>
      res.status(200).send({ card, message: "Item disliked successfully" })
    )
    .catch((err) => {
      handleError(res, err);
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
