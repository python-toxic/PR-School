import { useState } from "react";
import { libraryBooks } from "../../data/Teacher/library.data.js";
import BookCard from "../../components/library/LibraryCard.jsx";
import LibrarySearch from "../../components/library/LibrarySearch.jsx";
import MyIssuedBooks from "../../components/library/MyIssuedBook.jsx";

export default function TeacherLibraryPage() {
  const [search, setSearch] = useState("");
  const [issuedBooks, setIssuedBooks] = useState([]);

  const filteredBooks = libraryBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleBorrow = (book) => {
    setIssuedBooks((prev) => [...prev, book]);
    alert(`You borrowed "${book.title}"`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Library</h1>

      <LibrarySearch search={search} setSearch={setSearch} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onBorrow={handleBorrow}
          />
        ))}
      </div>

      <MyIssuedBooks issuedBooks={issuedBooks} />
    </div>
  );
}
