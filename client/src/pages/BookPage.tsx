"use client"

import {useState} from "react"
import BookList from "@/components/BookList"
import BookGrid from "@/components/BookGrid"
import SearchFilters from "@/components/SearchFilters"
import Pagination from "@/components/Pagination"
import type { BookType } from "@/types"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from "lucide-react"

// Sample book data
const sampleBooks: BookType[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    coverUrl: "/placeholder.svg?height=250&width=180",
    year: 1925,
    genre: "Classic",
    rating: 4.5,
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    coverUrl: "/placeholder.svg?height=250&width=180",
    year: 1960,
    genre: "Fiction",
    rating: 4.8,
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    coverUrl: "/placeholder.svg?height=250&width=180",
    year: 1949,
    genre: "Dystopian",
    rating: 4.6,
  },
  {
    id: "4",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    coverUrl: "/placeholder.svg?height=250&width=180",
    year: 1937,
    genre: "Fantasy",
    rating: 4.7,
  },
  {
    id: "5",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    coverUrl: "/placeholder.svg?height=250&width=180",
    year: 1813,
    genre: "Romance",
    rating: 4.4,
  },
  {
    id: "6",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    coverUrl: "/placeholder.svg?height=250&width=180",
    year: 1951,
    genre: "Coming-of-age",
    rating: 4.2,
  },
]

function BookPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  // Filter books based on search term and genre
  const filteredBooks = sampleBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = !selectedGenre || book.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  // Get unique genres for filter dropdown
  const genres = Array.from(new Set(sampleBooks.map((book) => book.genre)))

  // Pagination logic
  const booksPerPage = 4
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)
  const currentBooks = filteredBooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage)

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Book Collection</h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <SearchFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
            genres={genres}
          />

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
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No books found. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? <BookGrid books={currentBooks} /> : <BookList books={currentBooks} />}

            <div className="mt-8">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </div>
  )
}

export default BookPage
