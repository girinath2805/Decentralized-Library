import { PinataSDK } from "pinata";
import { Blob } from "buffer";
import Book from "../models/BookModel.js";
import dotenv from "dotenv"

dotenv.config()

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.GATEWAY_URL,
    pinataGatewayKey: process.GATEWAY_KEY,
});

const uploadBook = async (req, res) => {
    try {
        const file = req.file;

        if (!file) return res.status(400).json({ error: "No file uploaded" });

        console.log('Uploaded file:', file);

        const fileBuffer = file.buffer
        const fileBlob = new Blob([fileBuffer], { type: 'application/pdf' });
        const fileToUpload = new File([fileBlob], file.originalname, { type: 'application/pdf' });

        const pinataResponse = await pinata.upload.private.file(fileToUpload);
        console.log(pinataResponse)

        res.status(200).json({
            message: "Book uploaded successfully",
            cid:pinataResponse.cid,
        });
    } catch (error) {
        console.error("Error uploading book:", error);
        res.status(500).json({ error: "Error uploading book" });
    }
};

const getBook = async(req, res) => {
    try {
        const { bookId } = req.params;

        const book = await Book.findOne({ bookId });

        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.status(200).json(book);
    } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({ error: "Error fetching book" });
    }
}

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: "Error fetching books" });
    }
};

export { uploadBook, getBook, getAllBooks };
