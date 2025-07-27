import express from "express";
import { UserModel } from "./db";

const app=express();

app.post("app/v1/Signup",async(req,res)=>{
   try {
     const {username,password} = req.body;
 
     UserModel.create({
         username:username,
         password:password
     })
     res.status(200).json("user sign up successfully");
   } catch (error) {
     res.status(411).json({message:"user already exists"})
   }
    
})

app.post("app/v1/SignIn",async (req,res)=>{
    const {username,password} = req.body;
    const existinguser = await UserModel.findById(username);
    if(existinguser){
        
    }
})


