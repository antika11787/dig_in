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

export const GetBlogsApi = async () => {
  return axiosInstance
    .get("/app/v1/blog/get-all-blogs")
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
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
