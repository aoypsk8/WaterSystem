import { Request, Response } from "express";
import connectMongoDB from "../utils/db";
import multerConfig from "../utils/multer_config";
import multer from "multer";
import { ObjectId } from "mongodb";

interface CategoryInput {
  cateName: string;
}
const upload = multer(multerConfig.config).array(multerConfig.keyUpload);
export async function insertCategory(req: Request, res: Response) {
  try {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ message: err });
      } else if (err) {
        return res.status(500).json({ message: err });
      }
      try {

        const db = await connectMongoDB();
        const categoryCollection = db.collection("category");
        const images = Array.isArray(req.files) ? req.files.map(file => file.buffer) : [];
       
        

        const { cateName }: CategoryInput = req.body;
        const newCate = {
          cateName,
          images
        };
        await categoryCollection.insertOne(newCate);

        return res.status(201).json({
          message: "Category created successfully",
          status: "ok",
          category: newCate,
        });
      } catch (error) {
        console.log(`Internal Server Error: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getAllCategory(req: Request, res: Response) {
  try {
    const db = await connectMongoDB();
    const categoryCollection = db.collection("category");
    const category = await categoryCollection.find({}).toArray();

    if (category.length > 0) {
      return res.status(200).json({
        message: "category fetched successfully",
        status: "ok",
        categorys: category,
      });
    } else {
      return res.status(404).json({ error: "category not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getOneCategory(req: Request, res: Response) {
  try {
    const db = await connectMongoDB();
    const categoryCollection = db.collection("category");
    const category = await categoryCollection.findOne({
      _id: new ObjectId(req.params.CateID),
    });
    if (category != null) {
      return res.status(200).json({
        message: "category fetched successfully",
        status: "ok",
        category: category,
      });
    } else {
      return res.status(404).json({ error: "category not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const db = await connectMongoDB();
    const categoryCollection = db.collection("category");
    const category = await categoryCollection.findOneAndDelete({
      _id: new ObjectId(req.params.CateID),
    });

    if (category != null) {
      return res.status(200).json({
        message: "delete category successfully",
        status: "ok",
        category: category,
      });
    } else {
      return res.status(404).json({ error: "category not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ message: err });
        } else if (err) {
            return res.status(500).json({ message: err });
        }
        try {
            const imageList: string[] = [];

            const db = await connectMongoDB();
            const categoryCollection = db.collection("category");
            var { cateName}: CategoryInput = req.body;
            const category = await categoryCollection.findOne({ _id: new ObjectId(req.params.CateID) });

            if (category && category['images']) {
                const images = category['images'];
                images.forEach((image: string) => {
                    imageList.push(image);
                });
            }
            const images = Array.isArray(req.files) ? req.files.map(file => file.buffer) : imageList;

            cateName = cateName ?? category!['cateName'];

            const updateOperation = {
                $set: {
                  cateName,
                  images
                }
            };
            const updatedCategory = await categoryCollection.findOneAndUpdate(
                { _id: new ObjectId(req.params.CateID) },
                updateOperation,
            );
            if (updatedCategory) {
                return res.status(200).json({
                    message: "Category updated successfully",
                    status: "ok",
                    Category: updatedCategory
                });
            } else {
                return res.status(404).json({ error: "Category not found" });
            }


        } catch (error) {
            console.log(`Internal Server Error: ${error}`);
            return res.status(500).json({ error: "Internal Server Error" });
        }

    });
} catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
}
}
