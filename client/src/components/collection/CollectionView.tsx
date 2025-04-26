import { useState } from "react"
import { CollectionBookList } from "./CollectionBookList"
import { CollectionBookGrid } from "./CollectionBookGrid"
import SearchFilters from "../SearchFilters"
import Pagination from "../Pagination"
import { Button } from "../ui/button"
import { LayoutGrid, List } from "lucide-react"
import type { BookType, StoreBookType } from "../../types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { PurchasedBooks } from "./PurchasedBooks"

interface CollectionViewProps {
  books: BookType[]
  purchasedBooks: StoreBookType[]
  addToCollection: (book: StoreBookType) => void
}

export function CollectionView({ books, purchasedBooks, addToCollection }: CollectionViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"collection" | "purchased">("collection")

  // Filter books based on search term and genre
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = !selectedGenre || book.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  // Get unique genres for filter dropdown
  const genres = Array.from(new Set(books.map((book) => book.genre)))

  // Pagination logic
  const booksPerPage = 4
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)
  const currentBooks = filteredBooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage)

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "collection" | "purchased")}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">My Books</h1>
            <TabsList>
              <TabsTrigger value="collection">My Collection</TabsTrigger>
              {purchasedBooks.length > 0 && (
                <TabsTrigger value="purchased">
                  Recently Purchased
                  {purchasedBooks.length > 0 && <Badge className="ml-2">{purchasedBooks.length}</Badge>}
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {activeTab === "collection" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">View:</span>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="collection" className="mt-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <SearchFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
              genres={genres}
            />
          </div>

          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No books found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <CollectionBookGrid books={currentBooks} />
              ) : (
                <CollectionBookList books={currentBooks} />
              )}

              <div className="mt-8">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="purchased" className="mt-0">
          {purchasedBooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No recently purchased books.</p>
            </div>
          ) : (
            <PurchasedBooks books={purchasedBooks} addToCollection={addToCollection} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { Badge } from "../ui/badge"
