import express, { Router } from "express";
import blogController from "../controller/blogController";
import {
  isUserLoggedIn,
  isUserAdmin,
  isUserCustomer,
  isUserAuthor,
} from "../middleware/auth";
import upload from "../config/handleImage";

const routes: Router = express.Router();

routes.post(
  "/create-blog",
  upload.single("banner"),
  isUserLoggedIn,
  isUserAuthor,
  blogController.createBlog
);
routes.get("/get-all-blogs", blogController.getAllBlogs);
routes.get("/get-my-blogs", isUserLoggedIn, blogController.getMyBlogs);
routes.get("/get-blog-by-id/:id", blogController.getBlogById);
routes.get("/get-blog-by-author/:id", blogController.getBlogsByAuthorId);
routes.delete(
  "/delete-blog/:id",
  isUserLoggedIn,
  isUserAuthor,
  blogController.deleteBlog
);
routes.patch(
  "/update-blog/:id",
  upload.single("banner"),
  isUserLoggedIn,
  isUserAuthor,
  blogController.updateBlog
);

export = routes;
