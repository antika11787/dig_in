import { axiosInstance, axiosInstanceToken } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { CreateCategoryForm } from "@/types/interfaces";
import dotenv from "dotenv";
dotenv.config();

export const GetCategoriesApi = async () => {
  return axiosInstanceToken
    .get("/app/v1/category/get-categories")
    .then((response) => {
      console.log("response", response.data.data);
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const GetCategoryByIdApi = async (id : string) => {
  return axiosInstanceToken
    .get(`/app/v1/category/get-category/${id}`)
    .then((response) => {
      console.log("response", response.data.data);
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const CreateCategoryApi = (data: any) => {
  return axiosInstanceToken
    .post("/app/v1/category/create-category", data)
    .then((response) => {
      console.log("response", response.data.data);
      toast.success(response.data.message);
      return response.data.data;
    })
    .catch((error) => {
      toast.error(error.response.data.message);
      console.log(error);
    });
};

export const UpdateCategoryApi = (id: string, data: any) => {
  return axiosInstanceToken
    .patch(`/app/v1/category/update-category/${id}`, data)
    .then((response) => {
      console.log("response", response.data.data);
      toast.success(response.data.message);
      return response.data.data;
    })
    .catch((error) => {
      toast.error(error.response.data.message);
      console.log(error);
    });
}

export const DeleteCategoryApi = (id: string) => {
  return axiosInstanceToken
    .delete(`/app/v1/category/delete-category/${id}`)
    .then((response) => {
      console.log("response", response.data.data);
      toast.success(response.data.message);
      return response.data.data;
    })
    .catch((error) => {
      toast.error(error.response.data.message);
      console.log(error);
    });
};
