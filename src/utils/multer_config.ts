import { Request } from "express"
import multer, { FileFilterCallback } from "multer"
import fs from "fs"

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void
  ) => {
    const folder = "./uploads/images/";
    const parentFolder = "./uploads/";
    if (!fs.existsSync(parentFolder)) {
      fs.mkdirSync(parentFolder);
    }
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
    callback(null, folder);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  if (file.mimetype.startsWith("")) {
    callback(null, true)
  } else {
    callback(new Error("Not an image! Please upload an image."))
  }
}

const multerConfig = {
  config: {
    storage,
    limits: { fileSize: 1024 * 1024 * 100 }, 
    fileFilter,
  },
  keyUpload: "photo",
}

export default multerConfig
