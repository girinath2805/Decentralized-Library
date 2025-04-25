import express from "express"
import { uploadBook } from "../controllers/bookController"
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router()

router.post('/upload', upload.single('file'), uploadBook)

export default router