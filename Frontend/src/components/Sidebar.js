export default function Sidebar({ activePage, setActivePage, user, setShowLogin, setShowRegister, setUser }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    alert("Logged out");
  };

  return (
    <aside className="w-64 bg-white p-6 shadow-md flex flex-col justify-between fixed h-screen overflow-y-auto">
      <div>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
            📚
          </div>
          <h1 className="text-2xl font-bold text-teal-800">BookFlow</h1>
        </div>

        {user && (
          <div className="mb-6 p-3 bg-teal-50 rounded-lg">
            <p className="text-sm font-semibold text-teal-700">👤 {user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
        )}

        <nav className="space-y-6 text-gray-800 text-lg">
          <p onClick={() => setActivePage("home")} className={`cursor-pointer transition-colors ${activePage === "home" ? "text-teal-700 font-semibold" : "hover:text-teal-700"}`}>
            🏠 Home
          </p>
          <p onClick={() => setActivePage("search")} className={`cursor-pointer transition-colors ${activePage === "search" ? "text-teal-700 font-semibold" : "hover:text-teal-700"}`}>
            🔍 Search
          </p>
          
          {user && (
            <>
              <p onClick={() => setActivePage("myshelf")} className={`cursor-pointer transition-colors ${activePage === "myshelf" ? "text-teal-700 font-semibold" : "hover:text-teal-700"}`}>
                📚 My Shelf
              </p>
              <p onClick={() => setActivePage("wishlist")} className={`cursor-pointer transition-colors ${activePage === "wishlist" ? "text-teal-700 font-semibold" : "hover:text-teal-700"}`}>
                ❤️ Wishlist
              </p>
              <p onClick={() => setActivePage("profile")} className={`cursor-pointer transition-colors ${activePage === "profile" ? "text-teal-700 font-semibold" : "hover:text-teal-700"}`}>
                👤 Profile
              </p>
              
              {/* Admin Dashboard - Only for librarians */}
              {user.role === "librarian" && (
                <p onClick={() => setActivePage("admin")} className={`cursor-pointer transition-colors ${activePage === "admin" ? "text-teal-700 font-semibold" : "hover:text-teal-700"}`}>
                  👑 Dashboard
                </p>
              )}
            </>
          )}
        </nav>
      </div>

      <div className="text-sm text-gray-500 space-y-2">
        {!user ? (
          <>
            <button onClick={() => setShowLogin(true)} className="w-full bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800 transition-all duration-300 font-medium mb-2">
              Log in
            </button>
            <button onClick={() => setShowRegister(true)} className="w-full border-2 border-teal-700 text-teal-700 py-2 rounded-lg hover:bg-teal-50 transition-all duration-300 font-medium">
              Sign up
            </button>
          </>
        ) : (
          <button onClick={handleLogout} className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all duration-300 font-medium">
            🚪 Logout
          </button>
        )}
      </div>
    </aside>
  );
}