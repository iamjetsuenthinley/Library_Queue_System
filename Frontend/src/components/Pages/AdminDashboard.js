"use client";
import { useState, useEffect } from "react";
import { getBooks, addBook, getPendingRequests, approveRequest, deleteBook } from "@/services/api";

export default function AdminDashboard({ user, activeTab: propActiveTab }) {
  const [activeTab, setActiveTab] = useState(propActiveTab || "dashboard");
  const [books, setBooks] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    issuedBooks: 0,
    dueToday: 0,
    overdue: 0,
    totalBooks: 0,
    totalStudents: 0,
    totalStaff: 0
  });

  // Add book form
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    img: "",
    description: "",
    year: new Date().getFullYear()
  });

  // Update activeTab when prop changes
  useEffect(() => {
    if (propActiveTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load books
      const booksRes = await getBooks();
      setBooks(booksRes.data);

      // Mock borrowed books (replace with actual API)
      const mockBorrowed = [
        { id: 1, student_id: "STU001", student_name: "John Doe", book_name: "The Great Gatsby", issued_date: "2026-04-20", deadline: "2026-05-04", status: "active" },
        { id: 2, student_id: "STU002", student_name: "Jane Smith", book_name: "1984", issued_date: "2026-04-25", deadline: "2026-05-09", status: "active" },
        { id: 3, student_id: "STU003", student_name: "Mike Johnson", book_name: "To Kill a Mockingbird", issued_date: "2026-04-10", deadline: "2026-04-24", status: "overdue" },
      ];
      setBorrowedBooks(mockBorrowed);

      // Mock users
      const mockUsers = [
        { id: 1, name: "Admin User", email: "admin@library.com", role: "librarian", reg_no: "ADM001", joined: "2024-01-15" },
        { id: 2, name: "John Student", email: "john@test.com", role: "student", reg_no: "STU001", joined: "2024-04-20" },
        { id: 3, name: "Jane Smith", email: "jane@test.com", role: "student", reg_no: "STU002", joined: "2024-04-21" },
      ];
      setUsers(mockUsers);

      // Load pending requests
      try {
        const requestsRes = await getPendingRequests();
        setPendingRequests(requestsRes.data || []);
      } catch (e) {
        setPendingRequests([]);
      }

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const dueTodayCount = mockBorrowed.filter(b => b.deadline === today).length;
      const overdueCount = mockBorrowed.filter(b => b.deadline < today).length;

      setStats({
        issuedBooks: mockBorrowed.length,
        dueToday: dueTodayCount,
        overdue: overdueCount,
        totalBooks: booksRes.data.length,
        totalStudents: mockUsers.filter(u => u.role === "student").length,
        totalStaff: mockUsers.filter(u => u.role === "librarian").length
      });

    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await addBook(newBook);
      alert("✅ Book added successfully!");
      setNewBook({ title: "", author: "", img: "", description: "", year: new Date().getFullYear() });
      loadAllData();
      setActiveTab("books");
    } catch (error) {
      alert("❌ Failed to add book: " + error.response?.data?.error);
    }
  };

  const handleApproveRequest = async (requestId, bookId) => {
    try {
      await approveRequest(requestId);
      alert("✅ Book request approved!");
      loadAllData();
    } catch (error) {
      alert("❌ Failed to approve: " + error.response?.data?.error);
    }
  };

  const handleReturnBook = (bookId) => {
    alert("✅ Book returned successfully!");
    setBorrowedBooks(borrowedBooks.filter(b => b.id !== bookId));
  };

  if (user?.role !== "librarian") {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="text-6xl mb-4">⛔</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h3>
        <p className="text-gray-500">Only librarians can access the Admin Dashboard.</p>
      </div>
    );
  }
  const handleDeleteBook = async (bookId, bookTitle) => {
  if (confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
    try {
      // Call your delete API (you need to create this endpoint)
      await deleteBook(bookId);
      alert("✅ Book deleted successfully!");
      loadAllData(); // Refresh the list
    } catch (error) {
      alert("❌ Failed to delete book: " + error.response?.data?.error);
    }
  }
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">👑 Admin Dashboard</h2>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">{new Date().toLocaleDateString()}</p>
        </div>
      </div>
      

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white border-l-4 border-teal-600 rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-teal-700">{stats.issuedBooks}</p>
          <p className="text-xs text-gray-500">Issued Books</p>
        </div>
        <div className="bg-white border-l-4 border-orange-500 rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-orange-600">{stats.dueToday}</p>
          <p className="text-xs text-gray-500">Due Today</p>
        </div>
        <div className="bg-white border-l-4 border-red-500 rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
          <p className="text-xs text-gray-500">Overdue</p>
        </div>
        <div className="bg-white border-l-4 border-blue-500 rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-blue-700">{stats.totalBooks}</p>
          <p className="text-xs text-gray-500">Total Books</p>
        </div>
        <div className="bg-white border-l-4 border-green-500 rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-green-700">{stats.totalStudents}</p>
          <p className="text-xs text-gray-500">Students</p>
        </div>
        <div className="bg-white border-l-4 border-purple-500 rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-purple-700">{stats.totalStaff}</p>
          <p className="text-xs text-gray-500">Staff</p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-wrap gap-1 p-3 bg-gray-50 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "dashboard" ? "bg-teal-700 text-white" : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab("issued")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "issued" ? "bg-teal-700 text-white" : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            📚 Issued Books
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "requests" ? "bg-teal-700 text-white" : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            ⏳ Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab("books")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "books" ? "bg-teal-700 text-white" : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            📖 Books
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "users" ? "bg-teal-700 text-white" : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            👥 Users
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "add" ? "bg-teal-700 text-white" : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            ➕ Add Book
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "dashboard" && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Borrowing Activity</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Student ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Book Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Issued Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Deadline</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {borrowedBooks.slice(0, 5).map((borrow) => (
                    <tr key={borrow.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{borrow.student_id}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{borrow.book_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{borrow.issued_date}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{borrow.deadline}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          borrow.deadline < new Date().toISOString().split('T')[0] 
                            ? "bg-red-100 text-red-700" 
                            : "bg-green-100 text-green-700"
                        }`}>
                          {borrow.deadline < new Date().toISOString().split('T')[0] ? "Overdue" : "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Issued Books Tab */}
        {activeTab === "issued" && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 All Issued Books</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Student ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Student Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Book Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Issued Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Deadline</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {borrowedBooks.map((borrow) => (
                    <tr key={borrow.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{borrow.student_id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{borrow.student_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{borrow.book_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{borrow.issued_date}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{borrow.deadline}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">Active</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleReturnBook(borrow.id)} className="text-teal-600 hover:text-teal-800 text-sm">
                          Return
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pending Requests Tab */}
        {activeTab === "requests" && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">⏳ Pending Borrow Requests</h3>
            {pendingRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending requests</p>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <img src={req.img} className="w-12 h-16 rounded object-cover" />
                      <div>
                        <p className="font-semibold">{req.book_title}</p>
                        <p className="text-sm text-gray-500">Requested by: {req.user_name}</p>
                        <p className="text-xs text-gray-400">{new Date(req.request_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button onClick={() => handleApproveRequest(req.id, req.book_id)} className="bg-teal-700 text-white px-4 py-2 rounded-lg">
                      ✅ Approve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Books Tab */}
        {/* Books Tab */}
{activeTab === "books" && (
  <div className="p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800">📚 Library Inventory</h3>
      <button
        onClick={() => setActiveTab("add")}
        className="bg-teal-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-800"
      >
        ➕ Add New Book
      </button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {books.map((book) => (
        <div key={book.id} className="bg-white border rounded-lg p-3 hover:shadow-lg transition relative group">
          <button
            onClick={() => handleDeleteBook(book.id, book.title)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
          >
            ✕
          </button>
          <img src={book.img} className="w-full h-32 object-cover rounded-md mb-2" />
          <p className="font-medium text-sm truncate">{book.title}</p>
          <p className="text-xs text-gray-500">{book.author}</p>
          <p className="text-xs text-teal-600">{book.year}</p>
        </div>
      ))}
    </div>
  </div>
)}
        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">👥 Registered Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Reg No.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{u.reg_no}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{u.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${u.role === "librarian" ? "bg-teal-100 text-teal-700" : "bg-blue-100 text-blue-700"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{u.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Book Tab */}
        {activeTab === "add" && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">➕ Add New Book</h3>
            <form onSubmit={handleAddBook} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Title" value={newBook.title} onChange={(e) => setNewBook({...newBook, title: e.target.value})} className="border rounded-lg px-4 py-2" required />
                <input type="text" placeholder="Author" value={newBook.author} onChange={(e) => setNewBook({...newBook, author: e.target.value})} className="border rounded-lg px-4 py-2" required />
              </div>
              <input type="text" placeholder="Image URL (300x300)" value={newBook.img} onChange={(e) => setNewBook({...newBook, img: e.target.value})} className="border rounded-lg px-4 py-2 w-full" required />
              <textarea placeholder="Description" rows="3" value={newBook.description} onChange={(e) => setNewBook({...newBook, description: e.target.value})} className="border rounded-lg px-4 py-2 w-full" required />
              <input type="number" placeholder="Year" value={newBook.year} onChange={(e) => setNewBook({...newBook, year: parseInt(e.target.value)})} className="border rounded-lg px-4 py-2 w-32" required />
              <button type="submit" className="bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800">➕ Add Book</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}