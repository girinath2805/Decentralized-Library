import express from "express"
import { getPurchasedBooks } from "../controllers/userController.js"

const router = express.Router()

router.get('/purchased', getPurchasedBooks)

export default router