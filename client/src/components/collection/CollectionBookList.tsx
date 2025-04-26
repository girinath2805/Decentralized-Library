import type { BookType } from "../../types";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import axios from "axios";
import { ethers } from "ethers";
import { abi } from "@/abi";
import { toast } from "sonner";
import { useWallet } from "@/context/WalletContext";
import { decryptFileFnc } from "@/lib/litProtocol";

interface CollectionBookListProps {
  books: BookType[];
}

export function CollectionBookList({ books }: CollectionBookListProps) {
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
    <div className="space-y-4">
      {books.map((book) => (
        <Card
          key={book.id}
          onClick={async () => await handleDownload(Number(book.id))}
        >
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 cursor-pointer">
              <img
                src={book.coverUrl || "/placeholder.svg"}
                alt={`Cover of ${book.title}`}
                className="w-[100px] h-[150px] object-cover rounded-md"
              />
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg">{book.title}</h3>
                    <Badge>{book.genre}</Badge>
                  </div>
                  <p className="text-muted-foreground">{book.author}</p>
                  <p className="text-sm text-muted-foreground">{book.year}</p>
                </div>
                <div className="flex items-center justify-between mt-2"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
