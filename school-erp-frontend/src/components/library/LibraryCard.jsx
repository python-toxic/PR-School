import { Card, CardContent } from "../ui/card.jsx";
import { Button } from "../ui/button.jsx";
import { Badge } from "../ui/badge.jsx";

export default function BookCard({ book, onBorrow }) {
  return (
    <Card className="hover:shadow-lg transition">
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-lg">{book.title}</h3>
        <p className="text-sm text-muted-foreground">
          Author: {book.author}
        </p>

        <Badge variant="outline">{book.category}</Badge>

        <div className="flex justify-between items-center pt-2">
          <span
            className={`text-sm font-medium ${
              book.available ? "text-green-600" : "text-red-500"
            }`}
          >
            {book.available ? "Available" : "Not Available"}
          </span>

          <Button
            size="sm"
            disabled={!book.available}
            onClick={() => onBorrow(book)}
          >
            Borrow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
