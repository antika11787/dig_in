import express, { Router } from "express";
import AuthController from "../controller/authController";
import { authValidators } from "../middleware/validation";

const routes: Router = express.Router();

routes.post(
  "/signup",
  authValidators.signup,
  AuthController.createValidation,
  AuthController.signup
);
routes.get("/verify-email/:userID/:token", AuthController.verifyEmail);
routes.post("/forgot-password", AuthController.sendForgotPasswordEmail);
routes.post("/reset-password/:userId/:token", AuthController.resetPassword);
routes.get("/validate-reset-request/:userId/:token", AuthController.validatePasswordResetRequest);
routes.post("/login", AuthController.login);

export = routes;
