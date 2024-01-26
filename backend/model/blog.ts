import { Schema, model } from "mongoose";
import { IBlog } from "../types/interfaces";

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      maxLength: 100,
      unique: true,
      required: [true, "Food item name should be provided"],
    },
    content: {
      type: String,
      required: [true, "blog content should be provided"],
    },
    banner: {
      type: String,
      required: [true, "Banner should be provided"],
    },
    tags: {
      type: [String],
    },
    // icon: {
    //   type: String,
    // },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Blog = model<IBlog>("Blog", blogSchema);
module.exports = Blog;
