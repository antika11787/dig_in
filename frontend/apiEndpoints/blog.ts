import axios from "axios";
import { axiosInstance, axiosInstanceToken } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { FormData, FormDataLogin } from "../types/interfaces";
import dotenv from "dotenv";
dotenv.config();

export const GetBlogsApi = async () => {
    try {
        const response = await axiosInstance("/blog/get-all-blogs");
        const data = response.data;
        console.log("blogs", data.data);

        if (data.success === false) {
            console.log("Error: ", data.message);
        }

        return data.data;
    } catch (error:any) {
        console.error(
            error.message || "An unknown error occurred during fetching data"
          );
    }
}