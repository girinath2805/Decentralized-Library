import mongoose from "mongoose"

const bookSchema = new mongoose.Schema({
    bookId:{
        type:String,
        required:true,
    },
    ownerAddress:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    uri:{
        type:String,
        required:true,
    },
}, { timestamps:true })

const Book = mongoose.model("Book", bookSchema)
export default Book