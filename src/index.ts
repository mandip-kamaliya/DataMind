
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

// Add this route to your index.ts for debugging
app.get("/app/v1/debug-jwt", (req, res) => {
    console.log("--- Starting JWT Debug ---");

    // Using the same JWT_KEY you import from your config file
    const key = JWT_KEY; 
    
    console.log("Key loaded from config for this test:", key);

    if (!key) {
        console.error("DEBUG ERROR: The JWT_KEY is undefined!");
        return res.status(500).json({ 
            message: "DEBUG FAILED: The JWT_KEY is not loaded correctly. Check your .env file and the import order in index.ts." 
        });
    }

    try {
        // 1. Sign a simple test token
        const payload = { userId: "test-user-123" };
        const testToken = jwt.sign(payload, key, { expiresIn: "1m" });
        console.log("Successfully signed a test token.");

        // 2. Immediately try to verify the token we just made
        const decoded = jwt.verify(testToken, key);
        console.log("Successfully verified the test token. Decoded payload:", decoded);

        res.status(200).json({
            message: "✅ DEBUG SUCCESS: The key is working. The token was signed and verified successfully.",
        });

    } catch (error) {
        console.error("DEBUG FAILED:", error);
        res.status(500).json({
            message: "❌ DEBUG FAILED: The key seems to be loaded but the sign/verify process failed.",
            errorName: error instanceof Error ? error.name : "UnknownError",
            errorMessage: error instanceof Error ? error.message : String(error)
        });
    }
    console.log("--- Finished JWT Debug ---");
});

app.listen(port,()=>{
    console.log(`app is listeningbat port number ${port}`)
})


