import multer, { Multer, FileFilterCallback } from "multer";
import { Request } from "express";

const upload: Multer = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req: Request, file: Express.Multer.File, callback: FileFilterCallback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return callback(null, false);
    }
    callback(null, true);
  },
});

export { upload };
