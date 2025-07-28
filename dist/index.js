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
app.get("/app/v1/content", Middleware_1.usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const userId = req.userId;
        const content = yield db_1.ContentModel.find({ userId });
        res.json(content);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
}));
app.listen(port, () => {
    console.log(`app is listeningbat port number ${port}`);
});
