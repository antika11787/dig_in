import { axiosInstance, axiosInstanceToken } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import dotenv from "dotenv";
dotenv.config();

export const GetCategoryApiById = async (id: string) => {
    try {
        const response = await axiosInstance(`/item/get-items-by-category/${id}`);
        const data = response.data;
        
        if (data.success === false) {
            console.log("Error: ", data.message);
        }
        console.log("items", data.data);
        return data.data;
    } catch (error: any) {
        console.error(
            error.message || "An unknown error occurred during fetching data"
          );
    }
}
