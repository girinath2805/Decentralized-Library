import dotenv from "dotenv"
import User from "../models/UserModel.js";

dotenv.config()

const getPurchasedBooks = async (req, res) => {
    try {
        const address = req.body;
        const user = await User.findOne({ address }).populate("purchased");

        if (!user) {
            res.status(404).json({ error: "Username doesn't exist" })
            return
        }

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json(error.message)
        console.error("Error signing in user :", error)
    }
}

export { getPurchasedBooks }