import { Request, Response, NextFunction } from "express";
import {
  IAuthMiddleware,
  ICartItem,
  ItemQuantity,
  ItemResponse,
  IPayment,
} from "../types/interfaces";

const { appConfig } = require("../config/constant");
const stripe = require("stripe")(appConfig.stripeSecretKey);
const { success, failure } = require("../utils/successError");
const cartModel = require("../model/cart");
const itemModel = require("../model/items");
const orderModel = require("../model/order");
const { validationResult } = require("express-validator");

class CartController {
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

  async addToCart(req: Request, res: Response): Promise<Response> {
    try {
      const { itemID, quantity } = req.body;
      const customRequest = req as IAuthMiddleware;

      if (!itemID) {
        return res.status(400).send(failure("All fields are required"));
      }

      const existingItem = await itemModel.findOne({ _id: itemID });

      if (!existingItem) {
        return res.status(404).send(failure("Item not found"));
      }

      const cost = existingItem.price * quantity;

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
              cost,
            },
          ],
          totalAmount: cost, // Set totalAmount when creating new cart
        });

        await cart.save();

        return res.status(200).send(success("Item added to cart", cart));
      }

      const existingCartItem = existingCart.items.find(
        (item: ICartItem) => item.itemID.toString() === itemID
      );

      let updatedCart;

      if (existingCartItem) {
        if (existingCartItem.quantity + quantity > 50) {
          return res
            .status(400)
            .send(failure("Quantity cannot be greater than 50."));
        }
        await cartModel.findOneAndUpdate(
          {
            _id: existingCart._id,
            "items.itemID": itemID,
          },
          {
            $inc: {
              "items.$.quantity": quantity,
              "items.$.cost": cost,
            },
          }
        );

        updatedCart = await cartModel.findById(existingCart._id);
      } else {
        await cartModel.findOneAndUpdate(
          { _id: existingCart._id },
          {
            $push: {
              items: {
                itemID,
                quantity,
                cost,
              },
            },
          }
        );

        updatedCart = await cartModel.findById(existingCart._id);
      }

      // Calculate totalAmount
      updatedCart.totalAmount = updatedCart.items.reduce(
        (total: number, item: ICartItem) => total + (item.cost ?? 0),
        0
      );

      // Save the updated cart
      await updatedCart.save();

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
      const cart = await cartModel
        .findOne({ userID: customRequest.user })
        .populate({
          path: "items.itemID",
          model: "Item",
          select: "banner title price",
        });

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

  async updateQuantity(req: Request, res: Response): Promise<Response> {
    try {
      const { itemID, quantity } = req.body;
      const customRequest = req as IAuthMiddleware;

      const existingItem = await itemModel.findOne({ _id: itemID });
      if (!existingItem) {
        return res.status(404).send(failure("Item not found"));
      }

      const existingCart = await cartModel.findOneAndUpdate(
        { userID: customRequest.user },
        {
          $set: {
            "items.$[elem].quantity": quantity,
            "items.$[elem].cost": quantity * existingItem.price,
          },
        },
        {
          arrayFilters: [{ "elem.itemID": itemID }],
          returnOriginal: false,
        }
      );

      if (!existingCart) {
        return res.status(400).send(failure("Cart not found"));
      }

      existingCart.totalAmount = existingCart.items.reduce(
        (total: number, item: ItemQuantity) =>
          total + item.quantity * existingItem.price,
        0
      );

      await existingCart.save();

      return res
        .status(200)
        .send(success("Quantity updated successfully", existingCart));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async checkout(req: Request, res: Response): Promise<Response> {
    try {
      const { house, street, area } = req.body;
      const customRequest = req as IAuthMiddleware;

      if (!house || !street || !area) {
        return res.status(400).send(failure("Address is required"));
      }

      const cart = await cartModel
        .findOne({ userID: customRequest.user })
        .populate({
          path: "items.itemID",
          model: "Item",
        });

      if (!cart) {
        return res.status(404).send(failure("Cart not found"));
      }

      const estimatedCost = cart.items.reduce(
        (acc: number, item: ICartItem) => acc + (item.cost ? item.cost : 0),
        0
      );

      const order = new orderModel({
        userID: customRequest.user,
        items: cart.items,
        house,
        street,
        area,
        totalAmount: estimatedCost,
      });

      const lineItems = cart.items.map((item: IPayment) => ({
        price_data: {
          currency: "bdt",
          product_data: {
            name: item.itemID.title,
            images: [item.itemID.banner],
          },
          unit_amount: item.cost * 100,
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${appConfig.frontendUrl}/paymentSuccess/${order._id}`,
        cancel_url: `${appConfig.frontendUrl}/paymentFail/${order._id}`,
      });

      await order.save();

      return res
        .status(200)
        .send(success("Order placed successfully", session.url));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async paymentSuccess(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const customRequest = req as IAuthMiddleware;

      const order = await orderModel.findById(id);
      // const cart = await cartModel.findOne({ userID: customRequest.user });

      // console.log("order", order);

      if (!order) {
        return res.status(404).send(failure("Order not found"));
      }

      await cartModel.findOneAndDelete({ userID: customRequest.user });

      return res.redirect(`${appConfig.frontendUrl}/paymentSuccess/${order._id}`);
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async paymentFail(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const order = await orderModel.findOne({ id });

      if (!order) {
        return res.status(404).send(failure("Order not found"));
      }

      await orderModel.findOneAndDelete({ _id: order._id });

      return res.redirect(`${appConfig.frontendUrl}/paymentFail/${order._id}`);
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }

  async changeStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const customRequest = req as IAuthMiddleware;
      const order = await orderModel.findOne({ _id: id });

      if (!order) {
        return res.status(404).send(failure("Order not found"));
      }

      if (!status) {
        return res.status(400).send(failure("Status is required"));
      }

      order.status = status;
      await order.save();

      return res
        .status(200)
        .send(success("Order status updated successfully", order));
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error", error));
    }
  }
}

export default new CartController();
