import { Schema, model } from "mongoose";
import { ICategory } from "../types/interfaces";

const categorySchema = new Schema<ICategory>(
  {
    categoryName: {
      type: String,
      maxLength: 20,
      unique: true,
      required: [true, "Category name should be provided"],
    },
    image: {
      type: String,
      required: [true, "Image should be provided"],
    },
  },
  { timestamps: true }
);

const Category = model<ICategory>("Category", categorySchema);
module.exports = Category;
