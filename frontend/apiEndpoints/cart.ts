import { axiosInstance, axiosInstanceToken } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import dotenv from "dotenv";
dotenv.config();

export const GetMyCartApi =async ()=>{
    try {
        const response = await axiosInstanceToken(`/app/v1/cart/get-my-cart`);
        const data = response.data;
        
        if (data.success === false) {
            console.log("Error: ", data.message);
        }
        return data.data;
    } catch (error: any) {
        console.error(
            error.message || "An unknown error occurred during fetching data"
          );
    }
}