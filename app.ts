import express from "express";
const cors = require("cors");
const dotenv = require("dotenv");
const indexRouter = require("./routes/indexRoutes");
const { handleSyntaxError } = require("./utils/errorHandler");
const databaseConnection = require("./config/database");
dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("/opt/render/project/src/uploads"));
app.use(handleSyntaxError);
app.use("/api/v1/", indexRouter);

app.route("*").all((req, res) => {
  res.status(400).send("Invalid route!");
});

databaseConnection(() => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000...");
  });
});
