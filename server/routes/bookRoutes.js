import express from "express"
import { getBook, uploadBook } from "../controllers/bookController"
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router()

router.post('/upload', upload.single('file'), uploadBook)
router.get('/get', getBook)

export default router