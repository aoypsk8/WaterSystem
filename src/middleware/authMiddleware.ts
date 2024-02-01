import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


interface TokenPayload extends JwtPayload {
    username: string;
    role: string;
}

export function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const token = req.headers["authorization"];
    if (token == null) {
        return res.json({
            message: "Unauthorized",
            status: 401,
        });
    }
    jwt.verify(token, process.env.JWT_SECRET || "", (err, user) => {
        if (err) {
            return res.json({
                message: "Token is not correct",
                status: 403,
            });
        } else {
            user = user;
            next();
        }
    })
}

export function authenticateTokenAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const token = req.headers["authorization"];
    if (token == null) {
        return res.json({
            message: "Unauthorized",
            status: 401,
        });
    }
    const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET || "aoy@2023secret"
    ) as TokenPayload;

    if (decodedToken.role == "Admin") {
        next();
    } else {
        res.json({
            message: "not admin ",
            status: 403,
        });
    }

}