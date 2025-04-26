// @ts-nocheck
import { useState } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { decryptFileFnc, encryptFileFnc } from "@/lib/litProtocol.ts";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useWallet } from "@/context/WalletContext";
import { abi } from "@/abi";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
function FileIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

const PublishBook = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const { account, provider, network, isConnected } = useWallet();
  const navigate = useNavigate();
  const handleBookUpload = async () => {
    if (!isConnected || !provider) {
      alert("Wallet not connected");
      return;
    }
    if (!file) {
      toast.error("📂 Please select a file to upload.");
      return;
    }
    if (file.type !== "application/pdf") {
      toast.error("❌ Only PDF files are allowed.");
      return;
    }

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        abi,
        signer
      );
      let bookId = Number(await contract.allocatedId(account));
      if (bookId == 0) {
        const txn = await contract.allocateId();
        await txn.wait();
        bookId = Number(await contract.allocatedId(account));
      }
      const { ciphertext, dataToEncryptHash } = await encryptFileFnc(
        file,
        bookId
      );
      // const blob = await decryptFileFnc(ciphertext, dataToEncryptHash, bookId);
      // const downloadLink = document.createElement("a");
      // downloadLink.href = URL.createObjectURL(blob);
      // downloadLink.download = "decrypted_" + file?.name || "file";
      // downloadLink.click();
      const metadata = {
        ciphertext,
        dataToEncryptHash,
        title,
        genre,
        year,
        author,
      };

      const metadataJson = JSON.stringify(metadata);

      const metadataFile = new File([metadataJson], "metadata.json", {
        type: "application/json",
      });
      const formData = new FormData();
      formData.append("file", metadataFile);

      const response = await axios.post("/api/books/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        const cid = response.data.cid;
        const uri = `${import.meta.env.VITE_IPFS_GATEWAY}/${cid}`;
        const priceInWei = ethers.parseUnits(price.toString(), 8);
        const txn = await contract.uploadBook(uri, priceInWei);
        await txn.wait();
        toast.success("Book uploaded succesfully");
        navigate("/books");
      }
    } catch (err) {
      console.error("Error: ", err);
    }
  };
  return (
    <div className="p-4 md:p-6 max-w-md mx-auto w-full">
      <Card className="">
        <CardTitle className="flex justify-center items-center text-2xl">
          Publish a book
        </CardTitle>
        <CardContent className="p-6 space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
            <FileIcon className="w-12 h-12" />
            <span className="text-sm font-medium text-gray-500">
              Drag and drop a file or click to browse
            </span>
            <span className="text-xs text-gray-500">.pdf</span>
          </div>
          <div className="space-y-2 text-sm flex flex-col gap-2">
            <Label htmlFor="file" className="text-sm font-medium">
              File
            </Label>
            <Input
              id="file"
              type="file"
              placeholder="File"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Input
              id="Title"
              type="text"
              placeholder="Name of book"
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              id="Genre"
              type="text"
              placeholder="Genre"
              onChange={(e) => setGenre(e.target.value)}
            />
            <Input
              id="Publication year"
              type="text"
              placeholder="Publication Year"
              onChange={(e) => setYear(e.target.value)}
            />
            <Input
              id="Author"
              type="text"
              placeholder="Author"
              onChange={(e) => setAuthor(e.target.value)}
            />
            <Input
              id="Price"
              type="text"
              placeholder="Price in HBAR"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg" onClick={handleBookUpload}>
            Upload
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
export default PublishBook;
