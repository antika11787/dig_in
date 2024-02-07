import { axiosInstance, axiosInstanceToken } from "../utils/axiosInstance";
import { AddToCartResponse } from "../types/interfaces";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import dotenv from "dotenv";
dotenv.config();

export const GetMyCartApi = async () => {
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
};

export const AddToCartApi = async ({
  itemID,
  quantity,
}: {
  itemID: string;
  quantity: number;
}) => {
  try {
    const response: AxiosResponse = await axiosInstanceToken.post(
      `/app/v1/cart/add-to-cart`,
      { itemID, quantity }
    );
    const responseData = response.data;

    if (responseData.success === false) {
      toast.error("Error: ", responseData.message);
    }
    toast.success("Item added to cart");
    return responseData.data;
  } catch (error: any) {
    toast.error(
      error.response.data.message ||
        "An unknown error occurred during fetching data"
    );
    console.error(error || "An unknown error occurred during fetching data");
  }
};

export const UpdateQuantityApi = async ({
  itemID,
  quantity,
}: {
  itemID: string;
  quantity: number;
}) => {
  try {
    console.log("data", itemID);
    const response: AxiosResponse = await axiosInstanceToken.patch(
      `/app/v1/cart/update-quantity`,
      { itemID, quantity }
    );
    console.log("response", response);
    const responseData = response.data;

    if (responseData.success === false) {
      toast.error("Error: ", responseData.message);
    }
    toast.success(responseData.message);
    return responseData.data;
  } catch (error: any) {
    toast.error(
      error.response.data.message ||
        "An unknown error occurred during fetching data"
    );
    console.error(error || "An unknown error occurred during fetching data");
  }
};

export const RemoveFromCartApi = async (itemID: string) => {
  try {
    const response: AxiosResponse = await axiosInstanceToken.delete(
      `/app/v1/cart/remove-from-cart/${itemID}`
    );
    const responseData = response.data;

    if (responseData.success === false) {
      toast.error("Error: ", responseData.message);
    }

    toast.success("Item removed from cart");

    return responseData.data;
  } catch (error: any) {
    toast.error(
      error.response.data.message ||
        "An unknown error occurred during fetching data"
    );
    console.error(error || "An unknown error occurred during fetching data");
  }
};

export const ClearCartApi = async () => {
  try {
    const response: AxiosResponse = await axiosInstanceToken.delete(
      `/app/v1/cart/clear-cart`
    );
    const responseData = response.data;

    if (responseData.success === false) {
      toast.error("Error: ", responseData.message);
    }
    toast.success("Cart cleared");
    return responseData.data;
  } catch (error: any) {
    toast.error(
      error.response.data.message ||
        "An unknown error occurred during fetching data"
    );
    console.error(error || "An unknown error occurred during fetching data");
  }
};

export const CheckoutApi = async ({
  house,
  area,
  street,
}: {
  house: string;
  area: string;
  street: string;
}) => {
  try {
    const response: AxiosResponse = await axiosInstanceToken.post(
      `/app/v1/cart/checkout`,
      { house, area, street }
    );
    const responseData = response.data;

    if (responseData.success === false) {
      toast.error("Error: ", responseData.message);
    }
    toast.success("Cart cleared");
    return responseData.data;
  } catch (error: any) {
    toast.error(
      error.response.data.message ||
        "An unknown error occurred during fetching data"
    );
    console.error(error || "An unknown error occurred during fetching data");
  }
};

export const PaymentSuccessApi = async (id: string) => {
  try {
    const response: AxiosResponse = await axiosInstanceToken.get(
      `/app/v1/cart/payment-success/${id}`
    );
    const responseData = response.data;

    if (responseData.success === false) {
      toast.error("Error: ", responseData.message);
    }
    toast.success("Cart cleared");
    return responseData.data;
  } catch (error: any) {
    // toast.error(
    //   error.response.data.message ||
    //     "An unknown error occurred during fetching data"
    // );
    console.error(error || "An unknown error occurred during fetching data");
  }
};

export const PaymentFailApi = async (id: string) => {
  try {
    const response: AxiosResponse = await axiosInstanceToken.get(
      `/app/v1/cart/payment-fail/${id}`
    );
    const responseData = response.data;

    if (responseData.success === false) {
      toast.error("Error: ", responseData.message);
    }
    toast.success("Cart cleared");
    return responseData.data;
  } catch (error: any) {
    toast.error(
      error.response.data.message ||
        "An unknown error occurred during fetching data"
    );
    console.error(error || "An unknown error occurred during fetching data");
  }
};
