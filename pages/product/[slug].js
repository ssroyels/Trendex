import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Product from "@/models/Product";
import dbConnect from "@/middleware/mongoose";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaShoppingCart, FaBolt, FaMapMarkerAlt } from "react-icons/fa";

const ProductDetail = ({ product, availableProducts, addToCart }) => {
  const router = useRouter();

  if (!product) {
    return (
      <p className="text-center mt-20 text-3xl font-bold text-red-500">
        Product not found! 😔
      </p>
    );
  }

  const [pincode, setPincode] = useState("");
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.size?.[0] || null);
  const [selectedColor, setSelectedColor] = useState(product.color?.[0] || null);
  const [displayPrice, setDisplayPrice] = useState(product.price);
  const [variants, setVariants] = useState(availableProducts); // Local stock state

  const currentVariant = variants.find(
    (p) => p.size === selectedSize && p.color === selectedColor
  );
  const isOutOfStock = !currentVariant || currentVariant.availableQty <= 0;

  useEffect(() => {
    if (currentVariant) {
      setDisplayPrice(currentVariant.price);
    } else {
      setDisplayPrice(product.price);
    }

    if (
      selectedColor &&
      !getAvailableSizes(selectedColor).includes(selectedSize)
    ) {
      const firstAvailableSize = getAvailableSizes(selectedColor)[0];
      setSelectedSize(firstAvailableSize || null);
    }
  }, [selectedSize, selectedColor, currentVariant, product.price]);

  // 🔥 Deduct stock from local + server when cart/buy
  const updateStock = async (slug) => {
    try {
      const res = await fetch("/api/updateProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (data.success) {
        // Update stock locally
        setVariants((prev) =>
          prev.map((item) =>
            item.slug === slug
              ? { ...item, availableQty: item.availableQty - 1 }
              : item
          )
        );
      } else {
        toast.error("Stock update failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating stock!");
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock || !selectedColor || !selectedSize) {
      return toast.error("Please select an available variant.");
    }

    addToCart(
      currentVariant.slug,
      currentVariant.img,
      1,
      currentVariant.price,
      currentVariant.title,
      currentVariant.size,
      currentVariant.color
    );
    toast.success(`${product.title} (${selectedColor}/${selectedSize}) added! 🛒`);
    await updateStock(currentVariant.slug);
  };

  const handleBuyNow = async () => {
    if (isOutOfStock || !selectedColor || !selectedSize) {
      return toast.error("Please select an available variant.");
    }

    addToCart(
      currentVariant.slug,
      currentVariant.img,
      1,
      currentVariant.price,
      currentVariant.title,
      currentVariant.size,
      currentVariant.color
    );
    await updateStock(currentVariant.slug);
    toast.info(`Proceeding to checkout for ${product.title}`);
    router.push("/checkout");
  };

  const checkServiceability = async () => {
    if (!pincode || pincode.length !== 6 || isNaN(Number(pincode))) {
      return toast.error("Please enter a valid 6-digit pincode.");
    }
    setLoadingPincode(true);
    try {
      const res = await fetch("/api/pincode");
      const pins = await res.json();

      if (pins.includes(Number(pincode))) {
        toast.success("🎉 Delivery available at your location!");
      } else {
        toast.error("❌ Sorry, delivery not available at this pincode.");
      }
    } catch (error) {
      console.error("Error checking pincode:", error);
      toast.error("⚠️ Something went wrong! Please try again.");
    } finally {
      setLoadingPincode(false);
    }
  };

  const getAvailableSizes = (color) =>
    variants
      .filter((p) => p.color === color && p.availableQty > 0)
      .map((p) => p.size);

  const uniqueColors = [...new Set(variants.map((p) => p.color))];
  const primaryProduct =
    variants.find((p) => p.slug === product.slug) || product;

  return (
    <section className="text-gray-700 overflow-hidden min-h-screen bg-gray-50 py-12">
      <ToastContainer position="top-center" autoClose={3000} newestOnTop />
      <div className="container px-5 py-8 mx-auto max-w-6xl bg-white rounded-xl shadow-2xl">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full mb-6 lg:mb-0 relative">
            <img
              alt={product.title}
              className="w-full h-auto object-cover object-center rounded-lg border-4 border-gray-100 shadow-xl transition-transform duration-500 hover:scale-[1.02]"
              src={currentVariant?.img || product.img}
              onError={(e) => (e.target.src = product.img)}
            />
          </div>

          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm text-gray-500 uppercase tracking-widest">
              {product.category || "Product"}
            </h2>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              {product.title}
            </h1>

            <div className="flex items-baseline mb-6 border-b pb-4">
              <span className="title-font font-extrabold text-4xl text-green-600">
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>
              <span
                className={`ml-3 text-lg font-semibold ${
                  isOutOfStock ? "text-red-500" : "text-green-500"
                }`}
              >
                {isOutOfStock ? "Out of Stock 😥" : "In Stock! 🎉"}
              </span>
            </div>

            <p className="leading-relaxed text-gray-700 mb-6">
              {product.desc}
            </p>

            {/* Color selector */}
            <div className="flex border-t border-gray-200 py-4 items-center">
              <span className="mr-3 font-semibold text-gray-700">Color:</span>
              <div className="flex gap-2">
                {uniqueColors.map((color) => {
                  const isAvailable = getAvailableSizes(color).length > 0;
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      disabled={!isAvailable}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        isAvailable
                          ? "cursor-pointer hover:scale-110"
                          : "opacity-40 cursor-not-allowed"
                      } ${
                        selectedColor === color
                          ? "border-pink-500 ring-2 ring-pink-300 shadow-lg"
                          : "border-gray-300 hover:border-pink-400"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>

            {/* Size selector */}
            <div className="flex border-b border-gray-200 py-4 items-center mb-6">
              <span className="mr-3 font-semibold text-gray-700">Size:</span>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(primaryProduct.size) ? (
                  primaryProduct.size.map((size) => {
                    const isAvailable = getAvailableSizes(selectedColor).includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={!isAvailable}
                        className={`px-4 py-2 text-sm font-bold border-2 rounded-lg transition-all ${
                          isAvailable
                            ? "cursor-pointer hover:bg-indigo-50 hover:border-indigo-400"
                            : "opacity-50 cursor-not-allowed bg-gray-100 text-gray-500"
                        } ${
                          selectedSize === size
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                            : "text-gray-700 border-gray-300"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })
                ) : (
                  <span className="text-gray-500">Sizes not listed</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || !selectedColor || !selectedSize}
                className={`flex items-center justify-center text-lg font-bold py-3 px-6 rounded-lg transition hover:scale-[1.02] shadow-xl ${
                  isOutOfStock
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                <FaShoppingCart className="mr-2" /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock || !selectedColor || !selectedSize}
                className={`flex items-center justify-center text-lg font-bold py-3 px-6 rounded-lg transition hover:scale-[1.02] shadow-xl ${
                  isOutOfStock
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-pink-600 hover:bg-pink-700 text-white"
                }`}
              >
                <FaBolt className="mr-2" /> Buy Now
              </button>
            </div>

            {/* Pincode Checker */}
            <div className="mt-6 p-4 border rounded-lg bg-gray-100 shadow-inner">
              <h2 className="text-lg font-bold mb-3 text-gray-800 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-indigo-600" /> Check Delivery
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.slice(0, 6))}
                  maxLength={6}
                  className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
                />
                <button
                  onClick={checkServiceability}
                  disabled={loadingPincode || pincode.length !== 6}
                  className={`flex items-center justify-center text-white px-5 py-2 rounded-md font-semibold transition-all ${
                    loadingPincode || pincode.length !== 6
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-pink-600 hover:bg-pink-700"
                  }`}
                >
                  {loadingPincode ? "Checking..." : "Check"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Server-Side Props ---
export async function getServerSideProps(context) {
  const { slug } = context.params;
  await dbConnect();

  const primaryProduct = await Product.findOne({ slug }).lean();
  if (!primaryProduct) return { props: { product: null } };

  const availableVariants = await Product.find({
    title: primaryProduct.title,
  }).lean();

  let uniqueSizes = new Set();
  let uniqueColors = new Set();
  let processedVariants = [];

  for (let item of availableVariants) {
    const itemSize = Array.isArray(item.size) ? item.size[0] : item.size;
    const itemColor = Array.isArray(item.color) ? item.color[0] : item.color;

    if (itemSize && itemColor) {
      uniqueSizes.add(itemSize);
      uniqueColors.add(itemColor);

      processedVariants.push({
        slug: item.slug,
        size: itemSize,
        color: itemColor,
        price: item.price,
        img: item.img,
        availableQty: item.availableQty,
      });
    }
  }

  const productWithAllVariants = {
    ...JSON.parse(JSON.stringify(primaryProduct)),
    size: Array.from(uniqueSizes),
    color: Array.from(uniqueColors),
  };

  return {
    props: {
      product: productWithAllVariants,
      availableProducts: processedVariants,
    },
  };
}

export default ProductDetail;
