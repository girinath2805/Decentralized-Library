import type { CollectionBookType } from "../../types"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Star, BookOpen, BookText, CheckCircle } from "lucide-react"

interface CollectionBookListProps {
  books: CollectionBookType[]
}

export function CollectionBookList({ books }: CollectionBookListProps) {
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
                  <p className="text-sm text-muted-foreground">Added: {book.dateAdded}</p>
                  {book.notes && <p className="text-sm mt-2 italic">{book.notes}</p>}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <span>{book.rating.toFixed(1)}</span>
                  </div>
                  <div>
                    {book.readStatus === "unread" && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>Unread</span>
                      </Badge>
                    )}
                    {book.readStatus === "reading" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <BookText className="h-3 w-3" />
                        <span>Reading</span>
                      </Badge>
                    )}
                    {book.readStatus === "completed" && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Completed</span>
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
