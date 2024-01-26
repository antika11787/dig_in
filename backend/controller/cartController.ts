import { Request, Response } from "express";
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
        return res.status(400).send(failure("All fields are required"));
      }

      const existingItem = await itemModel.findOne({ _id: itemID });

      if (!existingItem) {
        return res.status(404).send(failure("Item not found"));
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

        const updatedCart = await cartModel.findById(existingCart._id);

        return res.status(200).send(success("Item added to cart", updatedCart));
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

      const updatedCart = await cartModel.findById(existingCart._id);

      return res.status(200).send(success("Item added to cart", updatedCart));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async getAllCarts(req: Request, res: Response): Promise<Response> {
    try {
      const carts = await cartModel.find();

      if (carts.length === 0) {
        return res.status(404).send(failure("No carts found"));
      }

      return res.status(200).send(success("Carts fetched successfully", carts));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async getMyCart(req: Request, res: Response): Promise<Response> {
    try {
      const customRequest = req as IAuthMiddleware;
      const cart = await cartModel.findOne({ userID: customRequest.user });

      if (!cart) {
        return res.status(404).send(failure("Cart not found"));
      }

      return res.status(200).send(success("Cart fetched successfully", cart));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async removeFromCart(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      console.log("itemID", id);
      const customRequest = req as IAuthMiddleware;

      if (!id) {
        return res.status(400).send(failure("Item ID is required"));
      }

      const cart = await cartModel.findOne({ userID: customRequest.user });

      if (!cart) {
        return res.status(404).send(failure("Cart not found"));
      }

      const existingCartItemIndex = cart.items.findIndex(
        (item: ICartItem) => item.itemID.toString() === id.toString()
      );

      if (existingCartItemIndex === -1) {
        return res.status(404).send(failure("Item not found in the cart"));
      }

      await cartModel.findOneAndUpdate(
        { _id: cart._id },
        {
          $pull: {
            items: {
              itemID: id,
            },
          },
        },
        {
          new: true,
        }
      );

      const updatedCart = await cartModel.findById(cart._id);

      if (!updatedCart.items.length) {
        await cartModel.findOneAndDelete({ _id: cart._id });
        return res
          .status(200)
          .send(success("Item removed from cart, and cart deleted"));
      }

      return res
        .status(200)
        .send(success("Item removed from cart", updatedCart));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async clearCart(req: Request, res: Response): Promise<Response> {
    try {
      const customRequest = req as IAuthMiddleware;

      const cart = await cartModel.findOne({ userID: customRequest.user });
      if (!cart) {
        return res.status(404).send(failure("Cart not found"));
      }

      await cartModel.findOneAndDelete({ _id: cart._id });

      return res.status(200).send(success("Cart cleared successfully"));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async increaseQuantity(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const customRequest = req as IAuthMiddleware;

      if (!id) {
        return res.status(400).send(failure("Item ID is required"));
      }

      const cart = await cartModel.findOne({ userID: customRequest.user });

      if (!cart) {
        return res.status(404).send(failure("Cart not found"));
      }

      const existingCartItemIndex = cart.items.findIndex(
        (item: ICartItem) => item.itemID.toString() === id.toString()
      );

      if (existingCartItemIndex === -1) {
        return res.status(404).send(failure("Item not found in the cart"));
      }

      await cartModel.findOneAndUpdate(
        { _id: cart._id },
        {
          $set: {
            [`items.${existingCartItemIndex}.quantity`]:
              cart.items[existingCartItemIndex].quantity + 1,
          },
        },
        {
          new: true,
        }
      );

      const updatedCart = await cartModel.findById(cart._id);

      return res
        .status(200)
        .send(success("Item quantity increased", updatedCart));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async decreaseQuantity(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const customRequest = req as IAuthMiddleware;

      if (!id) {
        return res.status(400).send(failure("Item ID is required"));
      }

      const cart = await cartModel.findOne({ userID: customRequest.user });

      if (!cart) {
        return res.status(404).send(failure("Cart not found"));
      }

      const existingCartItemIndex = cart.items.findIndex(
        (item: ICartItem) => item.itemID.toString() === id.toString()
      );

      if (existingCartItemIndex === -1) {
        return res.status(404).send(failure("Item not found in the cart"));
      }

      await cartModel.findOneAndUpdate(
        { _id: cart._id },
        {
          $set: {
            [`items.${existingCartItemIndex}.quantity`]:
              cart.items[existingCartItemIndex].quantity - 1,
          },
        },
        {
          new: true,
        }
      );

      const updatedCart = await cartModel.findById(cart._id);

      return res
        .status(200)
        .send(success("Item quantity increased", updatedCart));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }
}

export default new CartController();
