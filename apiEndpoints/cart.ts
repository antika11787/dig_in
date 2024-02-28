import { axiosInstance, axiosInstanceToken } from "../utils/axiosInstance";
import { AddToCartResponse } from "../types/interfaces";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import dotenv from "dotenv";
dotenv.config();

export const GetMyCartApi = async () => {
  try {
    const response = await axiosInstanceToken(`/api/v1/cart/get-my-cart`);
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
      `/api/v1/cart/add-to-cart`,
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

export const SaveQuantityApi = async ({
  itemID,
  quantity,
}: {
  itemID: string;
  quantity: number;
}) => {
  try {
    const response: AxiosResponse = await axiosInstanceToken.post(
      `/api/v1/cart/save-quantity`,
      { itemID, quantity }
    );
    const responseData = response.data;

    if (responseData.success === false) {
      toast.error("Error: ", responseData.message);
    }
    toast.success("Cart updated!");
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
      `/api/v1/cart/update-quantity`,
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
      `/api/v1/cart/remove-from-cart/${itemID}`
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
      `/api/v1/cart/clear-cart`
    );
    const responseData = response.data;

    if (responseData.success === false) {
      toast.error("Error: ", responseData.message);
    }
    // toast.success("Cart cleared");
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
  phone,
}: {
  house: string;
  area: string;
  street: string;
  phone: string;
}) => {
  try {
    const response: AxiosResponse = await axiosInstanceToken.post(
      `/api/v1/cart/checkout`,
      { house, area, street, phone }
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
      `/api/v1/cart/payment-success/${id}`
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
      `/api/v1/cart/payment-fail/${id}`
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

export const GetAllOrdersApi = async (sortParam?: string | undefined) => {
  try {
    // Create an object to hold the query parameters
    const queryParams: { [key: string]: string | number | undefined } = {};

    if (sortParam !== undefined) {
      queryParams.sortParam = sortParam;
    }

    // Create the query string by filtering out undefined values
    const queryString = Object.entries(queryParams)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    // Make the API call with the constructed query string
    const response = await axiosInstanceToken(
      `/api/v1/cart/get-all-orders?${queryString}`
    );
    const data = response.data;
    console.log("orders", data.data);

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

export const GetOrderByIdApi = async (id: string) => {
  return axiosInstanceToken
    .get(`/api/v1/cart/get-order-by-id/${id}`)
    .then((response) => {
      console.log("response", response.data.data);
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const GetMyOrdersApi = async () => {
  return axiosInstanceToken
    .get(`/api/v1/cart/get-my-orders`)
    .then((response) => {
      console.log("response", response.data.data);
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const SetStatusApi = async (id: string, status: string) => {
  return axiosInstanceToken
    .post(`/api/v1/cart/set-status/${id}`, { status })
    .then((response) => {
      console.log("response", response.data.data);
      toast.success("Status updated");
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
      toast.error(
        error.response.data.message ||
          "An unknown error occurred during updating status"
      );
    });
};
