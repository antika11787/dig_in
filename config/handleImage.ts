import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";
import { Multer } from "multer";
import { CustomRequest } from "../types/interfaces";

const fileTypes: string[] = [".png", ".jpg", ".jpeg", ".gif", ".avif", ".webp"];

const upload: Multer = multer({
  limits: {
    fileSize: 2000000 * 5,
  },

  storage: multer.diskStorage({
    destination: function (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, destination: string) => void
    ) {
      callback(null, path.join(__dirname, "/uploads"));
    },
    filename: function (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void
    ) {
      callback(null, Date.now() + path.extname(file.originalname));
    },
  }),

  fileFilter: function (
    req: CustomRequest,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) {
    if (file) {
      const extension = path.extname(file.originalname);
      req.file_extension = extension;

      if (fileTypes.includes(extension)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    } else {
      callback(null, false);
    }
  },
});

export default upload;
