import { Request, Response } from "express";
import connection from "../utils/db";
import multerConfig from "../utils/multer_config";
import multer from "multer";

const INSERT_CATEGORY = "INSERT INTO category (cateName, images) VALUES (?,?)";
const SELECT_ALL_CATEGORY = "SELECT * FROM category ORDER BY id DESC";
const SELECT_CATEGORY_BY_ID = "SELECT * FROM category WHERE id = ?";
const DELETE_CATEGORY = "DELETE FROM category WHERE id = ?";

const UPDATE_CATEGORY_WITHOUT_IMAGE =
  "UPDATE category SET cateName = ? WHERE id = ?";
const UPDATE_CATEGORY_WITH_IMAGE =
  "UPDATE category SET cateName = ?, images = ? WHERE id = ?";

interface CategoryInput {
  cateName: string;
}
const upload = multer(multerConfig.config).single(multerConfig.keyUpload);

export async function insertCategory(req: Request, res: Response) {
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
      const { cateName }: CategoryInput = req.body;
      const images = req.file ? req.file.filename : null;
      console.log(req.file?.filename);

      connection.execute(
        INSERT_CATEGORY,
        [cateName, images],
        function (err, results: any) {
          if (err) {
            res.json({ status: "error", message: err });
            return;
          } else {
            res.json({
              status: "ok",
              message: "category created successfully",
              category: {
                results,
              },
            });
          }
        }
      );
    } catch (error) {
      console.error("Error storing cate in the database: ", error);
      res.sendStatus(500).json(error);
    }
  });
}

export async function getAllCategory(req: Request, res: Response) {
  try {
    connection.execute(SELECT_ALL_CATEGORY, function (err, results: any) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else {
        if (results.length > 0) {
          return res.status(200).json({
            message: "category fetched successfully",
            status: "ok",
            categorys: results,
          });
        } else {
          return res.json({ error: "category not found" });
        }
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getOneCategory(req: Request, res: Response) {
  try {
    connection.execute(
      SELECT_CATEGORY_BY_ID,
      [req.params.CateID],
      function (err, results: any) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } else {
          if (results.length > 0) {
            return res.status(200).json({
              message: "category fetched successfully",
              status: "ok",
              categorys: results,
            });
          } else {
            return res.json({ error: "category not found" });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    connection.execute(
      DELETE_CATEGORY,
      [req.params.CateID],
      function (err, results: any) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } else {
          if (results.affectedRows === 0) {
            res
              .status(404)
              .json({ status: "not found", message: "category not found" });
          } else {
            res.json({
              status: "ok",
              message: "category deleted successfully",
              category: {
                id: req.params.CateID,
              },
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

export async function updateCategory(req: Request, res: Response) {
  try {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.log(`error: ${JSON.stringify(err)}`);
        return res.status(500).json({ message: err });
      } else if (err) {
        console.log(`error: ${JSON.stringify(err)}`);
        return res.status(500).json({ message: err });
      }
      try {
        const { cateName }: CategoryInput = req.body;
        const images = req.file ? req.file.filename : null;

        let sql = UPDATE_CATEGORY_WITHOUT_IMAGE;
        let params = [cateName, req.params.CateID];

        if (images) {
          sql = UPDATE_CATEGORY_WITH_IMAGE;
          params = [cateName, images, req.params.CateID];
        }
        connection.execute(sql, params, function (err, results: any) {
          if (err) {
            res.json({ status: "error", message: err });
            return;
          } else {
            if (results.affectedRows === 0) {
              res
                .status(404)
                .json({ status: "not found", message: "category not found" });
            } else {
              res.json({
                status: "ok",
                message: "category updated successfully",
                category: {
                  results,
                },
              });
            }
          }
        });
      } catch (err) {
        console.error("Error storing category in the database: ", err);
        res.sendStatus(500);
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
