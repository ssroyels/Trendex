"use client";
import React, { useEffect, useState } from "react";
import {
  FiMail,
  FiUser,
  FiHash,
  FiLogOut,
  FiEdit,
  FiSettings,
  FiPackage,
  FiMapPin,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

// --- Mock Data ---
const defaultUser = {
  id: "U12345",
  name: "Guest User",
  email: "guest@example.com",
  profilePicUrl: "https://i.pravatar.cc/150?img=3",
};

// --- Subcomponent: InfoCard (Slightly modified) ---
const InfoCard = ({ icon, label, value }) => (
  <div className="flex items-center p-4 bg-white rounded-xl border border-gray-100 shadow-md transition-all duration-300 hover:shadow-lg">
    <div className="p-3 bg-gradient-to-tr from-pink-100 to-purple-100 rounded-lg mr-4 text-pink-600 text-2xl">
      {icon}
    </div>
    <div>
      <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
        {label}
      </p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

// --- Subcomponent: AccountLinkCard (New Component) ---
const AccountLinkCard = ({ icon, label, href, onClick }) => (
  <Link href={href || "#"} legacyBehavior>
    <a
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border border-gray-100 hover:bg-pink-50 hover:border-pink-300 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-center">
        <div className="text-2xl text-purple-600 group-hover:text-pink-600 transition-colors mr-4">
          {icon}
        </div>
        <p className="text-base font-semibold text-gray-800 group-hover:text-gray-900">
          {label}
        </p>
      </div>
      <svg
        className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-transform duration-300 transform group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 5l7 7-7 7"
        ></path>
      </svg>
    </a>
  </Link>
);


// --- Main Component ---
const MyAccount = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Merge stored user data with defaults, ensuring profilePicUrl is available
        setUser({ ...defaultUser, ...parsedUser });
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        setUser(defaultUser);
      }
    } else {
      // If no stored user, set to null to trigger the "Access Denied" view
      setUser(null); 
    }
    setLoading(false);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("👋 You have been successfully signed out!", {
        position: "top-center",
        autoClose: 2000,
    });
    // Add a slight delay before redirecting if this were a real app
    // setTimeout(() => router.push('/login'), 2000); 
  };

  const handleEditProfile = () => {
    toast.info("⚙️ Redirecting to Edit Profile (Mock Functionality)", {
        position: "top-center",
        autoClose: 2000,
    });
    // Implement actual form/modal logic here
  };


  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-pink-100 to-purple-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-pink-600 border-r-4"></div>
        <p className="mt-4 text-xl text-pink-700 font-semibold">Loading Dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-4">
        <ToastContainer position="top-center" autoClose={3000} newestOnTop />
        <div className="text-center bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-pink-200 w-full max-w-sm">
          <p className="text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Access Denied 🚫
          </p>
          <p className="text-gray-700 mb-6 font-medium">
            Please log in to view your account dashboard and personal details.
          </p>
          <button
            onClick={() => toast.info("Redirecting to login page...", { autoClose: 1500 })}
            className="w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-[1.02]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const { name, email, id, profilePicUrl } = user;

  return (
    <div className="min-h-screen flex justify-center items-start pt-16 pb-12 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4 sm:p-8">
      <ToastContainer position="top-center" autoClose={3000} newestOnTop />
      
      <div className="max-w-4xl w-full grid md:grid-cols-3 gap-8">

        {/* --- Column 1: Profile Summary and Actions --- */}
        <div className="md:col-span-1 bg-white p-6 rounded-3xl shadow-xl border border-pink-100 sticky top-4 self-start">
          
          <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-900">
            My Dashboard
          </h1>
          
          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <img
                src={profilePicUrl || defaultUser.profilePicUrl}
                alt={name || "User"}
                className="w-28 h-28 object-cover rounded-full ring-4 ring-pink-400 shadow-xl group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultUser.profilePicUrl;
                }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-center text-gray-900 mb-1">
            {name || "User"}
          </h2>
          <p className="text-sm text-center text-gray-600 mb-6">{email}</p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleEditProfile}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-purple-500 text-white font-semibold rounded-xl shadow-md hover:bg-purple-600 hover:scale-[1.01] transition-all duration-300"
            >
              <FiEdit className="text-lg" />
              Edit Profile
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-200 text-red-600 font-semibold rounded-xl shadow-md hover:bg-gray-300 hover:scale-[1.01] transition-all duration-300"
            >
              <FiLogOut className="text-lg" />
              Sign Out
            </button>
          </div>
        </div>

        {/* --- Column 2 & 3: Details and Navigation --- */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Section 1: Personal Information */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-purple-100">
            <h2 className="text-2xl font-bold mb-4 text-purple-700 border-b pb-2">
                Personal Information
            </h2>
            <div className="space-y-4">
              <InfoCard icon={<FiUser />} label="Full Name" value={`${name} 👋`} />
              <InfoCard icon={<FiMail />} label="Email Address" value={email} />
              <InfoCard icon={<FiHash />} label="User ID" value={id} />
            </div>
          </div>

          {/* Section 2: Account Navigation/Settings */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-pink-100">
            <h2 className="text-2xl font-bold mb-4 text-pink-700 border-b pb-2">
                Account Navigation
            </h2>
            <div className="space-y-4">
              <AccountLinkCard icon={<FiPackage />} label="My Orders" href="/orders" />
              <AccountLinkCard icon={<FiMapPin />} label="Addresses" href="/addresses" />
              <AccountLinkCard icon={<FiSettings />} label="Account Settings" href="/settings" />
              <AccountLinkCard icon={<FiLogOut />} label="Sign Out Now" onClick={handleSignOut} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


export default MyAccount;
