const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const ClothingItem = require("../models/clothingItem");
const ForbiddenError = require("../errors/forbidden");
const BadRequestError = require("../errors/invalidData");
const NotFoundError = require("../errors/notFound");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  if (!name && !weather && !imageUrl) {
    next(new BadRequestError("Missing the required fields"));
    return;
  }

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Validation Error"));
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find()
    .then((items) => res.send(items))
    .catch((err) => {
      next(err);
    });
};

const updateItem = (req, res, next) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } }, { new: true })
    .orFail(() => {
      next(new NotFoundError("Clothing item ID cannot be found"));
    })
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Clothing item ID cannot be found"));
      }
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Validation Error"));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  if (!ObjectId.isValid(itemId)) {
    next(new BadRequestError("Invalid item ID"));
    return;
  }

  ClothingItem.findOne({ _id: itemId }).then((item) => {
    if (!item) {
      next(new NotFoundError("Clothing item ID cannot be found"));
      return null;
    }
    if (!item?.owner?.equals(userId)) {
      next(new ForbiddenError("Unauthorized: You are not the card owner"));
      return null;
    }
    return ClothingItem.deleteOne({ _id: itemId, owner: userId })
      .then(() => {
        res.send({ message: "Item deleted successfully" });
      })
      .catch((error) => {
        next(error);
      });
  });
};

// TODO ? - should I send the card + message, or { data: item }
const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  if (!ObjectId.isValid(itemId)) {
    next(new BadRequestError("Invalid item ID"));
    return;
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Clothing item ID cannot be found"))
    .then((card) =>
      res.status(200).send({ card, message: "Item liked successfully" })
    )
    .catch((err) => next(err));
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  if (!ObjectId.isValid(itemId)) {
    next(new BadRequestError("Invalid item ID"));
    return;
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Clothing item ID cannot be found"))
    .then((card) =>
      res.status(200).send({ card, message: "Item disliked successfully" })
    )
    .catch((err) => {
      next(err);
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
