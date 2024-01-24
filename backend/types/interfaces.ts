import { Document, Types } from "mongoose";
import { Request } from "express";

interface IAuth extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  address: string;
  isVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationTokenExpired: Date | null;
  resetPassword: boolean | null;
  resetPasswordToken: string | null;
  resetPasswordExpired: Date | null;
  userID: Types.ObjectId;
}

interface IUser extends Document {
  username: string;
  email: string;
  role: string;
  address: string;
}

interface ICategory extends Document {
  categoryName: string;
  file: string;
}

interface IItem extends Document {
  title: string;
  description: string;
  price: number;
  banner: string;
  files: string[];
  categoryID: Types.ObjectId;
}

interface ICartItem extends Document {
  itemID: Types.ObjectId;
  quantity: number;
}

interface ICart extends Document {
  userID: Types.ObjectId;
  items: ICartItem[];
}

interface updateItem {
  title?: string;
  description?: string;
  price?: number;
  banner?: string;
  categoryID?: Types.ObjectId;
}

interface AuthResponse {
  username: string;
  email: string;
  userId: string;
  emailVerificationToken?: string;
  emailVerificationTokenExpired?: Date;
  resetPassword?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpired?: Date;
  token?: string;
}

interface CustomRequest extends Request {
  file_extension?: string;
}

interface IAuthMiddleware extends Request {
  user: IAuth;
}

interface CategoryResponse {
  categoryName: string;
  file: string;
}

interface ItemResponse {
  title: string;
  description: string;
  price: number;
}

export {
  IAuth,
  IUser,
  ICategory,
  IItem,
  ICartItem,
  ICart,
  updateItem,
  AuthResponse,
  CustomRequest,
  IAuthMiddleware,
  CategoryResponse,
  ItemResponse
};
