import type { BookType } from "../../types";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { decryptFileFnc } from "@/lib/litProtocol";
import { toast } from "sonner";
import { ethers } from "ethers";
import { abi } from "@/abi";
import axios from "axios";
import { useWallet } from "@/context/WalletContext";

interface CollectionBookGridProps {
  books: BookType[];
}

export function CollectionBookGrid({ books }: CollectionBookGridProps) {
  const { account, provider } = useWallet();
  const handleDownload = async (id: number) => {
    if (!account || !provider) {
      toast.error("Connect wallet");
      return;
    }

    const contract = new ethers.Contract(
      import.meta.env.VITE_CONTRACT_ADDRESS,
      abi,
      provider
    );

    interface Metadata {
      ciphertext: string;
      dataToEncryptHash: string;
      title?: string;
      [key: string]: any;
    }

    const book = await contract.books(id);
    const metadata: Metadata = await fetchMetadata(book.uri);
    const ciphertext: string = metadata.ciphertext;
    const dataToEncryptHash: string = metadata.dataToEncryptHash;
    const blob: Blob = await decryptFileFnc(ciphertext, dataToEncryptHash, id);
    const arrayBuffer: ArrayBuffer = await blob.arrayBuffer();
    const pdfBlob: Blob = new Blob([arrayBuffer], { type: "application/pdf" });
    const downloadLink: HTMLAnchorElement = document.createElement("a");
    downloadLink.href = URL.createObjectURL(pdfBlob);
    downloadLink.download = metadata.title || "file.pdf";
    downloadLink.click();
  };
  async function fetchMetadata(url: string) {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.warn(`Failed to fetch metadata from ${url}`, error);
      return null;
    }
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <Card
          key={book.id}
          className="overflow-hidden h-full flex flex-col cursor-pointer"
          onClick={async () => await handleDownload(Number(book.id))}
        >
          <div className="relative pt-4 px-4">
            <img
              src={"/coverown.jpg"}
              alt={`Cover of ${book.title}`}
              className="w-full h-fit object-cover rounded-md"
            />
            <Badge className="absolute top-6 right-6">{book.genre}</Badge>
          </div>
          <CardContent className="pt-4 flex-grow">
            <h3 className="font-semibold text-lg line-clamp-1">{book.title}</h3>
            <p className="text-muted-foreground">{book.author}</p>
            <p className="text-sm text-muted-foreground">{book.year}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
