"use client";
import React from "react";
import Link from "next/link";
import mongoose from "mongoose";
// Assuming "@/models/Product" is a valid path to your Mongoose model
import Product from "@/models/Product"; 

const Hoodies = ({ products }) => {
  return (
    <div className="py-16 px-6 bg-gray-50 min-h-screen">
      <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-900 tracking-tight">
        <span className="text-pink-600">Premium</span> Hoodie Collection 🧥
      </h2>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 bg-white rounded-xl shadow-lg max-w-lg mx-auto">
          <svg
            className="w-16 h-16 text-pink-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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
            Sorry, no hoodies are available right now. We're restocking soon, please check back!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {products.map((product) => {
            const isAvailable = product.color.length > 0 || product.size.length > 0;
            
            return (
              <Link key={product._id} href={`/product/${product.slug}`} legacyBehavior>
                <div 
                  className={`group bg-white rounded-xl shadow-lg hover:shadow-2xl p-6 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 ${
                    !isAvailable ? 'opacity-50 grayscale pointer-events-none' : ''
                  }`}
                >
                  {/* Product Image */}
                  <div className="relative w-full h-80 overflow-hidden rounded-lg mb-4">
                    <img
                      alt={product.title || "Hoodie"}
                      src={
                        product.img ||
                        "https://codeswear.nyc3.cdn.digitaloceanspaces.com/hoodies/customized-tshirt-white/0.webp"
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Out of Stock Badge */}
                    {!isAvailable && (
                      <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="mt-4 text-center">
                    <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-1">
                      {product.category || "Apparel"}
                    </h3>
                    <h2 className="text-gray-900 font-bold text-xl mb-2 line-clamp-2">
                      {product.title || "Untitled Product"}
                    </h2>
                    
                    <p className="mt-2 font-extrabold text-2xl text-pink-600">
                      ₹{product.price?.toFixed(2) ?? "0.00"}
                    </p>

                    {/* Sizes */}
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {(product.size || []).length > 0 ? (
                        (product.size || []).map((size) => (
                          <span
                            key={size}
                            className="px-3 py-1 text-sm bg-pink-100 border border-pink-300 rounded-full font-medium text-pink-700 hover:bg-pink-200 transition"
                          >
                            {size}
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1 text-sm bg-gray-100 rounded-full font-medium text-gray-500">
                          Sizes Not Available
                        </span>
                      )}
                    </div>

                    {/* Colors with Tooltip */}
                    <div className="mt-4 flex justify-center gap-3">
                      {(product.color || []).length > 0 ? (
                        (product.color || []).map((color) => (
                          <div key={color} className="relative group">
                            <span
                              className="w-6 h-6 rounded-full border-2 border-white ring-2 ring-gray-300 transition-all duration-300 hover:ring-pink-500 cursor-pointer block"
                              style={{ backgroundColor: color }}
                            />
                            {/* Color Tooltip */}
                            <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 pointer-events-none">
                                {color.charAt(0).toUpperCase() + color.slice(1)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 italic">No colors in stock</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ---

// ## Data Fetching with `getServerSideProps`

// The data fetching logic remains robust, ensuring only available product options (color and size) are aggregated for display.

// ```javascript
export async function getServerSideProps() {
  try {
    // 1. Establish MongoDB Connection
    // Check if the connection is already established before connecting.
    if (!mongoose.connections[0].readyState) {
      // Use the proper environment variable for connection URI
      await mongoose.connect(process.env.MONGO_URI); 
    }

    // 2. Fetch Products
    // Retrieve all products marked as "hoodies"
    const products = await Product.find({ category: "hoodies" });
    
    // Initialize an object to group products by title (or design/style)
    let groupedProducts = {};

    // 3. Aggregate Variants (Colors and Sizes)
    for (let item of products) {
      if (groupedProducts[item.title]) {
        // Product already exists in the grouped list (it's a variant of an existing item)

        // Merge colors, but only if the variant is in stock
        if (item.availableQty > 0) {
          for (let clr of item.color) {
            if (!groupedProducts[item.title].color.includes(clr)) {
              groupedProducts[item.title].color.push(clr);
            }
          }

          // Merge sizes, but only if the variant is in stock
          for (let sz of item.size) {
            if (!groupedProducts[item.title].size.includes(sz)) {
              groupedProducts[item.title].size.push(sz);
            }
          }
        }
      } else {
        // First time seeing this product title, initialize it
        // Deep copy the item to avoid modifying the Mongoose document directly
        groupedProducts[item.title] = JSON.parse(JSON.stringify(item));
        
        // Initialize color and size arrays, checking for availability
        groupedProducts[item.title].color = item.availableQty > 0 ? [...item.color] : [];
        groupedProducts[item.title].size = item.availableQty > 0 ? [...item.size] : [];
      }
    }

    // 4. Return the aggregated products as an array
    return {
      props: { products: Object.values(groupedProducts) },
    };
  } catch (error) {
    console.error("Error fetching hoodies:", error);
    // Return an empty array on error to prevent the page from crashing
    return { props: { products: [] } };
  }
}

export default Hoodies;
