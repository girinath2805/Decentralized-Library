import { useEffect, useState } from "react";
import { CollectionView } from "@/components/collection/CollectionView";
import { StoreView } from "@/components/store/StoreView";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, BookMarked } from "lucide-react";
import axios from "axios";
import { useWallet } from "@/context/WalletContext";
import { toast } from "sonner";
import { ethers } from "ethers";
import { abi } from "@/abi";
import { PurchaseModal } from "@/components/store/PurchaseModal";
import type { BookType, StoreBookType } from "@/types"

function BookPage() {
  const [activeView, setActiveView] = useState<"collection" | "store">(
    "collection"
  );
  const [collectionBooks, setCollectionBooks] = useState<BookType[]>([]);
  const [storeBooks, setStoreBooks] = useState<StoreBookType[]>([]);
  const [selectedBook, setSelectedBook] = useState<StoreBookType | null>(null)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const { account, provider, network, isConnected } = useWallet();

  useEffect(() => {
    const getBooksCollection = async () => {
      try {
        if (!account) {
          toast.error("Connect wallet");
          return;
        }
        // const response = await axios.get("/api/users/purchased", {
        //   params: { address: account },
        // });

        // if (response.data.error) {
        //   toast.error(response.data.error);
        // } else {
        //   setCollectionBooks(response.data);
        // }
        const contract = new ethers.Contract(
          import.meta.env.VITE_CONTRACT_ADDRESS,
          abi,
          provider
        );
        const totalBooks = await contract.bookCounter();
        const purchased: BookType[] = [];

        for (let i = 1; i <= totalBooks; i++) {
          const book = await contract.books(i);
          if (!book.exists) continue;

          const hasPurchased = await contract.hasUserPurchased(i, account);
          if (!hasPurchased) continue;
          const metadata = await fetchMetadata(book.uri);
          if (!metadata) continue;

          purchased.push({
            id: i.toString(),
            title: metadata.title,
            author: metadata.author,
            coverUrl:
              metadata.coverUrl || "/placeholder.svg?height=250&width=180",
            year: parseInt(metadata.year),
            genre: metadata.genre,
          });
        }

        setCollectionBooks(purchased);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.error);
        } else {
          toast.error(
            "An error occurred while getting books collection. Please try again."
          );
        }
      }
    };

    const getStoreBooks = async () => {
      try {
        // const response = await axios.get("/api/books/allbooks");
        // if (response.data.error) {
        //   toast.error(response.data.error);
        // } else {
        //   const filtered = response.data.filter(
        //     (storeBook: StoreBookType) =>
        //       !collectionBooks.some((colBook) => colBook.id === storeBook.id)
        //   );
        //   setStoreBooks(filtered);
        // }
        if (!account || !provider) {
          toast.error("Connect wallet");
          return;
        }

        const contract = new ethers.Contract(
          import.meta.env.VITE_CONTRACT_ADDRESS,
          abi,
          provider
        );

        const totalBooks = await contract.bookCounter();
        const store: StoreBookType[] = [];

        for (let i = 1; i <= totalBooks; i++) {
          const book = await contract.books(i);
          if (!book.exists) continue;

          const hasPurchased = await contract.hasUserPurchased(i, account);
          if (hasPurchased) continue;

          const metadata = await fetchMetadata(book.uri);
          if (!metadata) continue;

          store.push({
            id: i.toString(),
            title: metadata.title,
            author: metadata.author,
            coverUrl:
              metadata.coverUrl || "/placeholder.svg?height=250&width=180",
            year: parseInt(metadata.year),
            genre: metadata.genre,
            price: parseFloat(ethers.formatEther(book.price)),
          });
        }

        setStoreBooks(store);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.error);
        } else {
          toast.error(
            "An error occurred while getting books collection. Please try again."
          );
        }
      }
    };

    getBooksCollection().then(getStoreBooks);
  }, [account]);

  async function fetchMetadata(url: string) {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.warn(`Failed to fetch metadata from ${url}`, error);
      return null;
    }
  }

  const handlePurchase = (book: StoreBookType) => {
    setSelectedBook(book)
    setIsPurchaseModalOpen(true)
  }

  // Handle book purchase
  const handlePurchaseComplete = () => {
    if (selectedBook) {
      // Add directly to collection
      const newCollectionBook: BookType = {
        ...selectedBook,
      }

      // Check if book already exists in collection
      if (!collectionBooks.some((b) => b.id === selectedBook.id)) {
        setCollectionBooks((prev) => [...prev, newCollectionBook])
      }
      setIsPurchaseModalOpen(false)
      setSelectedBook(null)
      setActiveView("collection")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between my-3">
        <div className="flex items-center gap-6">
          <Tabs
            value={activeView}
            onValueChange={(value) =>
              setActiveView(value as "collection" | "store")
            }
          >
            <TabsList>
              <TabsTrigger
                value="collection"
                className="flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">My Collection</span>
              </TabsTrigger>
              <TabsTrigger
                value="store"
                className="flex items-center gap-1 cursor-pointer"
              >
                <BookMarked className="h-4 w-4" />
                <span className="hidden sm:inline">Book Store</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <main>
        {activeView === "collection" ? (
          <CollectionView books={collectionBooks} />
        ) : (
          <StoreView books={storeBooks} onPurchase={handlePurchase} />
        )}
      </main>

      {selectedBook && (
        <PurchaseModal
          book={selectedBook}
          isOpen={isPurchaseModalOpen}
          onClose={() => {
            setIsPurchaseModalOpen(false)
            setSelectedBook(null)
          }}
          onPurchase={handlePurchaseComplete}
        />
      )}

      {/* <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} BookShelf. All rights reserved.
        </div>
      </footer> */}
    </div>
  );
}

export default BookPage;
