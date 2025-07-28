import mongoose, { model,Schema } from "mongoose";

mongoose.connect("mongodb://localhost:27017/datamind")
const UserSchema = new Schema ({
    username : {type:String,unique:true},
    password: {type:String}
})

export const UserModel = model("User",UserSchema);