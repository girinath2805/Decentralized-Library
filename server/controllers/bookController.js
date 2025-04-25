import crypto from "crypto";
const { PinataSDK } = require("pinata");
const fs = require("fs");
const { Blob } = require("buffer");
import Book from "../models/BookModel";
require("dotenv").config();

const MASTER_KEY = process.env.MASTER_KEY || "supersecret";

const encryptBufferAES = (buffer, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    iv
  );
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return { encryptedData: encrypted, iv };
};
const uploadipfs = async (encryptedData, fileName) => {
  const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.GATEWAY_URL,
  });
  const blob = new Blob([encryptedData], { type: "application/octet-stream" });
  const file = new File([blob], fileName);
  const upload = await pinata.upload.public.file(file);
  console.log("IPFS Upload:", upload);
  return upload;
};

const uploadBook = async (req, res) => {
  try {
    const { title, author, genre, year } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const aesKey = crypto.randomBytes(32).toString("hex");
    const { encryptedData, iv } = encryptBufferAES(file.buffer, aesKey);

    const ipfsResult = await uploadToIPFS(encryptedData, `${title}.enc.pdf`);
    const cid = ipfsResult.cid;

    const encryptedAesKey = crypto
      .createCipher("aes-256-cbc", MASTER_KEY)
      .update(aesKey, "utf8", "hex");

    const bookTokenId = 0;

    const newBook = new Book({
      title,
      author,
      genre,
      year,
      ipfscid: cid,
      aesEncryptedKey: encryptedAesKey,
      bookTokenId,
    });

    await newBook.save();
    res.json({ success: true, bookId: newBook._id });
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { uploadBook };
