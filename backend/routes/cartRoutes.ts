import express, { Router } from "express";
import cartController from "../controller/cartController";
import {
  isUserLoggedIn,
  isUserAdmin,
  isUserCustomer,
} from "../middleware/auth";
import { cartValidators } from "../middleware/validation";

const routes: Router = express.Router();

routes.post(
  "/add-to-cart",
  isUserLoggedIn,
  isUserCustomer,
  cartValidators.addToCart,
  cartController.createValidation,
  cartController.addToCart
);
routes.get(
  "/get-all-carts",
  isUserLoggedIn,
  isUserAdmin,
  cartController.getAllCarts
);
routes.get("/get-my-cart", isUserLoggedIn, cartController.getMyCart);
routes.delete(
  "/remove-from-cart/:id",
  isUserLoggedIn,
  isUserCustomer,
  cartController.removeFromCart
);
routes.delete("/clear-cart", isUserLoggedIn, cartController.clearCart);
routes.patch(
  "/update-quantity",
  isUserLoggedIn,
  cartValidators.addToCart,
  cartController.createValidation,
  cartController.updateQuantity
);
routes.post("/checkout", isUserLoggedIn, cartController.checkout);
routes.get("/payment-success/:id", cartController.paymentSuccess);
routes.get("/payment-failed/:id", cartController.paymentFail);
routes.get(
  "/get-all-orders",
  isUserLoggedIn,
  isUserAdmin,
  cartController.getAllOrders
);
routes.get("/get-my-orders", isUserLoggedIn, cartController.getMyOrders);
routes.get("/get-order-by-id/:id", cartController.getOrderById);
routes.post(
  "/set-status/:id",
  isUserLoggedIn,
  isUserAdmin,
  cartController.changeStatus
);

export = routes;
