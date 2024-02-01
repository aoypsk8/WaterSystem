import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connection from "../utils/db";
// db command
const SELECT_USER_BY_USER = "SELECT * FROM users WHERE username = ?";
const INSERT_USER =
  "INSERT INTO users (username, password, location, role) VALUES (?, ?, ?,?)";

interface UserInput {
  username: string;
  password: string;
  location: string;
  role: string;
}

async function login(req: Request, res: Response) {
  const { username, password }: UserInput = req.body;
  try {
    connection.execute(
      SELECT_USER_BY_USER,
      [username],
      (err: any, results: any) => {
        if (err) {
          console.error("Database error:", err);
          res.status(500).json({ message: "Internal server error" });
          return;
        } else {
          if (results.length > 0) {
            bcrypt.compare(password, results[0].password, (err, hash) => {
              if (err) {
                res.status(500).json({ message: "Something went wrong" });
                return;
              } else {
                if (hash) {
                  const token = jwt.sign(
                    { username: results.username, role: results.role },
                    process.env.JWT_SECRET || "aoy@2023secret",
                    {
                      expiresIn: "1h",
                    }
                  );
                  res.status(200).json({
                    status: "ok",
                    token: token,
                    message: "Login successful",
                    user:results,
                  });
                } else {
                  res.json({
                    message: "Username and password does not match",
                  });
                  return;
                }
              }
            });
          } else {
            res.status(400).json({ message: "Email does not exist" });
            return;
          }
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function register(req: Request, res: Response) {
  const { username, password, location, role }: UserInput = req.body;
  try {
    connection.execute(
      SELECT_USER_BY_USER,
      [username],
      async (err: any, results: any) => {
        if (err) {
          console.error("Database error:", err);
          res.status(500).json({ message: "Internal server error" });
          return;
        } else {
          if (results.length > 0) {
            res.status(400).json({ message: "User already exists" });
            return;
          } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            connection.execute(
              INSERT_USER,
              [username, hashedPassword, location, role],
              (err: any) => {
                if (err) {
                  console.error("Database error:", err);
                  res.status(500).json({ message: "Internal server error" });
                  return;
                } else {
                  res.status(201).json({
                    message: "User registered successfully",
                    status: "ok",
                  });
                }
              }
            );
          }
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default { login, register };
