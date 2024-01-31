import fs from "fs";
import { Request, Response } from "express";
import { ItemResponse, updateItem } from "../types/interfaces";

const { success, failure } = require("../utils/successError");
const itemModel = require("../model/items");
const categoryModel = require("../model/category");
// const fileTypes = require("../constants/fileTypes")
// const path = require('path')

class ItemController {
  async createItem(req: Request, res: Response): Promise<Response> {
    try {
      const banner = req.file as Express.Multer.File | undefined;
      const { title, description, price, categoryID } = req.body;

      if (!title || !description || !price || !categoryID || !banner) {
        return res.status(400).send(failure("All fields are required"));
      }

      const existingItem = await itemModel.findOne({ title });

      if (existingItem) {
        return res.status(400).send(failure("Item already exists"));
      }

      const existingCategory = await categoryModel.findOne({ _id: categoryID });

      if (!existingCategory) {
        return res.status(400).send(failure("Category does not exist"));
      }

      const pathParts = banner?.path.split(`\\`).pop();

      const item = new itemModel({
        title,
        description,
        price,
        categoryID,
        banner: pathParts,
      });

      await item.save();

      const responseItem: ItemResponse = {
        ...item.toObject(),
        __v: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };

      return res
        .status(200)
        .send(success("Item created successfully", responseItem));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async uploadItemImages(req: Request, res: Response): Promise<Response> {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      const { id } = req.params;

      console.log("files", files, id);

      if (!id) {
        return res.status(400).send(failure("Item id is required"));
      }

      if (!files || files.length === 0) {
        return res.status(400).send(failure("Files are required"));
      }

      const item = await itemModel.findById(id);

      if (!item) {
        return res.status(404).send(failure("Item not found"));
      }

      const filePaths = files.map((file) => file.path);

      const pathParts = files?.map((file) => file.path.split(`\\`).pop());

      item.files = [...item.files, ...pathParts];

      await item.save();

      return res.status(200).send(success("File uploaded successfully"));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async getAllItems(req: Request, res: Response): Promise<Response> {
    try {
      const items = await itemModel.find();

      if (items.length === 0) {
        return res.status(404).send(failure("No items found"));
      }

      return res.status(200).send(success("Items fetched successfully", items));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async getItemsByCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send(failure("Category id is required"));
      }

      const category = await categoryModel.findById(id);

      if (!category) {
        return res.status(404).send(failure("Category not found"));
      }

      const items = await itemModel.find({ categoryID: id });

      if (!items || items.length === 0) {
        return res
          .status(404)
          .send(failure("No items found in this category."));
      }

      return res.status(200).send(success("Items fetched successfully", items));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async getItemById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send(failure("Item id is required"));
      }

      const item = await itemModel.findById(id);

      if (!item) {
        return res.status(404).send(failure("Item not found"));
      }

      const responseItem: ItemResponse = {
        ...item.toObject(),
        __v: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };

      return res
        .status(200)
        .send(success("Item fetched successfully", responseItem));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async deleteItem(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send(failure("Item id is required"));
      }

      const item = await itemModel.findById(id);

      if (!item) {
        return res.status(404).send(failure("Item not found"));
      }

      const imagePath: string = item.banner;

      fs.unlink(imagePath, async (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send(failure("Internal server error", err));
        }
      });

      const itemImages: string[] = item.files;

      if (itemImages.length > 0) {
        for (const image of itemImages) {
          fs.unlink(image, async (err) => {
            if (err) {
              console.log(err);
              return res
                .status(500)
                .send(failure("Internal server error", err));
            }
          });
        }
      }

      await itemModel.findByIdAndDelete(id);

      return res.status(200).send(success("Item deleted successfully"));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async updateItem(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const banner = req.file as Express.Multer.File | undefined;
      const { title, description, price, categoryID } = req.body;

      if (!id) {
        return res.status(400).send(failure("Item id is required"));
      }

      const item = await itemModel.findById(id);

      if (!item) {
        return res.status(404).send(failure("Item not found"));
      }

      const existingTitle = await itemModel.findOne({ title });

      if (existingTitle && existingTitle._id.toString() !== id) {
        return res.status(400).send(failure("Title already exists"));
      }

      const imagePath: string = item.banner;

      if (banner) {
        fs.unlink(imagePath, async (err) => {
          if (err) {
            console.log(err);
            return res.status(500).send(failure("Internal server error", err));
          }
        });
      }

      const pathParts = banner?.path.split(`\\`).pop();

      const updateFields: updateItem = {
        title,
        description,
        price,
        banner: pathParts,
      };

      if (categoryID) {
        updateFields.categoryID = categoryID;
      }

      await itemModel.findByIdAndUpdate(id, updateFields);

      return res.status(200).send(success("Item updated successfully"));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }
}

export default new ItemController();
