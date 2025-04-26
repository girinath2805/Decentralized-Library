import { ethers } from "ethers"
import Book from "../models/BookModel.js"
import { abi } from "../utils/abi.js"
import dotenv from "dotenv"

dotenv.config()

const contractAddress = process.env.CONTRACT_ADDRESS

if (!contractAddress) {
  console.error("❌ CONTRACT_ADDRESS not found in environment variables")
  process.exit(1)
}

console.log(`📝 Using contract address: ${contractAddress}`)

export function listenToBookUploaded() {
  const httpProvider = new ethers.JsonRpcProvider("https://testnet.hashio.io/api")
  const contract = new ethers.Contract(contractAddress, abi, httpProvider)
  
  console.log("🔄 Starting event polling for BookUploaded events...")
  
  // Keep track of the last block we checked (start from current block)
  let lastBlockChecked = 0
  
  // Initialize by getting current block number
  httpProvider.getBlockNumber()
    .then(blockNumber => {
      console.log(`🔍 Starting to monitor from block ${blockNumber}`)
      lastBlockChecked = blockNumber
    })
    .catch(error => {
      console.error("❌ Failed to get initial block number:", error)
    })
  
  // Poll every 15 seconds
  const pollInterval = setInterval(async () => {
    try {
      const currentBlock = await httpProvider.getBlockNumber()
      
      // Skip if we're already up to date or haven't initialized yet
      if (lastBlockChecked === 0 || lastBlockChecked >= currentBlock) return
      
      console.log(`🔍 Checking for events from block ${lastBlockChecked + 1} to ${currentBlock}`)
      
      // Query for past events
      const filter = contract.filters.BookUploaded()
      const events = await contract.queryFilter(filter, lastBlockChecked + 1, currentBlock)
      
      // Process any found events
      if (events.length > 0) {
        console.log(`📚 Found ${events.length} BookUploaded events`)
        
        for (const event of events) {
          const { bookId, uri, uploader, price } = event.args
          console.log("📘 BookUploaded:", bookId.toString(), uri)
          await saveBookToDB(bookId, uri, uploader, price)
        }
      }
      
      // Update the last checked block
      lastBlockChecked = currentBlock
    } catch (error) {
      console.error("❌ Error polling for events:", error)
    }
  }, 15000) // 15 seconds
  
  // Handle errors and cleanup
  process.on('SIGINT', () => {
    console.log('Stopping event polling...')
    clearInterval(pollInterval)
    process.exit(0)
  })
  
  return () => {
    clearInterval(pollInterval) // Function to stop polling if needed
  }
}

// Function to save book to database
async function saveBookToDB(bookId, uri, uploader, price) {
  try {
    const exists = await Book.findById(bookId.toString())
    if (exists) {
      console.log("⚠️ Book already in DB")
      return
    }

    const newBook = new Book({
      _id: bookId.toString(), // Set the MongoDB _id to match the bookId
      bookId: bookId.toString(),
      ownerAddress: uploader,
      price: price.toString(), // Convert BigNumber to string if needed
      uri
    })
    await newBook.save()
    console.log("✅ Book saved to DB:", bookId.toString())
  } catch (err) {
    console.error("❌ Error saving book:", err)
  }
}