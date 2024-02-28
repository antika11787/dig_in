import fs from "fs";
import { Request, Response } from "express";
import { IBlog, updateBlog } from "../types/interfaces";
import { IAuthMiddleware } from "../types/interfaces";
import { FilterType } from "../types/interfaces";
import { ParsedQs } from "qs";

const { success, failure } = require("../utils/successError");
const blogModel = require("../model/blog");
const { appConfig } = require("../config/constant");

class BlogController {
  async createBlog(req: Request, res: Response): Promise<Response> {
    try {
      const banner = req.file as Express.Multer.File | undefined;
      const { title, content, tags } = req.body;
      const customRequest = req as IAuthMiddleware;

      if (!title || !content || !tags || !banner) {
        return res.status(400).send(failure("All fields are required"));
      }

      const existingBlog = await blogModel.findOne({ title });

      if (existingBlog) {
        return res.status(400).send(failure("Blog already exists"));
      }

      const tagsArray = tags.split(",").map((tag: string) => tag.trim());

      const pathParts = banner?.path.split(`\\`).pop();

      const blog = new blogModel({
        title,
        content,
        banner: pathParts,
        tags: tagsArray,
        author: customRequest.user._id,
      });

      await blog.save();

      const responseBlog: IBlog = {
        ...blog.toObject(),
        __v: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };

      return res
        .status(200)
        .send(success("Blog created successfully", responseBlog));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async getAllBlogs(req: Request, res: Response): Promise<Response> {
    try {
      let { sortParam, search } = req.query;
      let page: string | string[] | ParsedQs | ParsedQs[] | undefined | number =
        req.query.page;
      let limit:
        | string
        | string[]
        | ParsedQs
        | ParsedQs[]
        | undefined
        | number = req.query.limit;

      let result = 0;
      const totalRecords = await blogModel.countDocuments({});

      if (!page || !limit) {
        page = 1;
        limit = 100;
      }

      // sorting
      if (
        sortParam &&
        sortParam !== "" &&
        sortParam !== "createdAtAsc" &&
        sortParam !== "createdAtDesc"
      ) {
        return res
          .status(400)
          .send(failure("Invalid sort parameters provided."));
      }

      // Filtering
      const filter: FilterType = {};

      // search
      if (search) {
        filter["$or"] = [
          { title: { $regex: String(search), $options: "i" } },
          { content: { $regex: String(search), $options: "i" } },
          { tags: { $regex: String(search), $options: "i" } },
        ];
      }

      // Pagination
      result = await blogModel
        .find(filter)
        .sort(
          sortParam
            ? {
                createdAtAsc: { createdAt: 1 },
                createdAtDesc: { createdAt: -1 },
              }[sortParam as string]
            : { _id: 1 }
        )
        .skip(((page as number) - 1) * (limit as number))
        .limit(limit)
        .select("-__v")
        .populate({
          path: "author",
          select: "_id username email",
        });

      if (Array.isArray(result) && result.length > 0) {
        const paginationResult = {
          blogs: result,
          totalInCurrentPage: result.length,
          currentPage: parseInt(page.toString()),
          totalRecords: totalRecords,
        };
        return res
          .status(200)
          .send(success("Successfully received all items", paginationResult));
      }

      // if (result.blogs.length === 0) {
      //   return res.status(404).send({ message: "No blogs found" });
      // }

      return res.status(400).send(failure("No blogs found", result));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async getMyBlogs(req: Request, res: Response): Promise<Response> {
    try {
      const customRequest = req as IAuthMiddleware;
      console.log("blogs", customRequest.user);
      const blogs = await blogModel
        .find({ author: customRequest.user })
        .populate({
          path: "author",
          select: "_id username email",
        });

      if (blogs.length === 0) {
        return res.status(404).send({ message: "No blogs found" });
      }

      return res.status(200).send(success("Blogs fetched successfully", blogs));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async getBlogById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send({ message: "Blog id is required" });
      }

      const blog = await blogModel.findById(id).populate({
        path: "author",
        select: "_id username email",
      });

      if (!blog) {
        return res.status(404).send({ message: "Blog not found" });
      }

      const responseBlog: IBlog = {
        ...blog.toObject(),
        __v: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };

      return res
        .status(200)
        .send(success("Blog fetched successfully", responseBlog));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async getBlogsByAuthorId(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send({ message: "Author id is required" });
      }

      const blogs = await blogModel.find({ author: id }).populate({
        path: "author",
        select: "_id username email",
      });

      if (blogs.length === 0) {
        return res.status(404).send({ message: "No blogs found" });
      }

      return res.status(200).send(success("Blogs fetched successfully", blogs));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async deleteBlog(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(404).send({ message: "No blogs found" });
      }

      const blog = await blogModel.findById(id);

      if (!blog) {
        return res.status(404).send({ message: "No blogs found" });
      }

      const imagePath: string = blog.banner;

      fs.unlink(`/${imagePath}`, async (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send(failure("Internal server error", err));
        }
      });

      await blogModel.findByIdAndDelete(id);

      return res.status(200).send({ message: "Blog deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async updateBlog(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const banner = (req.file as Express.Multer.File) || undefined;
      const { title, content, tags } = req.body;

      if (!id) {
        return res.status(400).send(failure("Blog id is required"));
      }

      const blog = await blogModel.findById(id);

      if (!blog) {
        return res.status(404).send(failure("Blog not found"));
      }

      const existingTitle = await blogModel.findOne({ title });

      if (existingTitle && existingTitle._id.toString() !== id) {
        return res.status(400).send(failure("Title already exists"));
      }

      let tagsArray;

      if (tags && typeof tags === "string") {
        tagsArray = tags.split(",").map((tag: string) => tag.trim());
      }

      if (banner) {
        fs.unlink(`${appConfig.dirname}/${blog.banner}`, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).send(failure("Internal server error", err));
          }
        });
      }

      const pathParts = banner?.path.split(`\\`).pop();

      const updateFields: updateBlog = {
        title,
        content,
        tags: tagsArray,
        banner: pathParts,
      };

      await blogModel.findByIdAndUpdate(id, updateFields);

      const updatedBlog = await blogModel.findById(id);

      return res
        .status(200)
        .send(success("Blog updated successfully", updatedBlog));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }
}

export default new BlogController();
