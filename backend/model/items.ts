import { Schema, model } from "mongoose";
import { IItem } from "../types/interfaces";

const itemSchema = new Schema<IItem>(
  {
    title: {
      type: String,
      maxLength: 100,
      unique: true,
      required: [true, "Food item name should be provided"],
    },
    description: {
      type: String,
      required: [true, "description should be provided"],
    },
    price: {
      type: Number,
      required: [true, "Price should be provided"],
    },
    banner: {
      type: String,
      required: [true, "Banner should be provided"],
    },
    files: {
      type: [String],
    },
    categoryID: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

const Item = model<IItem>("Item", itemSchema);
module.exports = Item;
