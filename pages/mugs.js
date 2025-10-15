"use client";
import React from "react";
import Link from "next/link";
import mongoose from "mongoose";
// Assuming "@/models/Product" is a valid path
import Product from "@/models/Product"; 

const Mugs = ({ products }) => {
  return (
    <div className="py-16 px-6 bg-gray-50 min-h-screen">
      <h2 className="text-5xl font-extrabold text-center mb-16 text-gray-900 tracking-tight">
        A Great Start: Our <span className="text-blue-600">Mug Collection</span> ☕
      </h2>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 bg-white rounded-xl shadow-lg max-w-lg mx-auto">
          <svg
            className="w-16 h-16 text-blue-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c-2.43 3.434-2.35 6.452.124 8.28l-.348-.348zm-4.32-2.193a.998.998 0 011.026-1.554l1.202.793.636-.636a.998.998 0 011.554-1.026.998.998 0 01-1.026 1.554l-1.202-.793-.636.636z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3M11 5h4M10 13H5M14 18h5M7 7L4 4"
            ></path>
          </svg>
          <p className="text-center text-gray-700 text-xl font-medium mb-2">
            Currently out of stock!
          </p>
          <p className="text-center text-gray-500 text-lg">
            Sorry, we don't have any mugs available at the moment. Check back soon for new designs!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {products.map((product) => {
            // Check availability based on aggregated colors/sizes
            const isAvailable = product.color.length > 0 || product.size.length > 0;

            return (
              <Link key={product._id} href={`/product/${product.slug}`} legacyBehavior>
                <div
                  className={`group bg-white rounded-xl shadow-lg hover:shadow-2xl p-6 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 ${
                    !isAvailable ? 'opacity-50 grayscale pointer-events-none' : ''
                  }`}
                >
                  {/* Image Container */}
                  <div className="relative w-full h-64 overflow-hidden rounded-lg mb-4">
                    <img
                      alt={product.title || "Mug"}
                      src={
                        product.img ||
                        "https://codeswear.nyc3.cdn.digitaloceanspaces.com/mugs/customized-tshirt-white/0.webp"
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                     {/* Out of Stock Badge */}
                    {!isAvailable && (
                      <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                        Sold Out
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="mt-4 text-center">
                    <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-1">
                      {product.category || "Beverage Ware"}
                    </h3>
                    <h2 className="text-gray-900 font-bold text-xl mb-2 line-clamp-2">
                      {product.title || "Custom Mug"}
                    </h2>
                    <p className="mt-2 font-extrabold text-2xl text-blue-600">
                      ₹{product.price?.toFixed(2) ?? "0.00"}
                    </p>

                    {/* Sizes (Capacity in case of Mugs) - Display only if available */}
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {(product.size || []).length > 0 ? (
                        (product.size || []).map((size) => (
                          <span
                            key={size}
                            className="px-3 py-1 text-sm bg-blue-100 border border-blue-300 rounded-full font-medium text-blue-700 hover:bg-blue-200 transition"
                          >
                            {size}
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1 text-sm bg-gray-100 rounded-full font-medium text-gray-500">
                          Capacity Info Missing
                        </span>
                      )}
                    </div>

                    {/* Colors with Tooltip */}
                    <div className="mt-4 flex justify-center gap-3">
                      {(product.color || []).length > 0 ? (
                        (product.color || []).map((color) => (
                          <div key={color} className="relative group">
                            <span
                              className="w-6 h-6 rounded-full border-2 border-white ring-2 ring-gray-300 transition-all duration-300 hover:ring-blue-500 cursor-pointer block"
                              style={{ backgroundColor: color }}
                            />
                             {/* Color Tooltip */}
                            <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 pointer-events-none">
                                {color.charAt(0).toUpperCase() + color.slice(1)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 italic">No colors available</span>
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



export async function getServerSideProps(context) {
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

          // Merge sizes
          for (let sz of item.size) {
            if (!groupedMugs[item.title].size.includes(sz)) {
              groupedMugs[item.title].size.push(sz);
            }
          }
        }
      } else {
        // First time seeing this product, initialize it
        groupedMugs[item.title] = JSON.parse(JSON.stringify(item));
        
        // Initialize color and size arrays based on availability
        groupedMugs[item.title].color = item.availableQty > 0 ? [...item.color] : [];
        groupedMugs[item.title].size = item.availableQty > 0 ? [...item.size] : [];
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