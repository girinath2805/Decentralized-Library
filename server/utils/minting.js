import {
    Client,
    AccountId,
    PrivateKey,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    TokenMintTransaction,
    Hbar,
  } from "@hashgraph/sdk"
  import dotenv from "dotenv"
  
  dotenv.config()
  
  const operatorId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID)
  const operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY)
  
  const client = Client.forTestnet().setOperator(operatorId, operatorKey)
  
  export async function mintNft(bookTitle) {
    const tokenCreateTx = await new TokenCreateTransaction()
      .setTokenName(bookTitle)
      .setTokenSymbol("BOOK")
      .setTokenType(TokenType.NonFungibleUnique)
      .setSupplyType(TokenSupplyType.Finite)
      .setMaxSupply(10000)
      .setTreasuryAccountId(operatorId)
      .setAdminKey(operatorKey.publicKey)
      .setSupplyKey(operatorKey.publicKey)
      .setInitialSupply(0)
      .setDecimals(0)
      .setAutoRenewAccountId(operatorId)
      .setAutoRenewPeriod(7776000)
      .setTransactionMemo("NFT created for book")
      .freezeWith(client)
  
    const tokenCreateSign = await tokenCreateTx.sign(operatorKey)
    const tokenCreateSubmit = await tokenCreateSign.execute(client)
    const tokenCreateReceipt = await tokenCreateSubmit.getReceipt(client)
  
    const tokenId = tokenCreateReceipt.tokenId.toString()
    console.log(`✅ NFT Minted: Token ID ${tokenId}`)
    return tokenId
  }
