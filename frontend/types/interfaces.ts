// import { Types } from "mongoose";

interface FormData {
  username: string;
  email: string;
  role: string;
  address: string;
  password: string;
  confirm_password: string;
}

interface FormDataLogin {
  email: string;
  password: string;
}

interface ButtonProps {
  type: "button" | "submit" | "reset";
  value: string;
  onClick?: () => void;
  additionalStyle?: string;
}

interface CategoryResponse {
  _id: string;
  categoryName: string;
  file: string;
}

interface BlogResponse {
  _id: string;
  title: string;
  content: string;
  banner: string;
  author: string;
  updatedAt: string;
}

export type { FormData, FormDataLogin, ButtonProps, CategoryResponse, BlogResponse };
