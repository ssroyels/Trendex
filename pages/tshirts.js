import React from "react";
import Link from "next/link";
import mongoose from "mongoose";
// Assuming you have a standard Product model setup
import Product from "@/models/Product"; 

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1521572163474-604875327648?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const Tshirts = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-4 text-red-500">
          No Products Found 😔
        </h2>
        <p className="text-gray-600">Please check back later or try a different category.</p>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 sm:px-8 bg-gray-50">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800 tracking-tight">
        🔥 Exclusive T-Shirt Collection
      </h2>

      {/* ✅ Enhanced Responsive Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-10 gap-x-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="group bg-white rounded-xl shadow-xl hover:shadow-2xl hover:shadow-indigo-200 transition-all duration-500 overflow-hidden relative"
          >
            <Link href={`/product/${product.slug}`} passHref>
              {/* <a className="block"> */}
                {/* ✅ Product Image with Overlay and Polish */}
                <div className="relative w-full h-80 overflow-hidden">
                  <img
                    alt={product.title || "T-Shirt"}
                    src={product.img || DEFAULT_IMAGE}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-black opacity-10 transition-opacity duration-300 group-hover:opacity-0"></div>
                  
                  {/* Quick Action Button on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                     <span className="bg-indigo-600 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        View Details
                     </span>
                  </div>
                </div>

                {/* ✅ Product Info */}
                <div className="p-5 text-center">
                  <h3 className="text-sm font-medium text-indigo-500 tracking-widest uppercase mb-1">
                    {product.category || "Apparel"}
                  </h3>

                  <h2 className="text-xl font-bold text-gray-900 truncate my-2">
                    {product.title || "T-Shirt"}
                  </h2>

                  <p className="mt-2 font-extrabold text-2xl text-green-600">
                    ₹{product.price?.toLocaleString('en-IN') ?? "0"}
                  </p>

                  {/* --- Variants Row --- */}
                  <div className="mt-3 flex flex-col items-center justify-center gap-2">
                    
                    {/* ✅ Sizes (Pill Badges) */}
                    {product.size && product.size.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2">
                        {product.size.slice(0, 4).map((size) => (
                          <span
                            key={size}
                            className="text-xs font-semibold px-2.5 py-0.5 bg-gray-200 text-gray-700 rounded-full border border-gray-300 transition-all hover:bg-indigo-100"
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
                    
                    {/* ✅ Colors (Circular Swatches) */}
                    {product.color && product.color.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                        {product.color.map((color) => (
                          <span
                            key={color}
                            className="w-5 h-5 rounded-full border-2 border-white shadow-md transition-transform duration-300 hover:scale-125"
                            style={{ 
                                backgroundColor: color,
                                outline: `2px solid ${color === '#ffffff' || color === 'white' ? '#9ca3af' : 'transparent'}`
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {/* --- End Variants Row --- */}
                </div>
              {/* </a> */}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---
// Server-Side Data Fetching (Keep this logic as it is functional)
// ---
export async function getServerSideProps() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  // Fetch all products that belong to the 'tshirt' category
  const products = await Product.find({ category: "tshirt" });

  // Consolidate variants for products with the same title (SKUs)
  let tshirts = {};

  for (let item of products) {
    const titleKey = item.title;

    if (tshirts[titleKey]) {
      // Logic to merge variants if the product title already exists
      
      // 1. Merge Colors
      for (let clr of item.color || []) {
        if (!tshirts[titleKey].color.includes(clr) && item.availableQty > 0) {
          tshirts[titleKey].color.push(clr);
        }
      }

      // 2. Merge Sizes
      for (let sz of item.size || []) {
        if (!tshirts[titleKey].size.includes(sz) && item.availableQty > 0) {
          tshirts[titleKey].size.push(sz);
        }
      }
    } else {
      // If product title is new, initialize it
      tshirts[titleKey] = JSON.parse(JSON.stringify(item));
      // Only include variants if quantity is available
      tshirts[titleKey].color = item.availableQty > 0 ? [...(item.color || [])] : [];
      tshirts[titleKey].size = item.availableQty > 0 ? [...(item.size || [])] : [];
    }
  }

  return {
    props: { products: Object.values(tshirts) },
  };
}

export default Tshirts;