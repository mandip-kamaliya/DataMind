"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Middleware_1 = require("./Middleware");
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3000;
app.post("/app/v1/Signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        db_1.UserModel.create({
            username: username,
            password: password
        });
        res.status(200).json("user sign up successfully");
    }
    catch (error) {
        res.status(411).json({ message: "user already exists" });
    }
}));
app.post("/app/v1/SignIn", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const existinguser = yield db_1.UserModel.findOne({ username, password });
    if (existinguser) {
        // if(!JWT_KEY){
        //   return res.json({message:"no JWT_KEY PROVIDED"});
        // }
        const token = jsonwebtoken_1.default.sign({ id: existinguser._id }, config_1.JWT_KEY, { expiresIn: "4h" });
        res.json({
            token
        });
    }
    else {
        res.status(403).json({ message: "incorect credentials" });
    }
}));
app.post("/app/v1/content", Middleware_1.usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, title } = req.body;
    if (!link || !title) {
        return res.status(400).json({ message: "Missing required fields: link, title" });
    }
    try {
        yield db_1.ContentModel.create({
            tag: [],
            link,
            title,
            //@ts-ignore
            userId: req.userId
        });
        res.status(201).json({ message: "content added successfully" });
    }
    catch (e) {
        res.status(500).json({ message: "error while adding content" });
    }
}));
// Add this route to your index.ts for debugging
app.get("/app/v1/debug-jwt", (req, res) => {
    console.log("--- Starting JWT Debug ---");
    // Using the same JWT_KEY you import from your config file
    const key = config_1.JWT_KEY;
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
        const testToken = jsonwebtoken_1.default.sign(payload, key, { expiresIn: "1m" });
        console.log("Successfully signed a test token.");
        // 2. Immediately try to verify the token we just made
        const decoded = jsonwebtoken_1.default.verify(testToken, key);
        console.log("Successfully verified the test token. Decoded payload:", decoded);
        res.status(200).json({
            message: "✅ DEBUG SUCCESS: The key is working. The token was signed and verified successfully.",
        });
    }
    catch (error) {
        console.error("DEBUG FAILED:", error);
        res.status(500).json({
            message: "❌ DEBUG FAILED: The key seems to be loaded but the sign/verify process failed.",
            errorName: error instanceof Error ? error.name : "UnknownError",
            errorMessage: error instanceof Error ? error.message : String(error)
        });
    }
    console.log("--- Finished JWT Debug ---");
});
app.listen(port, () => {
    console.log(`app is listeningbat port number ${port}`);
});
