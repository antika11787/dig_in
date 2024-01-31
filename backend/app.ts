import express, { Request, Response, NextFunction } from "express";
const cors = require("cors");
const dotenv = require("dotenv");
const authRouter = require("../backend/routes/authRoutes");
const categoryRouter = require("../backend/routes/categoryRoutes");
const itemRouter = require("../backend/routes/itemRoutes");
const userRouter = require("../backend/routes/userRoutes");
const cartRouter = require("../backend/routes/cartRoutes");
const blogRouter = require("../backend/routes/blogRoutes");

const databaseConnection = require("./config/database");

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).send({ message: "Invalid JSON syntax!" });
  }
  next();
});

app.use("/auth", authRouter);
app.use("/category", categoryRouter);
app.use("/item", itemRouter);
app.use("/users", userRouter);
app.use("/cart", cartRouter);
app.use("/blog", blogRouter);

app
  .route("*")
  .get((req, res) => {
    res.status(400).send("Invalid route!");
  })
  .put((req, res) => {
    res.status(400).send("Invalid route!");
  })
  .post((req, res) => {
    res.status(400).send("Invalid route!");
  })
  .delete((req, res) => {
    res.status(400).send("Invalid route!");
  });

databaseConnection(() => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000...");
  });
});
