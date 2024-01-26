import express, { Router } from "express";
import cartController from "../controller/cartController";
import {
  isUserLoggedIn,
  isUserAdmin,
  isUserCustomer,
} from "../middleware/auth";

const routes: Router = express.Router();

routes.post("/add-to-cart", isUserLoggedIn, cartController.addToCart);
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

export = routes;
