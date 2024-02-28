import express, { Router } from "express";
import itemController from "../controller/itemController";
import upload from "../config/handleImage";
import { isUserLoggedIn, isUserAdmin } from "../middleware/auth";

const routes: Router = express.Router();

routes.post(
  "/create-item",
  upload.array("files"),
  isUserLoggedIn,
  isUserAdmin,
  itemController.createItem
);
routes.post(
  "/upload-image/:id",
  upload.array("files"),
  isUserLoggedIn,
  isUserAdmin,
  itemController.uploadItemImages
);
routes.get("/get-all-items", itemController.getAllItems);
routes.get("/get-items-by-category/:id", itemController.getItemsByCategory);
routes.get("/get-item-by-id/:id", itemController.getItemById);
routes.delete(
  "/delete-item/:id",
  isUserLoggedIn,
  isUserAdmin,
  itemController.deleteItem
);
routes.patch(
  "/update-item/:id",
  isUserLoggedIn,
  isUserAdmin,
  upload.single("banner"),
  itemController.updateItem
);
routes.delete(
  "/remove-images-from-item/:id/:filename",
  isUserLoggedIn,
  isUserAdmin,
  itemController.removeImageFromItem
);
routes.get("/get-item-count/:id", itemController.categoryItemCount);

export = routes;
