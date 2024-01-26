import fs from "fs";
import { Request, Response } from "express";
import { IBlog, updateBlog } from "../types/interfaces";
import { IAuthMiddleware } from "../types/interfaces";

const { success, failure } = require("../utils/successError");
const blogModel = require("../model/blog");

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

      const blog = new blogModel({
        title,
        content,
        banner: banner?.path,
        // icon: icon?.path,
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
      const blogs = await blogModel.find();

      if (blogs.length === 0) {
        return res.status(404).send({ message: "No blogs found" });
      }

      return res.status(200).send(success("Blogs fetched successfully", blogs));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async getMyBlogs(req: Request, res: Response): Promise<Response> {
    try {
      const customRequest = req as IAuthMiddleware;
      const blogs = await blogModel.find({ author: customRequest.user });

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

      const blog = await blogModel.findById(id);

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

      const blogs = await blogModel.find({ author: id });

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

      fs.unlink(imagePath, async (err) => {
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

      if (tags) {
        tagsArray = tags.split(",").map((tag: string) => tag.trim());
      }

      if (banner) {
        fs.unlink(blog.banner, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).send(failure("Internal server error", err));
          }
        });
      }

      const updateFields: updateBlog = {
        title,
        content,
        tags: tagsArray,
        banner: banner ? banner.path : blog.banner,
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
