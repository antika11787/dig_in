import { axiosInstanceToken } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import dotenv from "dotenv";
import { CreateUserForm } from "@/types/interfaces";
dotenv.config();

export const GetMyProfileApi = () => {
  return axiosInstanceToken
    .get("/app/v1/user/get-my-profile")
    .then((response) => {
      console.log("response", response.data.data);
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const GetAllUsersApi = () => {
  return axiosInstanceToken
    .get("/app/v1/user/get-all-users")
    .then((response) => {
      console.log("response", response.data.data);
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const GetUserByIdApi = (id: string) => {
  return axiosInstanceToken
    .get(`/app/v1/user/get-user-by-id/${id}`)
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
    .patch(`/app/v1/users/update-user/${id}`, data)
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
    .delete(`/app/v1/users/delete-user/${id}`)
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
