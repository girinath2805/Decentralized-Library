import express from "express"
import { getBook, uploadBook } from "../controllers/bookController.js"
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router()

router.post('/upload', upload.single('file'), uploadBook)
router.get('/:bookId', getBook)

export default router