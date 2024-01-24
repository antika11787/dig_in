import express, { Router } from "express";
import cartController from "../controller/cartController";
import upload from "../config/handleImage";
import { isUserLoggedIn, isUserAdmin, isUserCustomer } from "../middleware/auth";

const routes: Router = express.Router();

routes.post("/add-to-cart", isUserLoggedIn, cartController.addToCart);

export = routes;