import { Request, Response } from "express";
import { IAuthMiddleware } from "../types/interfaces";

const { success, failure } = require("../utils/successError");
const userModel = require("../model/user");
const authModel = require("../model/auth");
const orderModel = require("../model/order");
const blogModel = require("../model/blog");

class UserController {
  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await authModel
        .find()
        .select("_id username email address role createdAt updatedAt");

      if (users.length === 0) {
        return res.status(404).send({ message: "No users found" });
      }

      return res.status(200).send(success("Users fetched successfully", users));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async getMyProfile(req: Request, res: Response): Promise<Response> {
    try {
      const customRequest = req as IAuthMiddleware;

      const user = await authModel
        .findById(customRequest.user)
        .select("_id username email address role createdAt updatedAt");

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      return res.status(200).send(success("User fetched successfully", user));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send({ message: "User id is required" });
      }

      const user = await authModel
        .findById(id)
        .select("_id username email address role createdAt updatedAt");

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      return res.status(200).send(success("User fetched successfully", user));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async updateUserInfo(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { username, email, address, role } = req.body;

      if (!id) {
        return res.status(400).send({ message: "User id is required" });
      }

      const user = await authModel
        .findById(id)
        .select("_id username email role address createdAt updatedAt");

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const existingUser = await userModel.findOne({ username });

      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).send({ message: "Username already exists" });
      }

      const updatedUser = await authModel
        .findByIdAndUpdate(
          id,
          {
            username,
            email,
            address,
            role,
          },
          { new: true }
        )
        .select("_id username email address role userID createdAt updatedAt");

      console.log(updatedUser);

      await userModel.findByIdAndUpdate(
        updatedUser.userID,
        {
          username,
          email,
          address,
          role,
        },
        { new: true }
      );

      return res
        .status(200)
        .send(success("User updated successfully", updatedUser));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send({ message: "User id is required" });
      }

      const user = await authModel.findById(id);

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const existingUser = await userModel.findOne({ _id: user.userID });

      if (!existingUser) {
        return res.status(400).send({ message: "Cannot delete user" });
      }

      if (existingUser.role === "admin") {
        return res.status(400).send({ message: "Cannot delete admin user" });
      }

      if (existingUser.role === "customer") {
        const orders = await orderModel.find({ userID: user.userID });

        if (orders) {
          await orderModel.deleteMany({ userID: user.userID });
        }
      }

      if (existingUser.role === "author") {
        const blogs = await blogModel.find({ author: user.userID });

        if (blogs) {
          await orderModel.deleteMany({ userID: user.userID });
        }
      }

      const deletedUser = await authModel
        .findByIdAndDelete(id)
        .select("_id username email address role createdAt updatedAt");
      await userModel.findByIdAndDelete(user.userID);

      return res
        .status(200)
        .send(success("User deleted successfully", deletedUser));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }
}

export default new UserController();
