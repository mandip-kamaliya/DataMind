
import { JWT_KEY } from "./config";
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

export const usermiddleware = async (req:Request,res:Response,next:NextFunction)=>{
        const header = req.headers["authorization"];
        const decode = jwt.verify(header as string  ,JWT_KEY as string)
        // if(decode){
        //     req.userId
        // }
}