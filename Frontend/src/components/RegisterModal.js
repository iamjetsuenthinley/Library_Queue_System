"use client";
import { useState } from "react";
import { register } from "@/services/api";

export default function RegisterModal({ onClose, setUser, onSwitchToLogin }) {
  const [regNo, setRegNo] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }
    
    if (password.length < 6) {
      alert("❌ Password must be at least 6 characters!");
      return;
    }
    
    // Check if user is trying to register as librarian
    let userRole = "student";
    if (showAdminCode) {
      if (adminCode === "ADMIN123") {  // ← Change this to your secret code
        userRole = "librarian";
      } else if (adminCode !== "") {
        alert("❌ Invalid admin code!");
        return;
      }
    }
    
    setLoading(true);
    
    try {
      const response = await register(name, email, password, userRole);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      alert(userRole === "librarian" ? "✅ Registered as Librarian!" : "✅ Registration successful!");
      onClose();
    } catch (error) {
      alert("❌ Registration failed: " + error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* Logo at Top */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 py-6 flex justify-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-4xl">📚</span>
          </div>
        </div>
        
        {/* Header */}
        <div className="text-center mt-6 px-6">
          <h2 className="text-2xl font-bold text-gray-800">Registration</h2>
          <p className="text-gray-500 text-sm mt-1">For Both Staff & Students</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Registration Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reg No. / Id No.</label>
            <input
              type="text"
              placeholder="Enter your registration number"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
            <input
              type="email"
              placeholder="username@institute.edu.bd"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>
          
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="●●●●●●●"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>
          
          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="●●●●●●●"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>
          
          {/* Admin Code Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="adminCheckbox"
              checked={showAdminCode}
              onChange={(e) => {
                setShowAdminCode(e.target.checked);
                if (!e.target.checked) setAdminCode("");
              }}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
            />
            <label htmlFor="adminCheckbox" className="text-sm text-gray-600 cursor-pointer">
              Register as Librarian? (Requires admin code)
            </label>
          </div>
          
          {/* Admin Code Input (shown only if checkbox is checked) */}
          {showAdminCode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Code</label>
              <input
                type="password"
                placeholder="Enter admin code"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">Contact library admin for the code</p>
            </div>
          )}
          
          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 text-white py-3 rounded-full hover:bg-teal-800 transition-all duration-300 font-semibold text-lg mt-4 shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        
        {/* Switch to Login */}
        <div className="text-center pb-6">
          <p className="text-gray-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-teal-700 font-semibold hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}