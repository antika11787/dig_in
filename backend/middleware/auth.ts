import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IAuthMiddleware } from "../types/interfaces";

const { failure } = require("../utils/successError");

const isUserLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(400).send(failure("Authorization failed!"));
    }
    const token = req.headers.authorization?.split(" ")[1] ?? "";

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (!decoded) {
      return res.status(400).send(failure("Authorization failed (login)!"));
    }

    const customRequest = req as IAuthMiddleware;
    customRequest.user = decoded;
    next();
  } catch (error) {
    console.log("error found", error);
    if (error instanceof JsonWebTokenError) {
      return res.status(500).send(failure("Token is invalid", error));
    }
    if (error instanceof TokenExpiredError) {
      return res.status(500).send(failure("Token is expired", error));
    }
    return res.status(500).send(failure("Internal server error"));
  }
};

const isUserAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(400).send(failure("Authorization failed!"));
    }
    const token = req.headers.authorization?.split(" ")[1] ?? "";
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (!decoded) {
      return res.status(400).send(failure("Authorization failed!"));
    }

    if (decoded.role !== "admin" && decoded.role !== "manager") {
      return res.status(400).send(failure("Authorization failed!"));
    }

    if (!decoded.isVerified) {
      return res.status(400).send(failure("User is not verified"));
    }

    const customRequest = req as IAuthMiddleware;
    customRequest.user = decoded;
    next();
  } catch (error) {
    console.log("error found", error);
    if (error instanceof JsonWebTokenError) {
      return res.status(500).send(failure("Token is invalid", error));
    }
    if (error instanceof TokenExpiredError) {
      return res.status(500).send(failure("Token is expired", error));
    }
    return res.status(500).send(failure("Internal server error"));
  }
};

const isUserAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(400).send(failure("Authorization failed!"));
    }
    const token = req.headers.authorization?.split(" ")[1] ?? "";
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (!decoded) {
      return res.status(400).send(failure("Authorization failed!"));
    }

    if (decoded.role !== "author" && decoded.role !== "admin" && decoded.role !== "manager") {
      return res.status(400).send(failure("Authorization failed!"));
    }

    if (!decoded.isVerified) {
      return res.status(400).send(failure("User is not verified"));
    }

    const customRequest = req as IAuthMiddleware;
    customRequest.user = decoded;
    next();
  } catch (error) {
    console.log("error found", error);
    if (error instanceof JsonWebTokenError) {
      return res.status(500).send(failure("Token is invalid", error));
    }
    if (error instanceof TokenExpiredError) {
      return res.status(500).send(failure("Token is expired", error));
    }
    return res.status(500).send(failure("Internal server error"));
  }
};

const isUserCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(400).send(failure("Authorization failed!"));
    }
    const token = req.headers.authorization?.split(" ")[1] ?? "";
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (!decoded) {
      return res.status(400).send(failure("Authorization failed!"));
    }

    if (decoded.role !== "customer") {
      return res.status(400).send(failure("Authorization failed!"));
    }

    if (!decoded.isVerified) {
      return res.status(400).send(failure("User is not verified"));
    }

    const customRequest = req as IAuthMiddleware;
    customRequest.user = decoded;
    next();
  } catch (error) {
    console.log("error found", error);
    if (error instanceof JsonWebTokenError) {
      return res.status(500).send(failure("Token is invalid", error));
    }
    if (error instanceof TokenExpiredError) {
      return res.status(500).send(failure("Token is expired", error));
    }
    return res.status(500).send(failure("Internal server error"));
  }
};

export { isUserLoggedIn, isUserAdmin, isUserAuthor, isUserCustomer };
