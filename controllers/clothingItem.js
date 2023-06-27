const ClothingItem = require("../models/clothingItem");
const { errorCode404, handleError } = require("../utils/errors");

// function handleRegularItemMethod(req, res, err) {
//   if (err.name === "ValidationError" || err.name === "AssertionError") {
//     return res.status(errorCode400).send({
//       message:
//         "Invalid data passed to the methods for creating an item or updating an item, or invalid ID passed to the params.",
//     });
//   }
//   if (err.name === "CastError") {
//     return res.status(errorCode404).send({
//       message:
//         "There is no clothing item with the requested id, or the request was sent to a non-existent address.",
//     });
//   }
//   return res
//     .status(errorCode500)
//     .send({ message: "An error has occurred on the server", err });
// }

// function handleFindByIdItemCatchMethod(req, res, err) {
//   if (
//     err.name === "CastError" ||
//     err.name === "ValidationError" ||
//     err.name === "AssertionError"
//   ) {
//     return res.status(errorCode400).send({
//       message:
//         "Invalid data passed to the methods for creating an item or updating an item, or invalid ID passed to the params.",
//     });
//   }
//   if (err.statusCode) {
//     return res.status(err.statusCode).send({
//       message:
//         "There is no clothing item with the requested id, or the request was sent to a non-existent address.",
//     });
//   }
//   return res
//     .status(errorCode500)
//     .send({ message: "An error has occurred on the server", err });
// }

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const { _id } = req.user;

  ClothingItem.create({ name, weather, imageUrl, owner: _id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      handleError(req, res, err);
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      handleError(req, res, err);
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = 404;
      throw error;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => handleError(req, res, err));
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = errorCode404;
      throw error;
    })
    .then(() => res.status(200).send({ message: "Item deleted successfully" }))
    .catch((err) => handleError(req, res, err));
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = errorCode404;
      throw error;
    })
    .then(() => res.status(200).send({ message: "Item liked successfully" }))
    .catch((err) => handleError(req, res, err));
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = errorCode404;
      throw error;
    })
    .then(() => res.status(200).send({ message: "Item disliked successfully" }))
    .catch((err) => {
      handleError(req, res, err);
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
