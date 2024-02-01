import { axiosInstance, axiosInstanceToken } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import dotenv from "dotenv";
dotenv.config();

export const GetAllItemsApi = async () => {
  try {
    const response = await axiosInstance("/app/v1/item/get-all-items");
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
};

export const GetItemsByCategoryIDApi = async (id: string) => {
  try {
    const response = await axiosInstance(`/app/v1/item/get-items-by-category/${id}`);
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
};

export const GetItemByIdApi = async (id: string) => {
  try {
    const response = await axiosInstance(`/app/v1/item/get-item-by-id/${id}`);
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
};
