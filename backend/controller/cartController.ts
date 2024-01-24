import { Request, Response } from "express";
import mongoose from "mongoose";
import { IAuthMiddleware, ICartItem } from "../types/interfaces";

const { success, failure } = require("../utils/successError");
const cartModel = require("../model/cart");
const itemModel = require("../model/items");

class CartController {
  async addToCart(req: Request, res: Response): Promise<Response> {
    try {
      const { itemID, quantity } = req.body;
      const customRequest = req as IAuthMiddleware;

      if (!itemID || !quantity) {
        return res.status(400).send({ message: "All fields are required" });
      }

      const existingItem = await itemModel.findOne({ _id: itemID });

      if (!existingItem) {
        return res.status(404).send({ message: "Item not found" });
      }

      const existingCart = await cartModel.findOne({
        userID: customRequest.user,
      });

      if (!existingCart) {
        const cart = new cartModel({
          userID: customRequest.user,
          items: [
            {
              itemID,
              quantity,
            },
          ],
        });

        await cart.save();

        return res.status(200).send(success("Item added to cart", cart));
      }

      const existingCartItem = existingCart.items.find(
        (item: ICartItem) => item.itemID.toString() === itemID
      );

      console.log("existing item", existingCartItem);

      if (existingCartItem) {
        await cartModel.findOneAndUpdate(
          {
            _id: existingCart._id,
            "items.itemID": itemID,
          },
          {
            $inc: {
              "items.$.quantity": quantity,
            },
          }
        );

        // Retrieve the updated cart after the modification
        const updatedCart = await cartModel.findById(existingCart._id);

        return res
          .status(200)
          .send(success("Item added to cart", updatedCart));
      }

      await cartModel.findOneAndUpdate(
        { _id: existingCart._id },
        {
          $push: {
            items: {
              itemID,
              quantity,
            },
          },
        }
      );

      // Retrieve the updated cart after the modification
      const updatedCart = await cartModel.findById(existingCart._id);

      return res.status(200).send(success("Item added to cart", updatedCart));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }
}

export default new CartController();
