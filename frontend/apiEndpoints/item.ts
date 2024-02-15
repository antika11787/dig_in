import { axiosInstance, axiosInstanceToken } from "../utils/axiosInstance";
import { AxiosResponse, AxiosError } from "axios";
import { toast } from "react-toastify";
import dotenv from "dotenv";
import { CreateItemForm } from "@/types/interfaces";
dotenv.config();

export const CreateItemsApi = (data: any) => {
  return axiosInstanceToken
    .post("/app/v1/item/create-item", data)
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

export const GetAllItemsApi = async (
  searchQuery: string,
  filter?: { [key: string]: string[] },
  limit?: number | undefined,
  page?: number | undefined,
  sortParam?: string | undefined
) => {
  try {
    // Create an object to hold the query parameters
    const queryParams: { [key: string]: string | number | undefined } = {
      search: searchQuery,
    };

    // Add the filter values to the queryParams if they are defined
    if (filter && filter.price && filter.price.length > 0) {
      queryParams.priceMin = filter.price[0];
      queryParams.priceMax = filter.price[1];
    }

    // if (filter.tags.length > 0) {
    //   filter.tags.forEach((tag) => {
    //     queryParams.tags = tag;
    //   });
    // }

    // Add limit and page to the queryParams if they are defined
    if (limit !== undefined) {
      queryParams.limit = limit.toString();
    }

    // Add page and sortParam to the queryParams if they are defined
    if (page !== undefined) {
      queryParams.page = page.toString();
    }

    if (sortParam !== undefined) {
      queryParams.sortParam = sortParam;
    }

    // Create the query string by filtering out undefined values
    let queryString = Object.entries(queryParams)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    if (filter && filter.category && filter.category.length > 0) {
      filter.category.forEach((category) => {
        queryString = queryString + `&category=${category}`;
      });
    }

    // Make the API call with the constructed query string
    const response = await axiosInstance(
      `/app/v1/item/get-all-items?${queryString}`
    );
    const data = response.data;
    console.log("items", data.data.items);

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

export const GetItemsByCategoryIDApi = async (id: string) => {
  try {
    const response = await axiosInstance(
      `/app/v1/item/get-items-by-category/${id}`
    );
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

export const DeleteItemApi = (id: string) => {
  return axiosInstanceToken
    .delete(`/app/v1/item/delete-item/${id}`)
    .then((response: AxiosResponse) => {
      console.log("response", response.data.data);
      toast.success(response.data.message);
      return response.data.data;
    })
    .catch((error) => {
      toast.error(error.response.data.message);
      console.log(error);
    });
};

export const UploadImageToItemApi = (id: string, data: any) => {
  const formData = new FormData();
  data.forEach((file: any) => {
    formData.append("files", file);
  });
  return axiosInstanceToken
    .post(`/app/v1/item/upload-image/${id}`, formData)
    .then((response) => {
      console.log("response", response.data.data);
      // toast.success(response.data.message);
      return response.data.data;
    })
    .catch((error) => {
      // toast.error(error.response.data.message);
      console.log(error);
    });
};

export const RemoveImageFromItemApi = (id: string, filename: string) => {
  return axiosInstanceToken
    .delete(`/app/v1/item/remove-images-from-item/${id}/${filename}`)
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

export const UpdateItemApi = (id: string, data: any) => {
  return axiosInstanceToken
    .patch(`/app/v1/item/update-item/${id}`, data)
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

export const CategoryItemCountApi = (id: string) => {
  return axiosInstanceToken
    .get(`/app/v1/item/get-item-count/${id}`)
    .then((response) => {
      console.log("response", response.data.data);
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
