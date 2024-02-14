import express from "express";
const dotenv = require("dotenv");
const authRouter = require("./authRoutes");
const categoryRouter = require("./categoryRoutes");
const itemRouter = require("./itemRoutes");
const userRouter = require("./userRoutes");
const cartRouter = require("./cartRoutes");
const blogRouter = require("./blogRoutes");

dotenv.config();

const app = express();

app.use("/auth", authRouter);
app.use("/category", categoryRouter);
app.use("/item", itemRouter);
app.use("/users", userRouter);
app.use("/cart", cartRouter);
app.use("/blog", blogRouter);
app.use("/user", userRouter);

export = app;
