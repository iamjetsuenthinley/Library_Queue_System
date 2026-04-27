"use client";
import { useState, useEffect } from "react";

export default function WishlistPage({ onBookClick }) {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Remove from wishlist
  const removeFromWishlist = (bookId, e) => {
    e.stopPropagation();
    const updatedWishlist = wishlist.filter(book => book.id !== bookId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  // Clear entire wishlist
  const clearWishlist = () => {
    if (confirm("Are you sure you want to clear your entire wishlist?")) {
      setWishlist([]);
      localStorage.setItem("wishlist", JSON.stringify([]));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">❤️ Wishlist</h2>
          <p className="text-gray-500 mt-1">
            {wishlist.length} book{wishlist.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        
        {wishlist.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Wishlist Books Grid */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {wishlist.map((book) => (
            <div
              key={book.id}
              className="bg-white p-3 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 relative"
              onClick={() => onBookClick(book)}
            >
              {/* Remove button */}
              <button
                onClick={(e) => removeFromWishlist(book.id, e)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
              >
                ✕
              </button>
              
              <img
                src={book.img}
                alt={book.title}
                className="rounded-md mb-2 group-hover:scale-105 transition-transform duration-200 w-full h-[140px] object-cover"
              />
              <p className="text-sm font-medium truncate mt-2 text-gray-800">{book.title}</p>
              <p className="text-xs text-gray-500 truncate">{book.author}</p>
              <p className="text-xs text-teal-600 mt-1">{book.year}</p>
            </div>
          ))}
        </div>
      ) : (
        // Empty state
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-4">Add books from the Home or Search page</p>
        </div>
      )}
    </div>
  );
}