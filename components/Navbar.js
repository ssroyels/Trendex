"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Icon Imports ---
import { AiOutlineShoppingCart, AiOutlineCloseCircle } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import { FaCircleMinus } from "react-icons/fa6";
import { IoBagCheck } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { RiTShirt2Line, RiLoginBoxLine, RiCoupon3Line } from "react-icons/ri";

const Navbar = ({ cart, addToCart, removeFromCart, clearCart, subTotal }) => {
  const ref = useRef();
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hideTimeout, setHideTimeout] = useState(null);

  // --- State Initialization ---
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  // --- Handlers ---
  const toggleCart = () => {
    ref.current.classList.toggle("translate-x-full");
    ref.current.classList.toggle("translate-x-0");
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b.qty, 0);

  // Dropdown behavior
  const handleMouseEnter = () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    setShowDropdown(true);
  };
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => setShowDropdown(false), 250);
    setHideTimeout(timeout);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/");
  };

  const isCartEmpty = Object.keys(cart).length === 0;

  // --- Main Render ---
  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      <nav className="flex items-center justify-between py-4 px-4 sm:px-8 max-w-7xl mx-auto">
        
        {/* 🔸 Logo & Brand Name */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Image
              src="/logo_1.png"
              alt="Trendex Logo"
              width={40} // Smaller, sharper logo
              height={35}
              className="object-contain hover:scale-105 transition-transform"
            />
          </Link>
          <Link href="/">
            <span className="hidden sm:inline text-2xl font-extrabold text-teal-600 tracking-wider hover:text-pink-600 transition-colors cursor-pointer">
              TRENDEX
            </span>
          </Link>
        </div>

        {/* 🔸 Primary Nav Links (Desktop) */}
        <ul className="hidden md:flex space-x-8 font-medium text-gray-700">
          {[
            { name: "T-Shirts", path: "/tshirts" },
            { name: "Hoodies", path: "/hoodies" },
            { name: "Mugs", path: "/mugs" },
            { name: "Stickers", path: "/stickers" },
          ].map((item) => (
            <li key={item.name} className="relative group">
              <Link
                href={item.path}
                className="uppercase text-sm hover:text-teal-600 transition-colors tracking-wider"
              >
                {item.name}
              </Link>
              {/* Underline effect */}
              <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-0.5 bg-pink-500 transition-all duration-300"></span>
            </li>
          ))}
        </ul>

        {/* 🔸 Account + Cart Icons */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          
          {/* Account/Login */}
          {token ? (
            <div
              className="relative z-20"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <MdAccountCircle className="text-3xl sm:text-4xl cursor-pointer text-teal-600 hover:text-pink-600 transition-colors duration-200" />
              {/* Dropdown Menu */}
              <div
                className={`absolute right-0 top-12 w-48 bg-white border border-gray-200 shadow-2xl rounded-xl transition-all duration-300 origin-top-right ${
                  showDropdown
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-90 pointer-events-none"
                }`}
              >
                <Link href="/myaccount" passHref>
                  <span className="flex items-center px-4 py-3 hover:bg-pink-50 hover:text-pink-600 font-medium rounded-t-xl transition-colors">
                    <MdAccountCircle className="mr-2" /> My Account
                  </span>
                </Link>
                <Link href="/order" passHref>
                  <span className="flex items-center px-4 py-3 hover:bg-pink-50 hover:text-pink-600 font-medium border-t border-b transition-colors">
                    <RiCoupon3Line className="mr-2" /> Orders History
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-b-xl transition-colors"
                >
                  <RiLoginBoxLine className="inline mr-2" /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-4 py-2 font-bold shadow-lg hover:shadow-xl transition-all text-sm uppercase tracking-wider">
                Login
              </button>
            </Link>
          )}

          {/* Cart Icon */}
          <button onClick={toggleCart} className="relative transition-transform duration-300 hover:scale-105">
            <AiOutlineShoppingCart className="text-3xl sm:text-4xl cursor-pointer text-teal-600 hover:text-pink-600 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-extrabold shadow-lg animate-ping-once">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* 🔸 Mobile Bottom Menu (Footer-like navigation) */}
      <div className="md:hidden flex justify-center border-t border-gray-100 py-3 bg-white fixed bottom-0 left-0 right-0 z-40">
        <div className="flex justify-around w-full max-w-xs text-gray-700 font-medium">
          <Link href="/tshirts" className="hover:text-pink-600 flex flex-col items-center text-xs">
            <RiTShirt2Line className="text-xl mb-1" /> T-Shirts
          </Link>
          <Link href="/hoodies" className="hover:text-pink-600 flex flex-col items-center text-xs">
            <span role="img" aria-label="Hoodies" className="text-xl mb-1">🧥</span> Hoodies
          </Link>
          <Link href="/mugs" className="hover:text-pink-600 flex flex-col items-center text-xs">
            <span role="img" aria-label="Mugs" className="text-xl mb-1">☕</span> Mugs
          </Link>
          <Link href="/stickers" className="hover:text-pink-600 flex flex-col items-center text-xs">
            <span role="img" aria-label="Stickers" className="text-xl mb-1">⭐</span> Stickers
          </Link>
        </div>
      </div>

      {/* 🔸 Sidebar Cart */}
      <aside
        ref={ref}
        className="fixed top-0 right-0 bg-white p-6 transform transition-transform duration-500 ease-in-out translate-x-full w-80 md:w-96 h-screen shadow-2xl z-50 overflow-y-auto flex flex-col"
      >
        <div className="flex justify-between items-center border-b pb-3 mb-6">
          <h2 className="text-2xl font-extrabold text-teal-700">Shopping Bag ({cartCount})</h2>
          <AiOutlineCloseCircle
            onClick={toggleCart}
            className="text-3xl text-pink-600 cursor-pointer hover:text-red-700 transition transform hover:scale-110"
          />
        </div>

        {/* Cart Items List */}
        <div className="flex-grow">
          {isCartEmpty ? (
            <div className="mt-12 text-center text-gray-500 p-4 border border-dashed border-gray-300 rounded-xl">
              <IoBagCheck className="text-5xl mx-auto mb-3 text-pink-400" />
              <p className="text-xl font-semibold">Your bag is empty!</p>
              <p className="text-sm mt-1">Add items to proceed to checkout.</p>
            </div>
          ) : (
            <ol className="space-y-4">
              {Object.keys(cart).map((item) => (
                <li
                  key={item}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3 w-3/5">
                    {/* Item Image */}
                    <img
                      src={cart[item].img || "/placeholder.jpg"}
                      alt={cart[item].name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                    {/* Item Details */}
                    <div className="text-sm font-semibold text-gray-800">
                      <p className="line-clamp-2">{cart[item].name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        <span className="capitalize">{cart[item].size}</span> / <span className="capitalize">{cart[item].varient}</span>
                      </p>
                      <p className="text-pink-600 font-bold mt-1">
                        ₹{cart[item].price}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center text-base">
                    <FaCircleMinus
                      onClick={() =>
                        removeFromCart(item, 1, cart[item].price, cart[item].name, cart[item].size, cart[item].varient, cart[item].img)
                      }
                      className="mx-1 text-2xl cursor-pointer text-pink-600 hover:text-red-700 transition transform hover:scale-110"
                    />
                    <span className="w-6 text-center text-lg font-bold text-gray-800">{cart[item].qty}</span>
                    <FaPlusCircle
                      onClick={() =>
                        addToCart(item, cart[item].img, 1, cart[item].price, cart[item].name, cart[item].size, cart[item].varient)
                      }
                      className="mx-1 text-2xl cursor-pointer text-teal-600 hover:text-green-700 transition transform hover:scale-110"
                    />
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Subtotal & Buttons */}
        <div className="border-t pt-4 mt-6">
          <div className="flex justify-between mb-4 text-xl font-extrabold text-gray-800">
            <span>Subtotal:</span>
            <span className="text-pink-600">₹{subTotal.toFixed(2)}</span>
          </div>

          <div className="flex space-x-3">
            {/* Checkout Button */}
            <Link href="/checkout" className="flex-1">
              <button
                disabled={isCartEmpty}
                onClick={toggleCart}
                className={`flex items-center justify-center px-4 py-3 rounded-xl font-bold w-full transition-all ${
                  isCartEmpty
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-500/50"
                }`}
              >
                <IoBagCheck className="mr-2 text-xl" /> Checkout
              </button>
            </Link>
            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              disabled={isCartEmpty}
              className={`flex items-center justify-center px-4 py-3 rounded-xl font-bold transition-all ${
                isCartEmpty
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/50"
              }`}
            >
              <AiOutlineCloseCircle className="text-xl" />
            </button>
          </div>
        </div>
      </aside>
    </header>
  );
};

export default Navbar;