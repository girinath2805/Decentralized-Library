import type { BookType } from "../types"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Star } from "lucide-react"

interface BookListProps {
  books: BookType[]
}

const BookList = ({ books }: BookListProps) => {
  return (
    <div className="space-y-4">
      {books.map((book) => (
        <Card key={book.id}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
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
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                  <span>{book.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default BookList
