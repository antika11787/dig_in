import fs from "fs";
import { Request, Response } from "express";
import { CategoryResponse } from "../types/interfaces";

const { success, failure } = require("../utils/successError");
const categoryModel = require("../model/category");
const itemModel = require("../model/items");
const { appConfig } = require("../config/constant");

class CategoryController {
  async createCategory(req: Request, res: Response): Promise<Response> {
    try {
      const file = req.file as Express.Multer.File | undefined;
      const { categoryName } = req.body;

      if (!categoryName || !file) {
        return res.status(400).send({ message: "All fields are required" });
      }

      const existingCategory = await categoryModel.findOne({ categoryName });

      if (existingCategory) {
        return res.status(400).send({ message: "Category already exists" });
      }

      console.log("pathhhhh", file?.path);

      const pathParts = file?.path.split(`\\`).pop();

      const category = new categoryModel({
        categoryName,
        file: pathParts,
      });

      await category.save();

      const responseCategory: CategoryResponse = {
        ...category.toObject(),
        __v: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };

      return res
        .status(200)
        .send(success("Category created successfully", responseCategory));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async getAllCategories(req: Request, res: Response): Promise<Response> {
    try {
      const categories = await categoryModel.find();

      if (categories.length === 0) {
        return res.status(404).send({ message: "No categories found" });
      }

      return res
        .status(200)
        .send(success("Categories fetched successfully", categories));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async getCategoryById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send({ message: "Category id is required" });
      }

      const category = await categoryModel.findById(id);

      if (!category) {
        return res.status(404).send({ message: "Category not found" });
      }

      const responseCategory: CategoryResponse = {
        ...category.toObject(),
        __v: undefined,
      };

      return res
        .status(200)
        .send(success("Category fetched successfully", responseCategory));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send({ message: "Category id is required" });
      }

      const category = await categoryModel.findById(id);

      if (!category) {
        return res.status(404).send({ message: "Category not found" });
      }

      const imagePath: string = category.file;

      fs.unlink(`${appConfig.dirname}/${imagePath}`, async (err) => {
        if (err) {
          console.error("Error deleting image:", err);
          return res.status(500).send("Internal Server Error");
        }
      });

      await itemModel.deleteMany({ categoryID: id });
      const response = await categoryModel.findByIdAndDelete(id);

      return res
        .status(200)
        .send(success("Category deleted successfully", response));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async updateCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const file = req.file as Express.Multer.File | undefined;
      const updatedCategoryName = req.body.categoryName;

      if (!id) {
        return res.status(400).send({ message: "Category id is required" });
      }

      const category = await categoryModel.findById(id);

      if (!category) {
        return res.status(404).send({ message: "Category not found" });
      }

      const existingCategory = await categoryModel.findOne({
        categoryName: updatedCategoryName,
      });

      if (existingCategory && existingCategory._id.toString() !== id) {
        return res.status(400).send({ message: "Category already exists" });
      }

      const imagePath: string = category.file;

      if (file) {
        fs.unlink(`${appConfig.dirname}/${imagePath}`, async (err) => {
          if (err) {
            console.error("Error deleting image:", err);
            return res.status(500).send("Internal Server Error");
          }
        });
      }

      const pathParts = file?.path.split(`\\`).pop();

      const updatedCategory = await categoryModel.findByIdAndUpdate(
        id,
        {
          categoryName: req.body.categoryName,
          file: pathParts,
        },
        { new: true }
      );

      return res
        .status(200)
        .send(success("Category updated successfully", updatedCategory));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }
}

export default new CategoryController();
