import { Request, Response } from "express";

const { success, failure } = require("../utils/successError");
const categoryModel = require("../model/category");

class CategoryController {
  async createCategory(req: Request, res: Response): Promise<Response> {
    try {
      const file = req.file && "file" in req.file ? req.file.file : undefined;
      const { categoryName } = req.body;

      if (!categoryName || !file) {
        return res.status(400).send({ message: "All fields are required" });
      }

      const existingCategory = await categoryModel.findOne({ categoryName });

      if (existingCategory) {
        return res.status(400).send({ message: "Category already exists" });
      }

      const category = new categoryModel({
        categoryName,
        // image: file.path,
      });

      await category.save();

      return res.status(200).send(success("Category created successfully"));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }
}

export default new CategoryController();
