import { Request, Response } from "express";
import connection from "../utils/db";

const SELECT_ALL_USER = "SELECT * FROM users ORDER BY id DESC";
const SELECT_USER_BY_ID = "SELECT * FROM users WHERE id = ?";
const DELETE_USER = "DELETE FROM users WHERE id = ?";

interface UserInput {
  username: string;
  password: string;
  location: string;
  role: string;
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    connection.execute(SELECT_ALL_USER, function (err, results: any) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else {
        if (results.length > 0) {
          return res.status(200).json({
            message: "users fetched successfully",
            status: "ok",
            user: results,
          });
        } else {
          return res.json({ error: "users not found" });
        }
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getOneUser(req: Request, res: Response) {
  try {
    connection.execute(
      SELECT_USER_BY_ID,
      [req.params.UserId],
      function (err, results: any) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } else {
          if (results.length > 0) {
            return res.status(200).json({
              message: "user fetched successfully",
              status: "ok",
              user: results,
            });
          } else {
            return res.json({ error: "user not found" });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    connection.execute(
      DELETE_USER,
      [req.params.UserId],
      function (err, results: any) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } else {
          if (results.affectedRows === 0) {
            res
              .status(404)
              .json({ status: "not found", message: "User not found" });
          } else {
            res.json({
              status: "ok",
              message: "User deleted successfully",
              id: req.params.UserId,
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
