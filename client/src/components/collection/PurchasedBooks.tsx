import type { StoreBookType } from "../../types"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Star, PlusCircle } from "lucide-react"

interface PurchasedBooksProps {
  books: StoreBookType[]
  addToCollection: (book: StoreBookType) => void
}

export function PurchasedBooks({ books, addToCollection }: PurchasedBooksProps) {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        These are books you've recently purchased. Add them to your collection to track your reading progress.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <Card key={book.id} className="overflow-hidden h-full flex flex-col">
            <div className="relative pt-4 px-4">
              <img
                src={book.coverUrl || "/placeholder.svg"}
                alt={`Cover of ${book.title}`}
                className="w-full h-[250px] object-cover rounded-md"
              />
              <Badge className="absolute top-6 right-6">{book.genre}</Badge>
            </div>
            <CardContent className="pt-4 flex-grow">
              <h3 className="font-semibold text-lg line-clamp-1">{book.title}</h3>
              <p className="text-muted-foreground">{book.author}</p>
              <p className="text-sm text-muted-foreground">{book.year}</p>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between items-center">
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => addToCollection(book)}
              >
                <PlusCircle className="h-4 w-4" />
                Add to Collection
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}