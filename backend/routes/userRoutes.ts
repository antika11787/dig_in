import express, { Router } from "express";
import userController from "../controller/userController";
import upload from "../config/handleImage";
import { isUserLoggedIn, isUserAdmin, isUserCustomer } from "../middleware/auth";

const routes: Router = express.Router();

routes.get("/get-all-users", userController.getAllUsers);
routes.patch("/update-user/:id", isUserLoggedIn, isUserAdmin || isUserCustomer, userController.updateUserInfo);

export = routes;