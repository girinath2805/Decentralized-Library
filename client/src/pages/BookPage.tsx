import { useEffect, useState } from "react"
import { CollectionView } from "@/components/collection/CollectionView"
import { StoreView } from "@/components/store/StoreView"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart as CartComponent } from "@/components/store/ShoppingCart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, BookMarked } from "lucide-react"
import type { CartItem, BookType, StoreBookType } from "../types"
import axios from "axios"
import { useWallet } from "@/context/WalletContext"
import { toast } from "sonner"

// Sample store books data
const sampleStoreBooks: StoreBookType[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    coverUrl: "/placeholder.svg?height=250&width=180",
    year: 1925,
    genre: "Classic",
    price: 12.99,
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    coverUrl: "/placeholder.svg?height=250&width=180",
    year: 1960,
    genre: "Fiction",
    price: 14.99,
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    coverUrl: "/placeholder.svg?height=250&width=180",
    year: 1949,
    genre: "Dystopian",
    price: 11.99,
  },
  {
    id: "4",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    coverUrl: "/placeholder.svg?height=250&width=180",
    year: 1937,
    genre: "Fantasy",
    price: 15.99,
  },
  {
    id: "5",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    coverUrl: "/placeholder.svg?height=250&width=180",
    year: 1813,
    genre: "Romance",
    price: 9.99,
  },
  {
    id: "6",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    coverUrl: "/placeholder.svg?height=250&width=180",
    year: 1951,
    genre: "Coming-of-age",
    price: 13.99,
  },
]

// Sample collection books data
const sampleCollectionBooks: BookType[] = [
  {
    id: "101",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    coverUrl: "/placeholder.svg?height=250&width=180",
    year: 1997,
    genre: "Fantasy",
  },
  {
    id: "102",
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    coverUrl: "/placeholder.svg?height=250&width=180",
    year: 1954,
    genre: "Fantasy",
  },
  {
    id: "103",
    title: "Dune",
    author: "Frank Herbert",
    coverUrl: "/placeholder.svg?height=250&width=180",
    year: 1965,
    genre: "Science Fiction",
  },
]

function BookPage() {
  const [activeView, setActiveView] = useState<"collection" | "store">("collection")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [collectionBooks, setCollectionBooks] = useState<BookType[]>(sampleCollectionBooks)
  const [storeBooks, setStoreBooks] = useState<StoreBookType[]>(sampleStoreBooks)
  const [purchasedBooks, setPurchasedBooks] = useState<StoreBookType[]>([])

  const { account } = useWallet();

  useEffect(() => {
    const getBooksCollection = async () => {
      try {
        if (!account) {
          toast.error("Connect wallet");
          return;
        }
        const response = await axios.get('/api/users/purchased', {
          params: { address: account }
        })

        if (response.data.error) {
          toast.error(response.data.error)
        } else {
          setCollectionBooks(response.data)
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.error)
        } else {
          toast.error("An error occurred while getting books collection. Please try again.")
        }
      }
    }

    const getStoreBooks = async () => {
      try {
        const response = await axios.get('/api/books/allbooks')
        if (response.data.error) {
          toast.error(response.data.error)
        } else {
          const filtered = response.data.filter((storeBook: StoreBookType) =>
            !collectionBooks.some((colBook) => colBook.id === storeBook.id)
          );
          setStoreBooks(filtered);
        }

      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.error)
        } else {
          toast.error("An error occurred while getting books collection. Please try again.")
        }
      }
    }

    getBooksCollection().then(getStoreBooks);

  }, [account])


  // Cart functions
  const addToCart = (book: StoreBookType) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.book.id === book.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        return [...prevCart, { book, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (bookId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.book.id !== bookId))
  }

  const updateQuantity = (bookId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.book.id === bookId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  const cartTotal = cart.reduce((total, item) => total + item.book.price * item.quantity, 0)
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0)

  // Handle completed purchase
  const handlePurchaseComplete = (purchasedItems: CartItem[]) => {
    // Add purchased books to purchasedBooks state
    const newPurchasedBooks = purchasedItems.map((item) => item.book)
    setPurchasedBooks((prev) => [...prev, ...newPurchasedBooks])

    // Clear cart
    setCart([])
  }

  // Add a purchased book to collection
  const addToCollection = (book: StoreBookType) => {
    const newCollectionBook: BookType = {
      ...book,
    }

    // Check if book already exists in collection
    if (!collectionBooks.some((b) => b.id === book.id)) {
      setCollectionBooks((prev) => [...prev, newCollectionBook])

      // Remove from purchased books
      setPurchasedBooks((prev) => prev.filter((b) => b.id !== book.id))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between my-3">
        <div className="flex items-center gap-6">
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "collection" | "store")}>
            <TabsList>
              <TabsTrigger value="collection" className="flex items-center gap-1 cursor-pointer">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">My Collection</span>
              </TabsTrigger>
              <TabsTrigger value="store" className="flex items-center gap-1 cursor-pointer">
                <BookMarked className="h-4 w-4" />
                <span className="hidden sm:inline">Book Store</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(!isCartOpen)}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[1.25rem] min-h-[1.25rem] flex items-center justify-center">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-80 z-50">
                <CartComponent
                  cart={cart}
                  total={cartTotal}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                  onClose={() => setIsCartOpen(false)}
                  onPurchaseComplete={handlePurchaseComplete}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <main>
        {activeView === "collection" ? (
          <CollectionView books={collectionBooks} purchasedBooks={purchasedBooks} addToCollection={addToCollection} />
        ) : (
          <StoreView books={storeBooks} addToCart={addToCart} />
        )}
      </main>

      {/* <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} BookShelf. All rights reserved.
        </div>
      </footer> */}
    </div>
  )
}

export default BookPage
