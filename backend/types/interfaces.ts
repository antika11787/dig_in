import { Document, Types } from "mongoose";

interface IAuth extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
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
}

interface ICategory extends Document {
  categoryName: string;
  image: string;
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

export { IAuth, IUser, ICategory, AuthResponse };
