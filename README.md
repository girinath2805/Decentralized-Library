# 📚 Decentralized Library using Hedera, IPFS, and Lit Protocol

A decentralized content publishing and ownership platform where authors can upload encrypted books, mint NFTs to represent ownership, and let readers purchase and decrypt content—all powered by **Hedera**, **IPFS (Pinata)**, and **Lit Protocol**.

---

## 🚀 Features

- Upload encrypted books with ownership represented as NFTs
- Access control via Lit Protocol based on smart contract conditions
- Book purchase with HBAR and decryption rights enforcement
- IPFS-based metadata and file storage
- Search, genre filters, and mobile-optimized UI
- Event-based backend syncing with MongoDB for fast querying

---

## 📁 Project Structure

```

DecentralizedLibrary/
│
├── client/       # React frontend
└── server/       # Express backend with event listener and IPFS upload logic

````

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js and npm installed
- Metamask with a Hedera account for testing purchases
- MongoDB connection (you can use MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/girinath2805/Decentralized-Library
cd Decentralized-Library
````

---

### 2. Setup Server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory and paste the following:

```env
PORT=""
MONGO_URI=""
FRONTEND_URL=""
PINATA_API_KEY=""
PINATA_API_SECRET=""
PINATA_JWT=""
GATEWAY_URL=""
GATEWAY_KEY=""
CONTRACT_ADDRESS=""
```

Then run the server:

```bash
npm run dev
```

---

### 3. Setup Client

```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory and add:

```env
VITE_CONTRACT_ADDRESS=""
VITE_IPFS_GATEWAY=""
```

Then run the client:

```bash
npm run dev
```

---

## 📌 Notes

* Make sure MetaMask is connected to the correct Hedera testnet.
* The smart contract handles `allocateID`, `uploadBook`, and `purchaseBook` logic.
* Lit Protocol enforces access control during decryption based on on-chain purchase status.

---

## 📈 Future Enhancements

* Add support for videos/media
* PDF viewer integration without download
* Personalized recommendations
* Decentralized governance module
* Native mobile app

---

## 🧠 Contributing

Pull requests and stars are welcome! For major changes, please open an issue first to discuss what you would like to change.

---
