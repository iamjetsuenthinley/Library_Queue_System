"use client";
import { useState, useEffect } from "react";
import { getBooks } from "@/services/api";

export default function SearchPage({ onBookClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response.data);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-20">Loading books...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🔍 Search Books</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center bg-gray-50 px-4 py-3 rounded-full w-full shadow-sm border border-gray-200 mb-6">
          <span className="text-gray-400 mr-2">🔍</span>
          <input
            className="outline-none w-full text-sm text-gray-700 bg-transparent"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          )}
        </div>
        
        {searchTerm && (
          <>
            <p className="text-gray-600 mb-4">Found {filteredBooks.length} result(s)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white p-3 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                  onClick={() => onBookClick(book)}
                >
                  <img
                    src={book.img}
                    alt={book.title}
                    className="rounded-md mb-2 w-full h-[140px] object-cover"
                  />
                  <p className="text-sm font-medium truncate">{book.title}</p>
                  <p className="text-xs text-gray-500">{book.author}</p>
                </div>
              ))}
            </div>
          </>
        )}
        
        {!searchTerm && (
          <p className="text-gray-400 text-center py-8">Start typing to search for books...</p>
        )}
      </div>
    </div>
  );
}