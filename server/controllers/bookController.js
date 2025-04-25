import crypto from "crypto"
import Book from "../models/BookModel"

const ipfs = ipfsHttpClient({ url: 'https://ipfs.infura.io:5001/api/v0' })
const MASTER_KEY = process.env.MASTER_KEY || "supersecret"

const encryptBufferAES = (buffer, key) => {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv)
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()])
    return { encryptedData: encrypted, iv }
}

const uploadBook = async (req, res) => {

    try {
        const { title, author, genre, year } = req.body
        const file = req.file
        if (!file) return res.status(400).json({ error: 'No file uploaded' })


        const aesKey = crypto.randomBytes(32).toString('hex')
        const { encryptedData, iv } = encryptBufferAES(file.buffer, aesKey)

        const ipfsResult = await ipfs.add(encryptedData)
        const cid = ipfsResult.path

        const encryptedAesKey = crypto.createCipher('aes-256-cbc', MASTER_KEY).update(aesKey, 'utf8', 'hex')

        const bookTokenId = await mintNft(title)

        const newBook = new Book({
            title,
            author,
            genre,
            year,
            ipfscid: cid,
            aesEncryptedKey: encryptedAesKey,
            bookTokenId
        })

        await newBook.save()
        res.json({ success: true, bookId: newBook._id })
    } catch (error) {
        console.error(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export { uploadBook }