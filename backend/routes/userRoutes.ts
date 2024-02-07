import express, { Router } from "express";
import userController from "../controller/userController";
import upload from "../config/handleImage";
import { isUserLoggedIn, isUserAdmin, isUserCustomer } from "../middleware/auth";

const routes: Router = express.Router();

routes.get("/get-all-users", userController.getAllUsers);
routes.get("/get-my-profile", isUserLoggedIn, userController.getMyProfile);
routes.patch("/update-user/:id", isUserLoggedIn, isUserAdmin, userController.updateUserInfo);

export = routes;