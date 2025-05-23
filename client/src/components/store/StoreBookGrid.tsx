import type { StoreBookType } from "../../types";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface StoreBookGridProps {
  books: StoreBookType[];
  onPurchase: (book: StoreBookType) => void;
}

export function StoreBookGrid({ books, onPurchase }: StoreBookGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <Card key={book.id} className="overflow-hidden h-full flex flex-col">
          <div className="relative pt-4 px-4">
            <img
              src={"/cover.webp"}
              alt={`Cover of ${book.title}`}
              className="w-full h-fit object-cover rounded-md"
            />
            <Badge className="absolute top-6 right-6">{book.genre}</Badge>
          </div>
          <CardContent className="pt-4 flex-grow">
            <h3 className="font-semibold text-lg line-clamp-1">{book.title}</h3>
            <p className="text-muted-foreground">{book.author}</p>
            <p className="text-sm text-muted-foreground">{book.year}</p>
          </CardContent>
          <CardFooter className="pt-0 flex justify-end items-center">
            <div className="text-right">
              <div className="font-medium mb-1">
                {(book.price / 1e8).toFixed(2)} HBAR
              </div>
              <Button size="sm" onClick={() => onPurchase(book)}>
                Buy Now
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
