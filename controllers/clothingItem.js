const ClothingItem = require("../models/clothingItem");
const { errorCode400, errorCode404, errorCode500 } = require("../utils/errors");

function handleRegularItemMethod(req, res, err) {
  if (err.name === "ValidationError" || err.name === "AssertionError") {
    return res.status(errorCode400).send({
      message:
        "Invalid data passed to the methods for creating an item or updating an item, or invalid ID passed to the params.",
    });
  }
  if (err.name === "CastError") {
    return res.status(errorCode404).send({
      message:
        "There is no clothing item with the requested id, or the request was sent to a non-existent address.",
    });
  }
  return res
    .status(errorCode500)
    .send({ message: "An error has occurred on the server", err });
}

function handleFindByIdItemCatchMethod(req, res, err) {
  if (
    err.name === "CastError" ||
    err.name === "ValidationError" ||
    err.name === "AssertionError"
  ) {
    return res.status(errorCode400).send({
      message:
        "Invalid data passed to the methods for creating an item or updating an item, or invalid ID passed to the params.",
    });
  }
  if (err.name === "DocumentNotFoundError") {
    return res.status(errorCode404).send({
      message:
        "There is no clothing item with the requested id, or the request was sent to a non-existent address.",
    });
  }
  return res
    .status(errorCode500)
    .send({ message: "An error has occurred on the server", err });
}

const createItem = (req, res) => {
  const { name, weather, imageURL } = req.body;
  const { _id } = req.user;

  ClothingItem.create({ name, weather, imageURL, owner: _id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      handleRegularItemMethod(req, res, err);
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      handleRegularItemMethod(req, res, err);
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => handleFindByIdItemCatchMethod(req, res, err));
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() =>
      res
        .status(200)
        .send({ message: "Item deleted successfully" })
        .catch((err) => handleFindByIdItemCatchMethod(req, res, err))
    );
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    res.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then(() => res.status(200).send({ message: "Item liked successfully" }))
    .catch((err) => handleFindByIdItemCatchMethod(req, res, err));
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    res.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then(() => res.status(200).send({ message: "Item disliked successfully" }))
    .catch((err) => handleFindByIdItemCatchMethod(req, res, err));
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
