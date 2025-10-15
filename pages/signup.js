"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("https://trendex-eight.vercel.app/api/signup", { name, email, password });

      if (res.status === 201 || res.status === 200) {
        toast.success("User registered successfully 🎉");
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h1>

        <motion.form onSubmit={submitHandler} className="space-y-4">
          {/* Name */}
          <motion.input
            value={name}
            onChange={(e) => setName(e.target.value)}
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="Full Name"
            className="w-full px-3 py-2 rounded-lg outline-none bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-400 transition duration-300"
          />

          {/* Email */}
          <motion.input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            whileFocus={{ scale: 1.02 }}
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 rounded-lg outline-none bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-400 transition duration-300"
          />

          {/* Password */}
          <motion.input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            whileFocus={{ scale: 1.02 }}
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 rounded-lg outline-none bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-400 transition duration-300"
          />

          {/* Submit Button with Toast */}
          <div className="flex items-center gap-3 mt-2">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="flex-1 bg-pink-500 hover:bg-pink-600 cursor-pointer text-white py-3 rounded-lg transition duration-300 shadow-md disabled:opacity-50"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </motion.button>

            {/* ToastContainer next to button */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              closeOnClick
              pauseOnHover
              draggable
              theme="light"
            />
          </div>
        </motion.form>

        {/* Login Option */}
        <p className="mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-pink-500 hover:text-pink-600 font-semibold"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
