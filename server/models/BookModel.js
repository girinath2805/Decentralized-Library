import mongoose from "mongoose"

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
    coverUrl:{
        type:String,
    },
    year:{
        type:Number,
    },
    genre:{
        type:String,
    },
    rating:{
        type:Number,
    },
    ipfscid:{
        type:String,
        required:true,
    },
    aesEncryptedKey:{
        type:String,
        required:true,
    },
    bookTokenId:{
        type:String,
        required:true,
    }
}, { timestamps:true })

const Book = mongoose.model("Book", bookSchema)
export default Book