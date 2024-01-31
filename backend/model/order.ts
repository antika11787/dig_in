import { Schema, model } from "mongoose";
import { IOrder } from "../types/interfaces";

const orderSchema = new Schema<IOrder>(
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
        cost: {
          type: Number,
        }
      },
    ],
    house: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },

  { timestamps: true }
);

const Order = model<IOrder>("Order", orderSchema);
module.exports = Order;
