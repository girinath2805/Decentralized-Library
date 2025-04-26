// /listeners/bookUploadedListener.js
import { ethers } from "ethers"
import Book from "../models/BookModel.js"
import { abi } from "../utils/abi.js"
import dotenv from "dotenv"

dotenv.config()

const provider = new ethers.JsonRpcProvider("https://testnet.hashio.io/api")
const contractAddress = process.env.CONTRACT_ADDRESS

const contract = new ethers.Contract(contractAddress, abi, provider)

if (!contractAddress) {
    console.error("CONTRACT_ADDRESS not found in environment variables")
    process.exit(1)
  }

export function listenToBookUploaded() {
    contract.on("BookUploaded", async (bookId, uri, uploader, price) => {
        console.log("📘 BookUploaded:", bookId.toString(), uri)

        try {

            const exists = await Book.findById(bookId.toString())
            if (exists) return console.log("⚠️ Book already in DB")

            const newBook = new Book({
                bookId,
                ownerAddress: uploader,
                price,
                uri
            })
            await newBook.save()
            console.log("✅ Book saved to DB")
        } catch (err) {
            console.error("❌ Error saving book:", err)
        }
    })
}
