import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import path from "path";
import jwt from "jsonwebtoken";
import { AuthResponse } from "../types/interfaces";

const { promisify } = require("util");
const ejs = require("ejs");
const ejsRenderFile = promisify(ejs.renderFile);
const { sendMail } = require("../config/sendMail");
const { appConfig } = require("../config/constant");

const authModel = require("../model/auth");
const userModel = require("../model/user");
const { success, failure } = require("../utils/successError");
const { validationResult } = require("express-validator");

class AuthController {
  async createValidation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res
          .status(400)
          .send({ message: "Validation error", validation });
      }
      next();
    } catch (error) {
      console.log("Error has occurred", error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async signup(req: Request, res: Response): Promise<Response> {
    try {
      const { username, email, role, password, address } = req.body;

      if (!username || !email || !password || !address) {
        return res.status(400).send({ message: "All fields are required" });
      }

      const existingUser = await authModel.findOne({ email });

      if (existingUser) {
        return res.status(400).send({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userModel.create({
        username,
        email,
        role,
        address,
      });
      await user.save();

      const auth = new authModel({
        username,
        email,
        role,
        isAuthorVerified: false,
        address,
        password: hashedPassword,
        userID: user._id,
      });
      await auth.save();

      if (role === "admin" || role === "manager") {
        auth.isAuthorVerified = true;
        await auth.save();
      }

      const token = crypto.randomBytes(32).toString("hex");
      auth.emailVerificationToken = token;
      auth.emailVerificationTokenExpired = new Date(Date.now() + 9 * 60 * 1000);

      await auth.save();

      const emailVerificationURL = `${
        appConfig.backendUrl
      }/auth/verify-email/${auth._id.toString()}/${token}`;

      const htmlBody = await ejsRenderFile(
        path.join(__dirname, "../views/emailVerification.ejs"),
        {
          name: auth.username,
          emailVerificationURL: emailVerificationURL,
        }
      );

      const emailResult = await sendMail(email, "Email Verification", htmlBody);

      if (emailResult) {
        const responseAuth: AuthResponse = {
          ...auth.toObject(),
          password: undefined,
          __v: undefined,
          createdAt: undefined,
          updatedAt: undefined,
        };

        return res
          .status(200)
          .send(
            success(
              "Sign up successful. Please verify your email.",
              responseAuth
            )
          );
      } else {
        return res.status(400).send(failure("Failed to send the email"));
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { userID, token } = req.params;

      const user = await authModel.findOne({ _id: userID });

      if (!user) {
        return res.status(400).send({ message: "User does not exist" });
      }

      if (user.isVerified) {
        return res.status(400).send({ message: "User is already verified" });
      }

      if (user.emailVerificationToken !== token) {
        return res.status(400).send({ message: "Invalid verification token" });
      }

      if (user.emailVerificationTokenExpired < new Date()) {
        return res
          .status(400)
          .send(
            failure(
              "Verification token has expired. Resend?",
              null,
              "/resend-verification-email"
            )
          );
      }

      user.isVerified = true;
      user.emailVerificationToken = null;
      user.emailVerificationTokenExpired = null;

      await user.save();

      return res
        .status(200)
        .send(success("Congratulations! You are now a verifired user."));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async sendForgotPasswordEmail(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { recipient } = req.body;
      if (!recipient || recipient === "") {
        return res.status(400).send(failure("invalid request"));
      }

      const auth = await authModel.findOne({ email: recipient });
      if (!auth) {
        return res.status(400).send(failure("invalid request"));
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      auth.resetPasswordToken = resetToken;
      auth.resetPasswordExpired = new Date(Date.now() + 60 * 60 * 1000);

      await auth.save();

      const resetPasswordURL = `${
        appConfig.backendUrl
      }/auth/reset-password/${auth._id.toString()}/${resetToken}`;

      const htmlBody = await ejsRenderFile(
        path.join(__dirname, "../views/forgotPassword.ejs"),
        {
          name: auth.username,
          resetPasswordURL: resetPasswordURL,
        }
      );
      console.log("htmlBody", htmlBody);

      const emailResult = await sendMail(recipient, "Reset Password", htmlBody);

      if (emailResult) {
        return res
          .status(200)
          .send(success("Reset password link sent to your email"));
      }
      return res.status(400).send(failure("Something went wrong"));
    } catch (error) {
      console.log("error found", error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { token, userId } = req.params;

      const auth = await authModel.findOne({
        _id: userId,
        resetPasswordToken: token,
        resetPasswordExpired: { $gt: new Date() },
      });
      if (!auth) {
        return res.status(400).send(failure("invalid request"));
      }

      const { newPassword, confirmPassword } = req.body;
      if (!newPassword || !confirmPassword) {
        return res.status(400).send(failure("Please enter all the fields"));
      }

      const passwordMatch = await bcrypt.compare(newPassword, auth.password);

      if (passwordMatch) {
        return res
          .status(400)
          .send(failure("You are setting up an old password"));
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).send(failure("Passwords do not match"));
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10).then((hash) => {
        return hash;
      });

      auth.password = hashedPassword;
      auth.resetPasswordToken = null;
      auth.resetPasswordExpired = null;

      await auth.save();

      return res.status(200).send(success("Password reset successful"));
    } catch (error) {
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async validatePasswordResetRequest(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { token, userId } = req.params;

      const auth = await authModel.findOne({ _id: userId });
      if (!auth) {
        return res.status(400).send(failure("Invalid request"));
      }

      if (auth.resetPasswordExpired < Date.now()) {
        return res.status(400).send(failure("Expired request"));
      }

      if (auth.resetPasswordToken !== token || auth.resetPassword === false) {
        return res.status(400).send(failure("Invalid token"));
      }
      return res.status(200).send(success("Request is still valid"));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error"));
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const auth = await authModel.findOne({ email });

      if (!auth) {
        return res.status(400).send({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, auth.password);
      if (!isMatch) {
        return res.status(400).send({ message: "Invalid credentials" });
      }

      const responseAuth: AuthResponse = {
        ...auth.toObject(),
        password: undefined,
        __v: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        emailVerificationToken: undefined,
        emailVerificationTokenExpired: undefined,
        resetPassword: undefined,
        resetPasswordToken: undefined,
        resetPasswordExpired: undefined,
      };

      const generatedToken = jwt.sign(responseAuth, appConfig.jwtSecret!, {
        expiresIn: "30d",
      });

      responseAuth.token = generatedToken;

      return res.status(200).send(success("Login successful", responseAuth));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }
}

export default new AuthController();
