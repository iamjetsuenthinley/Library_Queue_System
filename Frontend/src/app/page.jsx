"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import BookModal from "@/components/BookModal";
import HomePage from "@/components/Pages/HomePage";
import SearchPage from "@/components/Pages/SearchPage";
import MyShelfPage from "@/components/Pages/MyShelfPage";
import WishlistPage from "@/components/Pages/WishlistPage";
import ProfilePage from "@/components/Pages/ProfilePage";
import AdminDashboard from "@/components/Pages/AdminDashboard";
import LoginModal from "@/components/LoginModal";
import RegisterModal from "@/components/RegisterModal";
import { getBooks } from "@/services/api";

export default function Home() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load books and check user on mount
  useEffect(() => {
    loadBooks();
    checkUser();
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

  const checkUser = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const renderPage = () => {
    // Admin Dashboard - Only for librarians
    if (user?.role === "librarian" && activePage === "dashboard") {
      return <AdminDashboard user={user} />;
    }

    // Admin specific pages
    if (user?.role === "librarian") {
      switch (activePage) {
        case "issuedBooks":
          return <AdminDashboard user={user} activeTab="issued" />;
        case "overdue":
          return <AdminDashboard user={user} activeTab="overdue" />;
        case "users":
          return <AdminDashboard user={user} activeTab="users" />;
        case "addBook":
          return <AdminDashboard user={user} activeTab="add" />;
        default:
          return <AdminDashboard user={user} />;
      }
    }

    // Student Pages
    switch (activePage) {
      case "home":
        return <HomePage books={books} onBookClick={handleBookClick} loading={loading} />;
      case "search":
        return <SearchPage books={books} onBookClick={handleBookClick} loading={loading} />;
      case "myshelf":
        return <MyShelfPage onBookClick={handleBookClick} />;
      case "wishlist":
        return <WishlistPage onBookClick={handleBookClick} />;
      case "profile":
        return <ProfilePage user={user} />;
      default:
        return <HomePage books={books} onBookClick={handleBookClick} loading={loading} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage}
        user={user}
        setShowLogin={setShowLogin}
        setShowRegister={setShowRegister}
        setUser={setUser}
      />
      
      <main className="flex-1 ml-64 p-6 overflow-auto">
        {renderPage()}
      </main>

      {/* Book Modal */}
      {showModal && selectedBook && (
        <BookModal 
          book={selectedBook} 
          onClose={() => setShowModal(false)} 
          user={user}
          setShowLogin={setShowLogin}
        />
      )}

      {/* Login Modal */}
      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)}
          setUser={setUser}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {/* Register Modal */}
      {showRegister && (
        <RegisterModal 
          onClose={() => setShowRegister(false)}
          setUser={setUser}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
}