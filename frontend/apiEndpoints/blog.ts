import axios from "axios";
import { axiosInstance, axiosInstanceToken } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { CreateBlogForm, FormData, FormDataLogin } from "../types/interfaces";
import dotenv from "dotenv";
dotenv.config();

// export const GetBlogsApi = async () => {
//     try {
//         const response = await axiosInstance("/app/v1/blog/get-all-blogs");
//         const data = response.data;
//         console.log("blogs", data.data);

//         if (data.success === false) {
//             console.log("Error: ", data.message);
//         }

//         return data.data;
//     } catch (error:any) {
//         console.error(
//             error.message || "An unknown error occurred during fetching data"
//           );
//     }
// }

export const GetBlogsApi = async (
  searchQuery?: string | undefined,
  limit?: number | undefined,
  page?: number | undefined,
  sortParam?: string | undefined
) => {
  try {
    // Create an object to hold the query parameters
    const queryParams: { [key: string]: string | number | undefined } = {
      search: searchQuery,
    };
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

    // Make the API call with the constructed query string
    const response = await axiosInstance(
      `/app/v1/blog/get-all-blogs?${queryString}`
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

export const GetBlogByIdApi = async (id: string) => {
  return axiosInstance
    .get(`/app/v1/blog/get-blog-by-id/${id}`)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const GetBlogsByIdApi = async (id: string) => {
  return axiosInstance
    .get(`/app/v1/blog/get-blog-by-id/${id}`)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const GetMyBlogsApi = async () => {
  return axiosInstanceToken
    .get(`/app/v1/blog/get-my-blogs`)
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const CreateBlogApi = async (data: any) => {
  return axiosInstanceToken
    .post("/app/v1/blog/create-blog", data)
    .then((response) => {
      toast.success(response.data.message);
      return response.data.data;
    })
    .catch((error) => {
      toast.error(error.response.data.message);
      console.log(error);
    });
};

export const DeleteBlogApi = async (id: string) => {
  return axiosInstanceToken
    .delete(`/app/v1/blog/delete-blog/${id}`)
    .then((response) => {
      toast.success(response.data.message);
      return response.data.data;
    })
    .catch((error) => {
      toast.error(error.response.data.message);
      console.log(error);
    });
};

export const UpdateBlogApi = async (id: string, data: any) => {
  return axiosInstanceToken
    .patch(`/app/v1/blog/update-blog/${id}`, data)
    .then((response) => {
      toast.success(response.data.message);
      return response.data.data;
    })
    .catch((error) => {
      toast.error(error.response.data.message);
      console.log(error);
    });
};
