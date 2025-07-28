import express from "express";
import { ContentModel, UserModel } from "./db";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { usermiddleware } from "./Middleware";


const app=express();
app.use(express.json())
const port=3000;
dotenv.config();

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
    const JWT_KEY  =process.env.JWT_SECRECT_KEY;
   
    const existinguser = await UserModel.findOne({username,password});
    if(existinguser){
      if(!JWT_KEY){
        return res.json({message:"no JWT_KEY PROVIDED"});
      }
      const token = jwt.sign({id:existinguser._id}, JWT_KEY , {expiresIn:"4h"});
      res.json({
        token
      });
    }else{
      res.status(403).json({message:"incorect credentials"});
    }
   
})

app.post("/app/v1/content",usermiddleware,async (req,res) => {
  const {link,title,tag,userId} = req.body
 if (!link || !title || !tag || !userId) {
        return res.status(400).json({ message: "Missing required fields: link, title, tag, or userId" });
    }
try {
   await ContentModel.create({
      tag:tag,
      link:link,
      title:title,
      userId:userId
    })
    res.status(201).json({message:"content added successfully"});
} catch (e) {
  res.status(500).json({message:"error while adding content"})
}
})



app.listen(port,()=>{
    console.log(`app is listeningbat port number ${port}`)
})


