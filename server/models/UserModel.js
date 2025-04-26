import mongoose from "mongoose";
import Book from "./BookModel.js";

const userSchema = new mongoose.Schema({
    address:{
        type:String,
        required:true,
    },
    purchased:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Book',
        required:true,
    }]
})

const User = mongoose.model('User', userSchema)
export default User