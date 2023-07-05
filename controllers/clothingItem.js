const ClothingItem = require("../models/clothingItem");
const {
  ERROR_CODES,
  handleError,
  handleOnFailError,
} = require("../utils/errors");

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

// const deleteItem = (req, res) => {
//   const { itemId } = req.params;
//   const { _id: userId } = req.user;

//   ClothingItem.findOne({ _id: itemId })
//     .then((item) => {
//       if (!item) {
//         return res
//           .status(ERROR_CODES.NotFound)
//           .send({ message: "Item not found!!!!" });
//       }

//       if (!item.owner.equals(userId)) {
//         return res.status(ERROR_CODES.Forbidden).send({
//           message: "Unauthorized: Only the card owner can delete it",
//         });
//       }

//       return ClothingItem.deleteOne({ _id: itemId, owner: userId })
//         .then(() => {
//           res.send({ message: "Item deleted successfully" });
//         })
//         .catch(() => {
//           res.status().send({ message: "An error has occurred on the server" });
//         });
//     })
//     .catch((error) => {
//       if (error.name === "CastError") {
//         return res
//           .status(ERROR_CODES.BadRequest)
//           .send({ message: "Invalid item ID" });
//       }

//       return res
//         .status(ERROR_CODES.ServerError)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

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

// const deleteItem = (req, res) => {
//   ClothingItem.findById(req.params.itemId)
//     .orFail(() => {
//       const error = new Error("Item ID not found");
//       error.statusCode = 404;
//       throw error;
//     })
//     .then((item) => {
//       if (String(item.owner) !== req.user._id) {
//         return res
//           .status(ERROR_CODES.Forbidden)
//           .send({ message: "You are not authorized to delete this item" });
//       }
//       return item.deleteOne().then(() => {
//         res.send({ message: "Item deleted" });
//       });
//     })
//     .catch((err) => {
//       if (err.statusCode === 404) {
//         res.status(ERROR_CODES.NotFound).send({ message: "Item not found" });
//       } else if (err.name === "CastError") {
//         res
//           .status(ERROR_CODES.BadRequest)
//           .send({ message: "Bad Request and/or invalid input" });
//       } else {
//         res
//           .status(ERROR_CODES.DefaultError)
//           .send({ message: "Something went wrong" });
//       }
//     });
// };

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
    .then(() => res.status(200).send({ message: "Item liked successfully" }))
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
    .then(() => res.status(200).send({ message: "Item disliked successfully" }))
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
