
import { JWT_KEY } from "./config";
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

export const usermiddleware = async (req:Request,res:Response,next:NextFunction)=>{
        const header = req.headers["authorization"];
        const decoded = jwt.verify(header as string  ,JWT_KEY as string)
        if(decoded){
            //@ts-ignore
            req.userId=decoded.id
        }else{
            res.status(403).json({
                message:"you are not logged in"
            })
        }
}