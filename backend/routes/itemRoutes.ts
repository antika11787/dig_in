import express, { Router } from "express";
import itemController from "../controller/itemController";
import upload from "../config/handleImage";
import { isUserLoggedIn, isUserAdmin } from "../middleware/auth";

const routes: Router = express.Router();

routes.post(
  "/create-item",
  upload.single("banner"),
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

export = routes;
