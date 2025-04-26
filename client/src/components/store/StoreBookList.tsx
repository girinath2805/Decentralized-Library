import type { StoreBookType } from "../../types";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface StoreBookListProps {
  books: StoreBookType[];
  onPurchase: (book: StoreBookType) => void;
}

export function StoreBookList({ books, onPurchase }: StoreBookListProps) {
  return (
    <div className="space-y-4">
      {books.map((book) => (
        <Card key={book.id}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <img
                src={"/cover.webp"}
                alt={`Cover of ${book.title}`}
                className="w-auto h-[150px] object-cover rounded-md"
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
                <div className="flex items-center justify-end mt-2">
                  <div className="flex items-center gap-4">
                    <div className="font-medium">
                      {(book.price / 1e8).toFixed(2)} HBAR
                    </div>
                    <Button size="sm" onClick={() => onPurchase(book)}>
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
