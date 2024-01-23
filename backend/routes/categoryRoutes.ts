import express, { Router } from "express";
import categoryController from "../controller/categoryController";
import upload from "../config/handleImage";

const routes: Router = express.Router();

routes.post(
  "/create-category",
  upload.single("file"),
  categoryController.createCategory
);
routes.get("/get-categories", categoryController.getAllCategories);
routes.get("/get-category/:id", categoryController.getCategoryById);
routes.delete("/delete-category/:id", categoryController.deleteCategory);
routes.patch(
  "/update-category/:id",
  upload.single("file"),
  categoryController.updateCategory
);

export = routes;
