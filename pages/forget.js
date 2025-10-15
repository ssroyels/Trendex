"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const ForgotPassword = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-pink-900 via-pink-800 to-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-pink-800 p-8 rounded-2xl shadow-2xl w-96 text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-6">Forgot Password</h1>
        <p className="text-gray-300 text-sm mb-6">
          Enter your email address and we’ll send you a reset link.
        </p>

        {/* Email Input */}
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-6 rounded-lg outline-none bg-gray-700 text-white focus:ring-2 focus:ring-pink-500 transition duration-300"
        />

        {/* Reset Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg transition duration-300 shadow-lg"
        >
          Send Reset Link
        </motion.button>

        {/* Back to Login */}
        <p className="mt-6 text-gray-300 text-sm">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="text-pink-300 hover:text-pink-400 font-semibold"
          >
            Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
