import express, { Router } from "express";
import userController from "../controller/userController";
import upload from "../config/handleImage";
import {
  isUserLoggedIn,
  isUserAdmin,
  isUserCustomer,
} from "../middleware/auth";

const routes: Router = express.Router();

routes.get(
  "/get-all-users",
  isUserLoggedIn,
  isUserAdmin,
  userController.getAllUsers
);
routes.get("/get-my-profile", isUserLoggedIn, userController.getMyProfile);
routes.get("/get-user-by-id/:id", userController.getUserById);
routes.patch(
  "/update-user/:id",
  isUserLoggedIn,
  isUserAdmin,
  userController.updateUserInfo
);
routes.delete(
  "/delete-user/:id",
  isUserLoggedIn,
  isUserAdmin,
  userController.deleteUser
);
routes.patch(
  "/verify-author/:id",
  isUserLoggedIn,
  isUserAdmin,
  userController.verifyAuthor
);

export = routes;
