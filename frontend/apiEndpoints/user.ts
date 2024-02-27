import { axiosInstanceToken } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import dotenv from "dotenv";
import { CreateUserForm } from "@/types/interfaces";
dotenv.config();

export const GetMyProfileApi = () => {
  return axiosInstanceToken
    .get("/api/v1/user/get-my-profile")
    .then((response) => {
      console.log("response", response.data.data);
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const GetAllUsersApi = async (searchQuery?: string | undefined) => {
  try {
    const queryParams: { [key: string]: string | number | undefined } = {
      search: searchQuery,
    };

    let queryString = Object.entries(queryParams)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const response = await axiosInstanceToken(
      `/api/v1/user/get-all-users?${queryString}`
    );
    const data = response.data;
    console.log("items", data.data.blogs);

    if (data.success === false) {
      console.log("Error: ", data.message);
    }

    return data.data;
  } catch (error: any) {
    console.error(
      error.message || "An unknown error occurred during fetching data"
    );
  }
};

export const GetUserByIdApi = (id: string) => {
  return axiosInstanceToken
    .get(`/api/v1/user/get-user-by-id/${id}`)
    .then((response) => {
      console.log("response", response.data.data);
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const UpdateUserApi = (id: string, data: CreateUserForm) => {
  return axiosInstanceToken
    .patch(`/api/v1/users/update-user/${id}`, data)
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

export const DeleteUsersApi = (id: string) => {
  return axiosInstanceToken
    .delete(`/api/v1/users/delete-user/${id}`)
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

export const VerifyAuthorApi = (id: string) => {
  return axiosInstanceToken
    .patch(`/api/v1/users/verify-author/${id}`)
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
