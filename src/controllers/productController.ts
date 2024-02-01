import { Request, Response } from "express";
import connectMongoDB from "../utils/db";
import multerConfig from "../utils/multer_config";
import multer from 'multer';
import { ObjectId } from "mongodb";

interface ProductInput {
    productName: string;
    description: string;
    price: string;
    stock: string;
    creation: Date;
    image: string[];
    category: ObjectId;
    location: string;

}

const upload = multer(multerConfig.config).array(multerConfig.keyUpload);
export async function insertProduct(req: Request, res: Response) {
    try {
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ message: err });
            } else if (err) {
                return res.status(500).json({ message: err });
            }
            try {
                const db = await connectMongoDB();
                const productsCollection = db.collection("products");
                const creation: Date = new Date();

                const { productName, description, price, stock ,category,location}: ProductInput = req.body;
                const images = Array.isArray(req.files) ? req.files.map(file => file.buffer) : [];

                const newProduct = {
                    productName,
                    description,
                    price,
                    stock,
                    creation,
                    images,
                    category,
                    location
                };
                await productsCollection.insertOne(newProduct);

                return res.status(201).json({
                    message: "Product created successfully",
                    status: "ok",
                    product: newProduct
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


export async function getAllProducs(req: Request, res: Response) {
    try {
        const db = await connectMongoDB();
        const productsCollection = db.collection("products");
        const products = await productsCollection.find({}).toArray();
        console.log(products);


        if (products.length > 0) {
            return res.status(200).json({
                message: "Products fetched successfully",
                status: "ok",
                products: products
            });
        } else {
            return res.json({ error: "Products not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getOneProducs(req: Request, res: Response) {
    try {
        const db = await connectMongoDB();
        const productsCollection = db.collection("products");
        const product = await productsCollection.findOne({ _id: new ObjectId(req.params.ProductId) });
        if (product != null) {
            return res.status(200).json({
                message: "Product fetched successfully",
                status: "ok",
                product: product
            });
        } else {
            return res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function deleteProducs(req: Request, res: Response) {
    try {
        const db = await connectMongoDB();
        const productsCollection = db.collection("products");
        const product = await productsCollection.findOneAndDelete({ _id: new ObjectId(req.params.ProductId) });

        if (product != null) {
            return res.status(200).json({
                message: "delete product successfully",
                status: "ok",
                product: product
            });
        } else {
            return res.status(404).json({ error: "Product not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function updateProduct(req: Request, res: Response) {
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
                const productsCollection = db.collection("products");
                var { productName, description, price, stock ,category,location}: ProductInput = req.body;
                const product = await productsCollection.findOne({ _id: new ObjectId(req.params.ProductId) });

                if (product && product['images']) {
                    const images = product['images'];
                    images.forEach((image: string) => {
                        imageList.push(image);
                    });
                }
                const images = Array.isArray(req.files) ? req.files.map(file => file.buffer) : imageList;

                productName = productName ?? product!['productName'];
                description = description ?? product!['description'];
                price = price ?? product!['price'];
                stock = stock ?? product!['stock'];
                category = category ?? product!['category'];
                location = location ?? product!['location'];

                const updateOperation = {
                    $set: {
                        productName,
                        description,
                        price,
                        stock,
                        images,
                        category,
                        location
                    }
                };

                const updatedProduct = await productsCollection.findOneAndUpdate(
                    { _id: new ObjectId(req.params.ProductId) },
                    updateOperation,
                );
                if (updatedProduct) {
                    return res.status(200).json({
                        message: "Product updated successfully",
                        status: "ok",
                        product: updatedProduct
                    });
                } else {
                    return res.status(404).json({ error: "Product not found" });
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


export async function searchProductsByLocation(req: Request, res: Response) {
    try {
        const {location} = req.body;

        console.log(location);
        
        const db = await connectMongoDB();
        const productsCollection = db.collection("products");
        
        const products = await productsCollection.find({ location: location }).toArray();
        if (products.length > 0) {
            return res.status(200).json({
                message: "Products fetched successfully by location",
                status: "ok",
                products: products
            });
        } else {
            return res.json({ error: "Products not found for the provided location" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
