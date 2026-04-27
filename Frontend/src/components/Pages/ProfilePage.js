"use client";
import { useState, useEffect } from "react";
import { getMyBorrows } from "@/services/api";

export default function ProfilePage({ user }) {
  const [stats, setStats] = useState({
    totalRead: 0,
    currentlyReading: 0,
    wishlistCount: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get borrowed books count
      const borrowResponse = await getMyBorrows();
      const activeBorrows = borrowResponse.data.filter(b => b.status === 'active');
      
      // Get wishlist count
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      
      setStats({
        totalRead: borrowResponse.data.length,
        currentlyReading: activeBorrows.length,
        wishlistCount: wishlist.length
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="text-6xl mb-4">👤</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Please Login</h3>
        <p className="text-gray-500">Login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">👤 Profile</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center text-4xl">
            👤
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-gray-400 text-sm capitalize">Role: {user.role}</p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-teal-700">{stats.totalRead}</p>
              <p className="text-sm text-gray-500">Books Borrowed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-700">{stats.currentlyReading}</p>
              <p className="text-sm text-gray-500">Currently Reading</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-700">{stats.wishlistCount}</p>
              <p className="text-sm text-gray-500">Wishlist</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Reading Stats</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Reading Goal (2024)</span>
              <span>{stats.totalRead}/20 books</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-teal-600 h-2 rounded-full" 
                style={{ width: `${Math.min((stats.totalRead / 20) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}