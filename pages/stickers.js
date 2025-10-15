import React from "react";
import Link from "next/link";
import mongoose from "mongoose";
import Product from "@/models/Product"; // Assuming this path is correct

const Stickers = ({ products }) => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12 border-b-2 border-indigo-600 pb-2 inline-block mx-auto">
        ✨ Explore Our Sticker Collection
      </h2>

      {products.length === 0 && (
        <div className="text-center p-12 bg-white rounded-xl shadow-lg max-w-lg mx-auto">
          <p className="text-xl font-medium text-gray-600">
            Sorry, all our stickers are currently out of stock. New stock coming soon!
          </p>
        </div>
      )}

      {/* Responsive Grid: 2 columns on mobile, up to 5 on large screens */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {products.map((product) => (
          <div 
            key={product.slug} // Use slug for key if it's guaranteed unique
            className="group block" // Use Tailwind group utility
          >
            <Link href={`/product/${product.slug}`}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:ring-2 group-hover:ring-indigo-500 transform group-hover:-translate-y-1 h-full flex flex-col">
                
                {/* Image Container with Out of Stock Overlay */}
                <div className="relative w-full aspect-square">
                  <img
                    alt={product.title || "Sticker"}
                    src={
                      product.img ||
                      "/placeholder-sticker.webp" // Use a better local placeholder
                    }
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                  />
                  {product.availableQty <= 0 && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
                      <p className="text-white text-lg font-bold p-2 border-2 border-white rounded-lg">
                        Out of Stock
                      </p>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <h3 className="text-indigo-500 text-xs font-semibold tracking-wider uppercase mb-1">
                    {product.category || "Sticker"}
                  </h3>

                  <h2 className="text-gray-900 text-lg font-bold line-clamp-2">
                    {product.title || "Untitled Product"}
                  </h2>

                  <p className="mt-2 text-xl font-extrabold text-green-600">
                    ₹{product.price?.toFixed(2) ?? "0.00"}
                  </p>

                  {/* Sizes */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(product.size || []).slice(0, 4).map((size) => (
                      <span
                        key={size}
                        className="px-2 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
                      >
                        {size}
                      </span>
                    ))}
                    {product.size.length > 4 && <span className="text-xs text-gray-500">+{product.size.length - 4} more</span>}
                  </div>

                  {/* Colors */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(product.color || []).slice(0, 5).map((color) => (
                      <div
                        key={color}
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-400"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};



export async function getServerSideProps() {
  if (!mongoose.connections[0].readyState) {
 
    await mongoose.connect(process.env.MONGO_URI);
  }


  const fetchedProducts = await Product.find(
    { category: "stickers" },
    {
      title: 1,
      slug: 1,
      img: 1,
      category: 1,
      price: 1,
      size: 1,
      color: 1,
      availableQty: 1,
    }
  );

  let stickersMap = {};


  for (let item of fetchedProducts) {
    const title = item.title;

    if (stickersMap[title]) {
    
      if (item.availableQty > 0) {
     
        for (let clr of item.color) {
          if (!stickersMap[title].color.includes(clr)) {
            stickersMap[title].color.push(clr);
          }
        }

   
        for (let sz of item.size) {
          if (!stickersMap[title].size.includes(sz)) {
            stickersMap[title].size.push(sz);
          }
        }
      }
      
 
      stickersMap[title].availableQty += item.availableQty;

    } else {

      stickersMap[title] = JSON.parse(JSON.stringify(item));

      stickersMap[title].color = item.availableQty > 0 ? [...item.color] : [];
      stickersMap[title].size = item.availableQty > 0 ? [...item.size] : [];
    }
  }

  return {
    props: { products: Object.values(stickersMap) },
  };
}

export default Stickers;