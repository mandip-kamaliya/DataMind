// middleware.ts

import { JWT_KEY } from "./config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const usermiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Authorization header is missing or malformed" });
    }

    const token = authHeader.split(' ')[1];

    try {
        
        if (!JWT_KEY) {
            throw new Error("JWT Secret is not configured on the server.");
        }

       
        const decoded = jwt.verify(token, JWT_KEY);

        
        // @ts-ignore
        req.userId = (decoded as any).id;
        
        next();
    } catch (err) {
       
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};