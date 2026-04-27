"use client";
import { useState, useEffect } from "react";
import { requestBorrow } from "@/services/api";

export default function BookModal({ book, onClose, user, setShowLogin }) {
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Check if book is in wishlist
  useEffect(() => {
    if (book) {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setIsInWishlist(wishlist.some(item => item.id === book.id));
    }
  }, [book]);

  // Add to wishlist
  const addToWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    
    if (!isInWishlist) {
      const newWishlist = [...wishlist, book];
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      setIsInWishlist(true);
      alert("✅ Added to wishlist!");
    } else {
      const newWishlist = wishlist.filter(item => item.id !== book.id);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      setIsInWishlist(false);
      alert("❌ Removed from wishlist");
    }
  };

  // Request to borrow
  const handleRequest = async () => {
    if (!user) {
      setShowLogin(true);
      onClose();
      return;
    }
    try {
      await requestBorrow(book.id);
      alert("✅ Borrow request sent to librarian!");
      onClose();
    } catch (error) {
      alert("❌ Request failed: " + error.response?.data?.error);
    }
  };

  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="relative p-6">
          <button onClick={onClose} className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2 shadow-md z-10 transition-colors">
            ✕
          </button>

          <div className="flex gap-6">
            {/* Left Side - Image */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-xl overflow-hidden shadow-lg bg-gray-50">
                <img src={book.img} alt={book.title} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{book.title}</h2>
              <p className="text-teal-600 text-sm mb-3">by {book.author}</p>

              <div className="mb-4">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">📅 {book.year}</span>
              </div>

              <p className="text-gray-600 text-sm mb-6 leading-relaxed">{book.description}</p>

              <div className="flex gap-3">
                <button onClick={handleRequest} className="flex-1 bg-teal-700 text-white px-4 py-2.5 rounded-lg hover:bg-teal-800 transition-all duration-200 text-sm font-medium">
                  📚 Request to Borrow
                </button>
                <button onClick={addToWishlist} className={`flex-1 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isInWishlist ? "bg-red-50 text-red-600 border-2 border-red-300" : "border-2 border-teal-700 text-teal-700 hover:bg-teal-50"
                }`}>
                  {isInWishlist ? "❤️ In Wishlist" : "❤️ Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}