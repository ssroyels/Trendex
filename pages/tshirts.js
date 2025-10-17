import React, { useState, useEffect } from "react";
import Link from "next/link";
import mongoose from "mongoose";
import Product from "@/models/Product";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1521572163474-604875327648?q=80&w=2670&auto=format&fit=crop";

const Tshirts = ({ products }) => {
  const [cart, setCart] = useState({});

  // Load cart from localStorage (on mount)
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart when updated
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add to cart function
  const addToCart = (product) => {
    const id = product._id;
    const existingItem = cart[id];

    const updatedCart = {
      ...cart,
      [id]: existingItem
        ? { ...existingItem, qty: existingItem.qty + 1 }
        : {
            id: id,
            title: product.title,
            price: product.price,
            img: product.img || DEFAULT_IMAGE,
            qty: 1,
          },
    };

    setCart(updatedCart);
    toast.success(`${product.title} added to cart! 🛒`, {
      position: "bottom-center",
      autoClose: 1500,
    });
  };

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-4 text-red-500">
          No Products Found 😔
        </h2>
        <p className="text-gray-600">
          Please check back later or try a different category.
        </p>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 sm:px-8 bg-gray-50 min-h-screen">
      <ToastContainer />
      <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800 tracking-tight">
        🔥 Exclusive T-Shirt Collection
      </h2>

      {/* ✅ Responsive Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-10 gap-x-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="group bg-white rounded-xl shadow-xl hover:shadow-2xl hover:shadow-indigo-200 transition-all duration-500 overflow-hidden relative"
          >
            <div className="relative w-full h-80 overflow-hidden">
              <Link href={`/product/${product.slug}`} passHref>
                <img
                  alt={product.title || "T-Shirt"}
                  src={product.img || DEFAULT_IMAGE}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </Link>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-black opacity-10 transition-opacity duration-300 group-hover:opacity-0"></div>

              {/* Desktop Hover Button */}
              <div className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Link href={`/product/${product.slug}`} passHref>
                  <span className="bg-indigo-600 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 cursor-pointer">
                    View Details
                  </span>
                </Link>
              </div>

              {/* ✅ Mobile Add to Cart Button */}
              <div className="absolute bottom-3 right-3 sm:hidden">
                <button
                  onClick={() => addToCart(product)}
                  className="bg-indigo-600 text-white p-2 rounded-full shadow-md active:scale-95 transition-transform"
                  aria-label="Add to cart"
                >
                  🛒
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-5 text-center">
              <h3 className="text-sm font-medium text-indigo-500 tracking-widest uppercase mb-1">
                {product.category || "Apparel"}
              </h3>
              <h2 className="text-xl font-bold text-gray-900 truncate my-2">
                {product.title || "T-Shirt"}
              </h2>
              <p className="mt-2 font-extrabold text-2xl text-green-600">
                ₹{product.price?.toLocaleString("en-IN") ?? "0"}
              </p>

              {/* Variants */}
              <div className="mt-3 flex flex-col items-center justify-center gap-2">
                {product.size && product.size.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {product.size.slice(0, 4).map((size) => (
                      <span
                        key={size}
                        className="text-xs font-semibold px-2.5 py-0.5 bg-gray-200 text-gray-700 rounded-full border border-gray-300 hover:bg-indigo-100"
                      >
                        {size}
                      </span>
                    ))}
                    {product.size.length > 4 && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 bg-gray-200 text-gray-700 rounded-full border border-gray-300">
                        +{product.size.length - 4} More
                      </span>
                    )}
                  </div>
                )}

                {product.color && product.color.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                    {product.color.map((color) => (
                      <span
                        key={color}
                        className="w-5 h-5 rounded-full border-2 border-white shadow-md transition-transform duration-300 hover:scale-125"
                        style={{
                          backgroundColor: color,
                          outline: `2px solid ${
                            color === "#ffffff" || color === "white"
                              ? "#9ca3af"
                              : "transparent"
                          }`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Add to Cart Button */}
              <div className="hidden sm:flex justify-center mt-4">
                <button
                  onClick={() => addToCart(product)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-md transition-all"
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SERVER SIDE DATA FETCH ---
export async function getServerSideProps() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  const products = await Product.find({ category: "tshirt" });
  let tshirts = {};

  for (let item of products) {
    const titleKey = item.title;

    if (tshirts[titleKey]) {
      for (let clr of item.color || []) {
        if (!tshirts[titleKey].color.includes(clr) && item.availableQty > 0) {
          tshirts[titleKey].color.push(clr);
        }
      }

      for (let sz of item.size || []) {
        if (!tshirts[titleKey].size.includes(sz) && item.availableQty > 0) {
          tshirts[titleKey].size.push(sz);
        }
      }
    } else {
      tshirts[titleKey] = JSON.parse(JSON.stringify(item));
      tshirts[titleKey].color = item.availableQty > 0 ? [...(item.color || [])] : [];
      tshirts[titleKey].size = item.availableQty > 0 ? [...(item.size || [])] : [];
    }
  }

  return { props: { products: Object.values(tshirts) } };
}

export default Tshirts;
