import { Request, Response } from "express";
import multerConfig from "../utils/multer_config";
import multer from "multer";
import connection from "../utils/db";

const INSERT_PRODUCT =
  "INSERT INTO products (productName, description, price, stock, images, category_id, location) VALUES (? ,?, ?, ?, ?, ?, ?)";
const SELECT_ALL_PRODUCT = "SELECT * FROM products ORDER BY id DESC";
const SELECT_PRODUCT_BY_ID = "SELECT * FROM products WHERE id = ?";
const DELETE_PRODUCT = "DELETE FROM products WHERE id = ?";

const UPDATE_PRODUCT_WITHOUT_IMAGE =
  "UPDATE products SET productName = ?, description = ?, price = ?, stock = ?, category_id = ?, location = ? WHERE id = ?";
const UPDATE_PRODUCT_WITH_IMAGE =
  "UPDATE products SET productName = ?, description = ?, price = ?, stock = ?, images = ?, category_id = ?, location = ? WHERE id = ?";

const SEARCH_PRODUCT = "SELECT * FROM products WHERE location = ?";

interface ProductInput {
  productName: string;
  description: string;
  price: string;
  stock: number;
  category_id: number;
  location: string;
}

const upload = multer(multerConfig.config).single(multerConfig.keyUpload);
export async function insertProduct(req: Request, res: Response) {
  try {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.log(`error: ${JSON.stringify(err)}`);
        return res.status(500).json({ message: err });
      } else if (err) {
        console.log(`error: ${JSON.stringify(err)}`);
        return res.status(500).json({ message: err });
      } else {
        console.log(`file: ${JSON.stringify(req.file)}`);
        console.log(`body: ${JSON.stringify(req.body)}`);
      }

      try {
        const {
          productName,
          description,
          price,
          stock,
          category_id,
          location,
        }: ProductInput = req.body;
        const images = req.file ? req.file.filename : null;

        connection.execute(
          INSERT_PRODUCT,
          [
            productName,
            description,
            price,
            stock,
            images,
            category_id,
            location,
          ],
          function (err, results: any) {
            if (err) {
              res.json({ status: "error", message: err });
              return;
            } else {
              return res.status(201).json({
                message: "Product created successfully",
                status: "ok",
                product: results,
              });
            }
          }
        );
      } catch (error) {
        console.error("Error storing cate in the database: ", error);
        res.sendStatus(500).json(error);
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
export async function getAllProducs(req: Request, res: Response) {
  try {
    connection.execute(SELECT_ALL_PRODUCT, function (err, results: any) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else {
        if (results.length > 0) {
          return res.status(200).json({
            message: "Products fetched successfully",
            status: "ok",
            Products: results,
          });
        } else {
          return res.json({ error: "Products not found" });
        }
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getOneProducs(req: Request, res: Response) {
  try {
    connection.execute(
      SELECT_PRODUCT_BY_ID,
      [req.params.ProductId],
      function (err, results: any) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } else {
          if (results.length > 0) {
            return res.status(200).json({
              message: "Product fetched successfully",
              status: "ok",
              Product: results,
            });
          } else {
            return res.json({ error: "Product not found" });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteProducs(req: Request, res: Response) {
  try {
    connection.execute(
      DELETE_PRODUCT,
      [req.params.ProductId],
      function (err, results: any) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } else {
          if (results.affectedRows === 0) {
            res
              .status(404)
              .json({ status: "not found", message: "Product not found" });
          } else {
            res.json({
              status: "ok",
              message: "Product deleted successfully",
              id: req.params.ProductId,
            });
          }
        }
      }
    );
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
        const {
          productName,
          description,
          price,
          stock,
          category_id,
          location,
        }: ProductInput = req.body;
        const images = req.file ? req.file.filename : null;

        connection.execute(
          SELECT_PRODUCT_BY_ID,
          [req.params.ProductId],
          function (err, results: any) {
            if (err) {
              res.json({ status: "error", message: err });
              return;
            } else {
              if (results.length > 0) {
                console.log(results[0].id);
                let sql = UPDATE_PRODUCT_WITHOUT_IMAGE;
                let params = [
                  productName || results[0].productName,
                  description || results[0].description,
                  price || results[0].price,
                  stock || results[0].stock,
                  category_id || results[0].category_id,
                  location || results[0].location,
                  req.params.ProductId,
                ];

                if (images) {
                  sql = UPDATE_PRODUCT_WITH_IMAGE;
                  params = [
                    productName || results[0].productName,
                    description || results[0].description,
                    price || results[0].price,
                    stock || results[0].stock,
                    images || results[0].images,
                    category_id || results[0].category_id,
                    location || results[0].location,
                    req.params.ProductId,
                  ];
                }
                try {
                  connection.execute(sql, params, function (err, results: any) {
                    if (err) {
                      res.json({ status: "error", message: err });
                      return;
                    } else {
                      if (results.affectedRows === 0) {
                        res.status(404).json({
                          status: "not found",
                          message: "Product not found",
                        });
                      } else {
                        res.json({
                          status: "ok",
                          message: "Product updated successfully",
                          Product: {
                            results,
                          },
                        });
                      }
                    }
                  });
                } catch (error) {
                  return res.json({ error: error });
                }
              } else {
                return res.json({ error: "Product not found" });
              }
            }
          }
        );
      } catch (err) {
        console.error("Error storing Product in the database: ", err);
        res.sendStatus(500);
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function searchProductsByLocation(req: Request, res: Response) {
  try {
    const { location } = req.body;
    connection.execute(
      SEARCH_PRODUCT,
      [location],
      function (err, results: any) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } else {
          if (results.length > 0) {
            return res.status(200).json({
              message: "Products fetched successfully",
              status: "ok",
              Products: results,
            });
          } else {
            return res.json({ error: "Products not found" });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
