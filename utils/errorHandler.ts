import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

const handleSyntaxError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).send({ message: "Invalid JSON syntax!" });
  }
  next();
};

const handleJSONTokenError = (
    err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    if (err instanceof JsonWebTokenError) {
        return res.status(500).send({ message: "Token is invalid", error: err });
      }
      if (err instanceof TokenExpiredError) {
        return res.status(500).send({ message: "Token is expired", error: err });
      }
      next();
}

module.exports = { handleSyntaxError, handleJSONTokenError };
