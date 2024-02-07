import { axiosInstanceToken } from "../utils/axiosInstance";
import dotenv from "dotenv";
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
