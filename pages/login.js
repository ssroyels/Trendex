"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/login", { email, password });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user",JSON.stringify(res.data.user))
        toast.success("Login successful 🎉");
        setEmail("");
        setPassword("");
        setTimeout(() => router.push("/"), 1500); // redirect after toast
      }
    } catch (err) {
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
    <div className=" flex items-center justify-center h-screen bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className=" bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Login</h1>

        <form onSubmit={submitHandler} className="space-y-4">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 rounded-lg outline-none bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-400 transition duration-300"
          />

          <motion.input
            whileFocus={{ scale: 1.02 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 rounded-lg outline-none bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-400 transition duration-300"
          />

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: !loading ? 1.05 : 1 }}
            whileTap={{ scale: !loading ? 0.95 : 1 }}
            className={`w-full py-3 rounded-lg cursor-pointer transition duration-300 shadow-lg ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600 text-white"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </motion.button>

          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="light"
          />
        </form>

        <p className="mt-6 text-gray-400 text-sm">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-pink-400 hover:text-pink-500 font-semibold"
          >
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

