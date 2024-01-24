import express, { Router } from "express";
import categoryController from "../controller/categoryController";
import upload from "../config/handleImage";
import { isUserLoggedIn, isUserAdmin } from "../middleware/auth";

const routes: Router = express.Router();

routes.post(
  "/create-category",
  upload.single("file"),
  isUserLoggedIn, isUserAdmin,
  categoryController.createCategory
);
routes.get(
  "/get-categories",
  categoryController.getAllCategories
);
routes.get(
  "/get-category/:id",
  categoryController.getCategoryById
);
routes.delete("/delete-category/:id", isUserLoggedIn, isUserAdmin, categoryController.deleteCategory);
routes.patch(
  "/update-category/:id",
  upload.single("file"),
  isUserLoggedIn, isUserAdmin,
  categoryController.updateCategory
);

export = routes;
