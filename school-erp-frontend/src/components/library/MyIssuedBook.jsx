import { Card, CardContent } from "../ui/card.jsx";

export default function MyIssuedBook({ issuedBooks }) {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="font-semibold text-lg mb-3">My Issued Books</h2>

        {issuedBooks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No books issued yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {issuedBooks.map((book) => (
              <li key={book.id} className="text-sm">
                📘 {book.title}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
