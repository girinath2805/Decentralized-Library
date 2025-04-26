// @ts-nocheck
import {
  LitNodeClient,
  checkAndSignAuthMessage,
} from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { encryptFile, decryptToFile } from "@lit-protocol/encryption";

const chain = "hederaTestnet";
const getEvmContractConditions = (bookId) => {
  return [
    {
      contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
      functionParams: [bookId.toString(), ":userAddress"],
      functionName: "hasUserPurchased",
      functionAbi: {
        inputs: [
          {
            internalType: "uint256",
            name: "_bookId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
        ],
        name: "hasUserPurchased",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      chain,
      returnValueTest: {
        key: "",
        comparator: "=",
        value: "true",
      },
    },
  ];
};
export const encryptFileFnc = async (fileToUpload, bookId) => {
  try {
    const litNodeClient = new LitNodeClient({
      litNetwork: LIT_NETWORK.DatilDev,
    });
    await litNodeClient.connect();

    const authSig = await checkAndSignAuthMessage({ chain });
    console.log(authSig);
    console.log(fileToUpload);
    const evmContractConditions = getEvmContractConditions(bookId);
    const { ciphertext, dataToEncryptHash } = await encryptFile(
      {
        evmContractConditions,
        file: fileToUpload,
        chain,
        authSig,
      },
      litNodeClient
    );
    console.log(ciphertext, dataToEncryptHash);
    return { ciphertext, dataToEncryptHash };
  } catch (err) {
    console.error("Upload error:", err);
    alert("Trouble uploading file");
  }
};
export const decryptFileFnc = async (
  ciphertext,
  dataToEncryptHash,
  bookId
): Promise<Blob> => {
  try {
    const litNodeClient = new LitNodeClient({
      litNetwork: LIT_NETWORK.DatilDev,
    });
    await litNodeClient.connect();

    const authSig = await checkAndSignAuthMessage({ chain });

    console.log(ciphertext, authSig, dataToEncryptHash);
    const evmContractConditions = getEvmContractConditions(bookId);
    const decryptedFile = await decryptToFile(
      {
        evmContractConditions,
        chain,
        ciphertext,
        dataToEncryptHash,
        authSig,
      },
      litNodeClient
    );

    const blob = new Blob([decryptedFile], {
      type: "application/octet-stream",
    });
    return blob;

  } catch (err) {
    console.error("Decryption error:", err);
    alert("Error decrypting the file. Check the console for details.");
  }
};
