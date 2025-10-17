"use client";
import React from "react";
import Link from "next/link";
import mongoose from "mongoose";
import Product from "@/models/Product"; // Ensure this path is valid
import { Star, ShoppingCart } from "lucide-react"; // For rating/cart icons

const Hoodies = ({ products }) => {
  return (
    <div className="py-16 px-4 sm:px-6 bg-gray-50 min-h-screen">
      {/* Heading Section */}
      <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-16 text-gray-900 tracking-tight">
        <span className="text-pink-600">Premium</span> Hoodie Collection 🧥
      </h2>

      {/* No Product Section */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 bg-white rounded-xl shadow-lg max-w-lg mx-auto">
          <svg
            className="w-16 h-16 text-pink-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="text-center text-gray-700 text-xl font-medium mb-2">
            Whoops! Inventory is Low.
          </p>
          <p className="text-center text-gray-500 text-lg">
            Sorry, no hoodies are available right now. We're restocking soon!
          </p>
        </div>
      ) : (
        // Product Grid (2 per row on mobile)
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-10 max-w-7xl mx-auto">
          {products.map((product) => {
            const isAvailable = product.color.length > 0 || product.size.length > 0;

            // Random rating for demo
            const rating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1);

            return (
              <div
                key={product._id}
                className={`relative bg-white rounded-xl shadow-md hover:shadow-2xl cursor-pointer transform hover:-translate-y-1 transition-all duration-300 overflow-hidden ${
                  !isAvailable ? "opacity-60 grayscale pointer-events-none" : ""
                }`}
              >
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md">
                  {Math.floor(Math.random() * 25) + 5}% OFF
                </div>

                {/* Product Image */}
                <Link href={`/product/${product.slug}`} legacyBehavior>
                  <div className="relative w-full h-52 sm:h-64 overflow-hidden">
                    <img
                      alt={product.title || "Hoodie"}
                      src={
                        product.img ||
                        "https://codeswear.nyc3.cdn.digitaloceanspaces.com/hoodies/customized-tshirt-white/0.webp"
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {!isAvailable && (
                      <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4 text-center">
                  <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-1">
                    {product.category || "Apparel"}
                  </h3>
                  <h2 className="text-gray-900 font-bold text-base sm:text-lg mb-2 line-clamp-2">
                    {product.title || "Untitled Hoodie"}
                  </h2>

                  {/* Rating */}
                  <div className="flex justify-center items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-600">{rating}</span>
                  </div>

                  {/* Price */}
                  <p className="font-extrabold text-lg sm:text-xl text-pink-600">
                    ₹{product.price?.toFixed(2) ?? "0.00"}
                  </p>

                  {/* Sizes */}
                  <div className="mt-3 flex flex-wrap justify-center gap-1">
                    {(product.size || []).length > 0 ? (
                      product.size.map((size) => (
                        <span
                          key={size}
                          className="px-2 py-0.5 text-xs bg-pink-100 border border-pink-300 rounded-full text-pink-700"
                        >
                          {size}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 italic">
                        Sizes Not Available
                      </span>
                    )}
                  </div>

                  {/* Colors */}
                  <div className="mt-3 flex justify-center gap-2">
                    {(product.color || []).length > 0 ? (
                      product.color.map((color) => (
                        <div key={color} className="relative group">
                          <span
                            className="w-5 h-5 rounded-full border-2 border-white ring-1 ring-gray-300 transition-all hover:ring-pink-400 cursor-pointer block"
                            style={{ backgroundColor: color }}
                          />
                          <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 italic">No colors</span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  {isAvailable && (
                    <button className="mt-4 flex items-center justify-center gap-2 w-full bg-pink-600 text-white font-semibold py-2 rounded-lg hover:bg-pink-700 transition-colors duration-300">
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- Data Fetching ---
export async function getServerSideProps() {
  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    const products = await Product.find({ category: "hoodies" });

    let groupedProducts = {};

    for (let item of products) {
      if (groupedProducts[item.title]) {
        if (item.availableQty > 0) {
          for (let clr of item.color) {
            if (!groupedProducts[item.title].color.includes(clr)) {
              groupedProducts[item.title].color.push(clr);
            }
          }
          for (let sz of item.size) {
            if (!groupedProducts[item.title].size.includes(sz)) {
              groupedProducts[item.title].size.push(sz);
            }
          }
        }
      } else {
        groupedProducts[item.title] = JSON.parse(JSON.stringify(item));
        groupedProducts[item.title].color =
          item.availableQty > 0 ? [...item.color] : [];
        groupedProducts[item.title].size =
          item.availableQty > 0 ? [...item.size] : [];
      }
    }

    return { props: { products: Object.values(groupedProducts) } };
  } catch (error) {
    console.error("Error fetching hoodies:", error);
    return { props: { products: [] } };
  }
}

export default Hoodies;
