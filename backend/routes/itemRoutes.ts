import express, { Router } from "express";
import itemController from "../controller/itemController";
import upload from "../config/handleImage";

const routes: Router = express.Router();

routes.post("/create-item", upload.single("banner"), itemController.createItem);
routes.post("/upload-image/:id", upload.array("files"), itemController.uploadItemImages);
routes.get("/get-all-items", itemController.getAllItems);
routes.get("/get-items-by-category/:id", itemController.getItemsByCategory);

export = routes;
