import { Request } from "express"
import multer, { FileFilterCallback } from "multer"
import fs from "fs"



const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      callback(null, true); 
    } else {
      callback(new Error("Unsupported image format"));
    }
  } else {
    callback(new Error("Not an image! Please upload an image."));
  }
};


const multerConfig = {
  config: {
    limits: { fileSize: 1024 * 1024 * 100 }, 
    fileFilter,
  },
  keyUpload: "photo",
}

export default multerConfig
