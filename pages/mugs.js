"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import mongoose from "mongoose";
import Product from "@/models/Product";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1581382575275-97901c2635a7?q=80&w=2670&auto=format&fit=crop";

const Mugs = ({ products }) => {
  const [cart, setCart] = useState({});

  // Load existing cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Save cart updates to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add to Cart function
  const addToCart = (product) => {
    const id = product._id;
    const updated = {
      ...cart,
      [id]: cart[id]
        ? { ...cart[id], qty: cart[id].qty + 1 }
        : {
            id,
            title: product.title,
            price: product.price,
            img: product.img || DEFAULT_IMAGE,
            qty: 1,
          },
    };
    setCart(updated);
    toast.success(`🛒 ${product.title} added to cart!`, {
      position: "bottom-center",
      autoClose: 1500,
    });
  };

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-4 text-red-500">
          No Mugs Found 😔
        </h2>
        <p className="text-gray-600 text-center">
          Sorry, we’re currently out of stock. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 sm:px-8 bg-gray-50 min-h-screen">
      <ToastContainer />
      <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900 tracking-tight">
        ☕ Premium <span className="text-blue-600">Mug Collection</span>
      </h2>

      {/* ✅ Mobile: 2 per row | Desktop: Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-10 max-w-7xl mx-auto">
        {products.map((product) => {
          const isAvailable = product.color.length > 0 || product.size.length > 0;
          return (
            <div
              key={product._id}
              className={`group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden relative ${
                !isAvailable ? "opacity-50 grayscale" : ""
              }`}
            >
              {/* ✅ Product Image */}
              <div className="relative w-full h-48 sm:h-64 overflow-hidden">
                <Link href={`/product/${product.slug}`} passHref>
                  <img
                    src={product.img || DEFAULT_IMAGE}
                    alt={product.title || "Mug"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>

                {/* Sold Out badge */}
                {!isAvailable && (
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                    Sold Out
                  </span>
                )}

                {/* Desktop hover: View Details */}
                <div className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Link href={`/product/${product.slug}`} passHref>
                    <span className="bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 cursor-pointer">
                      View Details
                    </span>
                  </Link>
                </div>

                {/* ✅ Mobile visible Add to Cart button */}
                <div className="absolute bottom-2 right-2 sm:hidden">
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 text-white p-2 rounded-full shadow-md active:scale-95 transition-transform"
                    aria-label="Add to Cart"
                  >
                    🛒
                  </button>
                </div>
              </div>

              {/* ✅ Product Info */}
              <div className="p-3 sm:p-5 text-center">
                <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                  {product.category || "Beverage Ware"}
                </h3>
                <h2 className="text-lg font-bold text-gray-900 truncate mb-1">
                  {product.title || "Custom Mug"}
                </h2>
                <p className="text-blue-600 font-extrabold text-xl">
                  ₹{product.price?.toFixed(2) ?? "0.00"}
                </p>

                {/* ✅ Sizes (Capacity Info) */}
                <div className="mt-3 flex flex-wrap justify-center gap-1">
                  {product.size?.length > 0 ? (
                    product.size.map((size) => (
                      <span
                        key={size}
                        className="px-2 py-1 text-xs bg-blue-100 border border-blue-300 rounded-full font-medium text-blue-700 hover:bg-blue-200"
                      >
                        {size}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 text-xs bg-gray-100 rounded-full text-gray-500">
                      Capacity N/A
                    </span>
                  )}
                </div>

                {/* ✅ Colors */}
                <div className="mt-3 flex justify-center gap-1.5">
                  {product.color?.length > 0 ? (
                    product.color.map((color) => (
                      <span
                        key={color}
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm transition-transform duration-300 hover:scale-125"
                        style={{
                          backgroundColor: color,
                          outline: `1px solid ${
                            color === "#fff" || color === "white"
                              ? "#9ca3af"
                              : "transparent"
                          }`,
                        }}
                      />
                    ))
                  ) : (
                    <span className="text-xs text-gray-500 italic">
                      No colors
                    </span>
                  )}
                </div>

                {/* ✅ Desktop Add to Cart */}
                <div className="hidden sm:flex justify-center mt-4">
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-md transition-all"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ✅ Server Side Data Fetch
export async function getServerSideProps() {
  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    const products = await Product.find({ category: "mugs" });
    let groupedMugs = {};

    for (let item of products) {
      if (groupedMugs[item.title]) {
        if (item.availableQty > 0) {
          for (let clr of item.color) {
            if (!groupedMugs[item.title].color.includes(clr)) {
              groupedMugs[item.title].color.push(clr);
            }
          }
          for (let sz of item.size) {
            if (!groupedMugs[item.title].size.includes(sz)) {
              groupedMugs[item.title].size.push(sz);
            }
          }
        }
      } else {
        groupedMugs[item.title] = JSON.parse(JSON.stringify(item));
        groupedMugs[item.title].color =
          item.availableQty > 0 ? [...item.color] : [];
        groupedMugs[item.title].size =
          item.availableQty > 0 ? [...item.size] : [];
      }
    }

    return {
      props: { products: Object.values(groupedMugs) },
    };
  } catch (error) {
    console.error("Error fetching mugs:", error);
    return { props: { products: [] } };
  }
}

export default Mugs;
