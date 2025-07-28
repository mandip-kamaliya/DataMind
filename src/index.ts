
import 'dotenv/config';
import express from "express";
import { ContentModel, UserModel } from "./db";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { usermiddleware } from "./Middleware";
import { JWT_KEY } from "./config";


const app=express();
app.use(express.json())
const port=3000;
app.post("/app/v1/Signup",async(req,res)=>{
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

app.post("/app/v1/SignIn",async (req,res)=>{
    const {username,password} = req.body;
   
    const existinguser = await UserModel.findOne({username,password});
    if(existinguser){
      // if(!JWT_KEY){
      //   return res.json({message:"no JWT_KEY PROVIDED"});
      // }
      const token = jwt.sign({id:existinguser._id}, JWT_KEY as string , {expiresIn:"4h"});
      res.json({
        token
      });
    }else{
      res.status(403).json({message:"incorect credentials"});
    }
   
})

app.post("/app/v1/content",usermiddleware,async (req,res) => {
  const {link,title} = req.body
 if (!link || !title ) {
        return res.status(400).json({ message: "Missing required fields: link, title" });
    }
try {
   await ContentModel.create({
      tag:[],
      link,
      title,
      //@ts-ignore
      userId:req.userId
    })
    res.status(201).json({message:"content added successfully"});
} catch (e) {
  res.status(500).json({message:"error while adding content"})
}
})

app.get("/app/v1/content",usermiddleware,async (req,res)=>{
      try {
        //@ts-ignore
       const userId=req.userId
        const content = await ContentModel.find({userId})
        res.json(content)
      } catch (error) {
        res.status(404).json({error:(error as any).message})
      }
})
    

app.listen(port,()=>{
    console.log(`app is listeningbat port number ${port}`)
})


