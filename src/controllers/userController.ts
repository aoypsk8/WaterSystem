import { Request, Response } from "express";
import connectMongoDB from "../utils/db";
import multer from 'multer';
import { ObjectId } from "mongodb";

interface UserInput {
    username: string;
    password: string;
    location: string;
    role: string;
}

export async function getAllUsers(req: Request, res: Response) {
    try {
        const db = await connectMongoDB();
        const usersCollection = db.collection("users");
        const users = await usersCollection.find({}).toArray();
        if (users.length > 0) {
            return res.status(200).json({
                message: "Users fetched successfully",
                status: "ok",
                users: users
            });
        } else {
            return res.status(404).json({ error: "Users not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getOneUser(req: Request, res: Response) {
    try {
        const db = await connectMongoDB();
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ _id: new ObjectId(req.params.UserId) });
        if (user != null) {
            return res.status(200).json({
                message: "user fetched successfully",
                status: "ok",
                user: user
            });
        } else {
            return res.status(404).json({ error: "user not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const db = await connectMongoDB();
        const userCollection = db.collection("users");
        const user = await userCollection.findOneAndDelete({ _id: new ObjectId(req.params.UserId) });

        if (user != null) {
            return res.status(200).json({
                message: "delete user successfully",
                status: "ok",
                user: user
            });
        } else {
            return res.status(404).json({ error: "user not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function updateUser(req: Request, res: Response) {
    try {

        try {

            const db = await connectMongoDB();
            const usersCollection = db.collection("users");
            var { username, password, location, role }: UserInput = req.body;
            const user = await usersCollection.findOne({ _id: new ObjectId(req.params.UserId) });

            username = username ?? user!['username'];
            password = password ?? user!['password'];
            location = location ?? user!['location'];
            role = role ?? user!['role'];

            const updateOperation = {
                $set: {
                    username, password, location, role
                }
            };
            const updatedUser = await usersCollection.findOneAndUpdate(
                { _id: new ObjectId(req.params.ProductId) },
                updateOperation,
            );
            if (updatedUser) {
                return res.status(200).json({
                    message: "User updated successfully",
                    status: "ok",
                    updatedUser: updatedUser
                });
            } else {
                return res.status(404).json({ error: "Product not User" });
            }
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        };
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}