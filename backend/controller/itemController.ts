import fs from "fs";
import { Request, Response } from "express";
import { ItemResponse, updateItem, FilterType } from "../types/interfaces";
import { ParsedQs } from "qs";

const { success, failure } = require("../utils/successError");
const itemModel = require("../model/items");
const categoryModel = require("../model/category");
const { appConfig } = require("../config/constant");

// interface FilterType {
//   price?: { $gte?: number | undefined; $lte?: number | undefined } | undefined;
//   $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
// }

class ItemController {
  async createItem(req: Request, res: Response): Promise<Response> {
    try {
      const files = req.files as Express.Multer.File[];

      const { title, description, price, categoryID, banner } = req.body;
      console.log(files);

      if (!title || !description || !price || !categoryID) {
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

      const pathParts = files?.map((file: any) =>
        file.path.split(`\\`).pop()
      ) as string[];

      const item = new itemModel({
        title,
        description,
        price,
        categoryID,
        banner: pathParts[banner],
        files: pathParts,
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

      const pathParts = files?.map((file) => file.path.split(`\\`).pop());

      item.files = [...item.files, ...pathParts];

      await item.save();

      return res
        .status(200)
        .send(success("File uploaded successfully", item.files));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }
  async getAllItems(req: Request, res: Response): Promise<Response> {
    try {
      let { sortParam, priceMin, priceMax, search, category } = req.query;
      let page: string | string[] | ParsedQs | ParsedQs[] | undefined | number =
        req.query.page;
      let limit:
        | string
        | string[]
        | ParsedQs
        | ParsedQs[]
        | undefined
        | number = req.query.limit;

      let result = 0;
      const totalRecords = await itemModel.countDocuments({});

      if (!page || !limit) {
        page = 1;
        limit = 100;
      }

      // sorting
      if (
        sortParam &&
        sortParam !== "" &&
        sortParam !== "priceAsc" &&
        sortParam !== "updatedAtAsc" &&
        sortParam !== "updatedAtDesc" &&
        sortParam !== "priceDesc"
      ) {
        return res
          .status(400)
          .send(failure("Invalid sort parameters provided."));
      }

      // Filtering
      const filter: FilterType = {};

      if (priceMin && priceMax) {
        if (Number(priceMin) > Number(priceMax)) {
          return res
            .status(400)
            .send(
              failure("Minimum price cannot be greater than maximum price.")
            );
        }

        filter.price = {
          $gte: parseFloat(priceMin.toString()),
          $lte: parseFloat(priceMax.toString()),
        };
      }
      if (priceMin && !priceMax) {
        filter.price = { $gte: parseFloat(priceMin.toString()) };
      }
      if (!priceMin && priceMax) {
        filter.price = { $lte: parseFloat(priceMax.toString()) };
      }

      if (category) {
        filter.categoryID = { $in: category as string[] };
      }

      // search
      if (search) {
        filter["$or"] = [
          { title: { $regex: String(search), $options: "i" } },
          { description: { $regex: String(search), $options: "i" } },
          {
            "categoryID.categoryName": {
              $regex: String(search),
              $options: "i",
            },
          },
        ];
      }

      // Pagination
      result = await itemModel
        .find(filter)
        .sort(
          sortParam
            ? {
                priceAsc: { price: 1 },
                updatedAtAsc: { updatedAt: 1 },
                updatedAtDesc: { updatedAt: -1 },
                priceDesc: { price: -1 },
              }[String(sortParam)]
            : { _id: 1 }
        )
        .skip(((page as number) - 1) * (limit as number))
        .limit(limit)
        .select("-__v")
        .populate({
          path: "categoryID",
          select: "_id categoryName",
        });

      if (Array.isArray(result) && result.length > 0) {
        const paginationResult = {
          items: result,
          totalInCurrentPage: result.length,
          currentPage: parseInt(page.toString()),
          totalRecords: totalRecords,
        };
        return res
          .status(200)
          .send(success("Successfully received all items", paginationResult));
      }
      return res.status(400).send(failure("No item was found"));
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

      fs.unlink(`${appConfig.dirname}/${imagePath}`, async (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send(failure("Internal server error", err));
        }
      });

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
      const { title, description, price, categoryID, banner } = req.body;
      console.log("title", banner);

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

      let updateFields: updateItem = {
        title,
        description,
        price,
        banner: item.files[banner],
      };

      if (categoryID) {
        updateFields.categoryID = categoryID;
      }

      const updatedItem = await itemModel.findByIdAndUpdate(id, updateFields, {
        new: true,
      });

      return res
        .status(200)
        .send(success("Item updated successfully", updatedItem));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async removeImageFromItem(req: Request, res: Response): Promise<Response> {
    try {
      const { id, filename } = req.params;

      if (!id) {
        return res.status(400).send(failure("Item id is required"));
      }

      const item = await itemModel.findById(id);
      console.log("items", item.files);

      if (!item) {
        return res.status(404).send(failure("Item not found"));
      }

      if (item.files.length === 1) {
        return res
          .status(400)
          .send(failure("Item must have at least one image"));
      }

      const updatedFiles = item.files.filter(
        (file: string) => file !== filename
      );

      item.files = updatedFiles;

      fs.unlink(`${appConfig.dirname}/${filename}`, async (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send(failure("Internal server error", err));
        }
      });

      await item.save();

      return res.status(200).send(success("Image removed successfully", item));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async categoryItemCount(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send(failure("Category id is required"));
      }

      const item = await itemModel.find({ categoryID: id });

      if (!item) {
        return res.status(404).send(failure("Item not found"));
      }

      return res
        .status(200)
        .send(success("Item fetched successfully", item.length));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }
}

export default new ItemController();
