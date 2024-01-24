import { Schema, model } from "mongoose";
import { ICart } from "../types/interfaces";

const cartSchema = new Schema<ICart>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        itemID: {
          type: Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      }
    ]
  },
  { timestamps: true }
);

const Cart = model<ICart>("Cart", cartSchema);
module.exports = Cart;
