import { Request, Response } from "express";

const { success, failure } = require("../utils/successError");
const userModel = require("../model/user");
const authModel = require("../model/auth");

class UserController {
  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await userModel.find();

      if (users.length === 0) {
        return res.status(404).send({ message: "No users found" });
      }

      return res.status(200).send(success("Users fetched successfully", users));
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

      const user = await authModel.findById(id);

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const existingUser = await userModel.findOne({ email });

      if (existingUser && existingUser._id.toString() !== id) {
        return res
          .status(400)
          .send({ message: "User email address already exists" });
      }

      const updatedUser = await authModel.findByIdAndUpdate(
        id,
        {
          username,
          email,
          address,
          role,
        },
        { new: true }
      );

      await userModel.findOneAndUpdate(
        { _id: updatedUser.userID },
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
}

export default new UserController();
