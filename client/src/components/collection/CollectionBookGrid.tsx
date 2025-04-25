import type { CollectionBookType } from "../../types"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Badge } from "../ui/badge"
import { Star, BookOpen, BookText, CheckCircle } from "lucide-react"

interface CollectionBookGridProps {
  books: CollectionBookType[]
}

export function CollectionBookGrid({ books }: CollectionBookGridProps) {
  return (
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
            {book.notes && <p className="text-sm mt-2 italic line-clamp-2">{book.notes}</p>}
          </CardContent>
          <CardFooter className="pt-0 flex justify-between items-center">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-primary text-primary mr-1" />
              <span>{book.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
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
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
