import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import bookRoutes from "./routes/bookRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import connectDB from "./db/connectDB.js"
import { listenToBookUploaded } from "./listeners/bookUploadListener.js"

const app = express()
dotenv.config()

const PORT = process.env.PORT || 5000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000/'  

connectDB().then(() => {
    listenToBookUploaded()
})

app.use(cors({
    origin:FRONTEND_URL,
    credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({ extended:true }))

app.use('/api/books', bookRoutes)
app.use('/api/users', userRoutes)

app.listen((PORT), () => console.log(`Server running on http://localhost:${PORT}`))