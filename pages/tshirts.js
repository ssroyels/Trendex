import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import mongoose from "mongoose";
import Product from "@/models/Product";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1521572163474-604875327648?q=80&w=2670&auto=format&fit=crop";

const Tshirts = ({ products }) => {
  const [cart, setCart] = useState({});

  // Load saved cart
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save on update
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add to Cart
  const addToCart = (product) => {
    const id = product._id;
    const existingItem = cart[id];

    const updatedCart = {
      ...cart,
      [id]: existingItem
        ? { ...existingItem, qty: existingItem.qty + 1 }
        : {
            id,
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

  // Dummy Rating Function
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (rating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-gray-300" />);
    }
    return <div className="flex justify-center mt-1">{stars}</div>;
  };

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h2 className="text-3xl font-bold text-red-500 mb-3">No Products Found 😔</h2>
        <p className="text-gray-600">Please check back later.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Exclusive T-Shirts | Trendex</title>
        <meta
          name="description"
          content="Shop premium T-shirts with trendy designs, soft fabric, and bold styles at unbeatable prices."
        />
      </Head>

      <div className="py-14 px-3 sm:px-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <ToastContainer />
        <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800 tracking-tight">
          🔥 Exclusive T-Shirt Collection
        </h2>

        {/* ✅ Responsive Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="relative w-full h-56 sm:h-64">
                <Link href={`/product/${product.slug}`} passHref>
                  <img
                    alt={product.title}
                    src={product.img || DEFAULT_IMAGE}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>
                <button
                  onClick={() => addToCart(product)}
                  className="absolute bottom-3 right-3 bg-indigo-600 text-white p-2 rounded-full shadow-md sm:hidden active:scale-95 transition-transform"
                  aria-label="Add to cart"
                >
                  🛒
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4 text-center">
                <h3 className="text-sm font-medium text-indigo-500 uppercase mb-1 tracking-widest">
                  {product.category || "Apparel"}
                </h3>
                <h2 className="text-lg font-bold text-gray-900 truncate mb-1">
                  {product.title}
                </h2>
                <p className="font-extrabold text-lg text-green-600 mb-1">
                  ₹{product.price?.toLocaleString("en-IN")}
                </p>
                {renderRating(product.rating || 4.5)}

                {/* Size & Color */}
                <div className="mt-3 flex flex-col items-center gap-2">
                  {product.size?.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1">
                      {product.size.slice(0, 3).map((sz) => (
                        <span
                          key={sz}
                          className="text-xs font-semibold px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full border border-gray-300"
                        >
                          {sz}
                        </span>
                      ))}
                    </div>
                  )}
                  {product.color?.length > 0 && (
                    <div className="flex justify-center gap-1 mt-1">
                      {product.color.slice(0, 3).map((clr) => (
                        <span
                          key={clr}
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: clr }}
                        ></span>
                      ))}
                    </div>
                  )}
                </div>

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

        {/* 🔹 Suggested Items Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-5 text-center">
            You May Also Like ✨
          </h3>
          <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-3 px-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="min-w-[180px] bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex-shrink-0"
              >
                <img
                  src={`https://picsum.photos/200?random=${i}`}
                  alt={`Suggested ${i}`}
                  className="w-full h-36 object-cover rounded-t-xl"
                />
                <div className="p-3 text-center">
                  <p className="font-semibold text-gray-800 truncate">Cool Tee #{i}</p>
                  <p className="text-sm text-green-600 font-bold">₹799</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// --- SERVER SIDE DATA FETCH ---
export async function getServerSideProps() {
  try {
    if (mongoose.connection.readyState === 0) {
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
  } catch (error) {
    console.error("Error fetching T-shirts:", error);
    return { props: { products: [] } };
  }
}

export default Tshirts;
