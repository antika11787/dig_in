import { axiosInstance } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { FormData, FormDataLogin } from "../types/interfaces";
import dotenv from "dotenv";
dotenv.config();

export const SignupApi = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(`/app/v1/auth/signup`, formData);
    const data = response.data;

    if (data.success === false) {
      toast.error(data.message);
    } else if (data.success === true) {
      toast.success(data.message);
      return data;
    }
  } catch (error: any) {
    toast.error(error.message || "An unknown error occurred during signup");
  }
};

export const LoginApi = async (formData: FormDataLogin) => {
  try {
    const response = await axiosInstance.post(`/app/v1/auth/login`, formData);
    const data = response.data;

    if (data.success === false) {
      toast.error(data.message);
    } else if (data.success === true) {
      toast.success(data.message);
      return data;
    }
  } catch (error: any) {
    toast.error(error.message || "An unknown error occurred during signup");
  }
};
