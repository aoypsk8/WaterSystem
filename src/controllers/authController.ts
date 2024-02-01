import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// db
import connectMongoDB from "../utils/db";
import { authenticateTokenAdmin } from "../middleware/authMiddleware";

interface UserInput {
  username: string;
  password: string;
  location: string;
  role: string;
}

async function login(req: Request, res: Response) {
  const { username, password }: UserInput = req.body;
  try {
    const db = await connectMongoDB();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });

    if (user == null) {
      return res.json({ message: "User invalidate" });
    } else {
      const passwordMatch = await bcrypt.compare(password, user?.password);

      if (!passwordMatch) {
        return res.json({ message: "Password is not match !" });
      }
      const token = jwt.sign(
        { username: user?.username, role: user?.role },
        process.env.JWT_SECRET || "aoy@2023secret",
        {
          expiresIn: "1h",
        }
      );

      if (passwordMatch) {
        res.status(200).json({
          status: "ok",
          token: token,
          message: "Login successful",
          user,
        });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function register(req: Request, res: Response) {
  const { username, password, location, role }: UserInput = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const db = await connectMongoDB();
    const usersCollection = db.collection("users");
    const existingUser = await usersCollection.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    await usersCollection.insertOne({
      username,
      password: hashedPassword,
      location,
      role,
    });
    res.status(201).json({
      message: "User registered successfully",
      status: "ok",
      location: location,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
export default { login, register };
