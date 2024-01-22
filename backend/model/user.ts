import { Schema, model } from "mongoose";
import { IUser } from "../types/interfaces";

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      maxLength: 50,
      unique: true,
      required: [true, "Username should be provided"],
    },
    email: {
      type: String,
      maxLength: 100,
      unique: true,
      required: [true, "Email should be provided"],
    },
    role: {
      type: String,
      required: true,
      default: "customer",
    },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);
module.exports = User;
