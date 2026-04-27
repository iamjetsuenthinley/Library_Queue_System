"use client";
import { useState, useEffect } from "react";
import { getBooks } from "@/services/api";

export default function HomePage({ onBookClick }) {
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

  // Get first 5 books for new arrivals
  const newArrivals = books.slice(0, 5);
  
  // Create rows for top picks (5 rows of 10 books each)
  const rows = Array.from({ length: 5 }, (_, rowIndex) => ({
    id: rowIndex,
    title: `Row ${rowIndex + 1}`,
    books: books.slice(rowIndex * 10, (rowIndex + 1) * 10),
  }));

  if (loading) {
    return <div className="text-center py-20">Loading books...</div>;
  }

  return (
    <>
      {/* Quote + New Arrivals Banner */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Quote Section */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white p-6 rounded-xl col-span-2 shadow-lg">
          <h3 className="font-semibold mb-2 text-lg">Today's Quote</h3>
          <p className="text-sm mb-4 italic">
            "There is more treasure in books than in all the pirate's loot on Treasure Island."
          </p>
          <p className="text-right text-sm">- Walt Disney</p>
        </div>

        {/* New Arrivals Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-teal-700 px-4 py-3">
            <h3 className="font-semibold text-white">New Arrivals 🔥</h3>
          </div>
          <div className="p-4">
            <div className="flex gap-3 overflow-x-auto">
              {newArrivals.map((book) => (
                <div
                  key={book.id}
                  className="cursor-pointer flex-shrink-0"
                  onClick={() => onBookClick(book)}
                >
                  <img
                    src={book.img}
                    alt={book.title}
                    className="rounded-md hover:scale-105 transition-transform duration-200 w-20 h-28 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Picks Section */}
      <div className="space-y-8">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold text-teal-700">⭐ Top Picks</h2>
        </div>
        
        {rows.map((row) => (
          <section key={row.id}>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
              {row.books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white p-3 rounded-lg shadow-sm min-w-[140px] hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => onBookClick(book)}
                >
                  <img
                    src={book.img}
                    alt={book.title}
                    className="rounded-md mb-2 group-hover:scale-105 transition-transform duration-200 w-full h-[140px] object-cover"
                  />
                  <p className="text-sm font-medium truncate mt-2">{book.title}</p>
                  <p className="text-xs text-gray-500">{book.author}</p>
                  <p className="text-xs text-teal-600 mt-1">{book.year}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}