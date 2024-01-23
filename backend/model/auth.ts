import { Schema, model, Types } from "mongoose";
import { IAuth } from "../types/interfaces";

const authSchema = new Schema<IAuth>(
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
    password: {
      type: String,
      required: [true, "Password should be provided"],
    },
    role: {
      type: String,
      required: true,
      default: "customer",
    },
    address: {
      type: String,
      default: null,
      required: [true, "Address should be provided"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationTokenExpired: {
      type: Date,
      default: null,
    },
    resetPassword: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpired: {
      type: Date,
      default: null,
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Auth = model<IAuth>("Auth", authSchema);
module.exports = Auth;
