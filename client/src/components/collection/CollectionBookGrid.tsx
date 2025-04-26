import type { CollectionBookType } from "../../types"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"

interface CollectionBookGridProps {
  books: CollectionBookType[]
}

export function CollectionBookGrid({ books }: CollectionBookGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <Card key={book.id} className="overflow-hidden h-full flex flex-col cursor-pointer">
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
        </Card>
      ))}
    </div>
  )
}
