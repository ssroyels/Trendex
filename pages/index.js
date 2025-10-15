"use client";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import {
  FaTshirt,
  FaHandsHelping,
  FaShippingFast,
  FaMugHot,
  FaStickerMule,
  FaFire,
} from "react-icons/fa";
import {
  MdPayment,
  MdCollectionsBookmark,
  MdOutlineChecklist,
} from "react-icons/md";
import { motion } from "framer-motion";

// --- Category Data ---
const productCategories = [
  {
    name: "T-Shirts",
    icon: FaTshirt,
    href: "/tshirts",
    color: "from-pink-500 to-rose-500",
    shadow: "shadow-pink-500/40",
  },
  {
    name: "Hoodies",
    icon: FaFire,
    href: "/hoodies",
    color: "from-indigo-500 to-purple-500",
    shadow: "shadow-indigo-500/40",
  },
  {
    name: "Mugs",
    icon: FaMugHot,
    href: "/mugs",
    color: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/40",
  },
  {
    name: "Stickers",
    icon: FaStickerMule,
    href: "/stickers",
    color: "from-teal-500 to-emerald-500",
    shadow: "shadow-teal-500/40",
  },
];

// --- Features Data ---
const featuresData = [
  {
    title: "Trending Designs",
    icon: FaFire,
    description:
      "Stay ahead with the freshest, most viral styles updated every week.",
  },
  {
    title: "Premium Quality",
    icon: MdOutlineChecklist,
    description:
      "Experience comfort and durability with our high-quality fabrics and prints.",
  },
  {
    title: "Fast Delivery",
    icon: FaShippingFast,
    description:
      "Get your items quickly and efficiently delivered right to your door.",
  },
  {
    title: "Secure Payments",
    icon: MdPayment,
    description:
      "Shop confidently using our secure and encrypted payment gateways.",
  },
  {
    title: "Ethically Sourced",
    icon: FaHandsHelping,
    description:
      "Our products are responsibly and ethically sourced — we care about the planet.",
  },
  {
    title: "Exclusive Collections",
    icon: MdCollectionsBookmark,
    description:
      "Access limited edition drops only available here at Trendex.",
  },
];

export default function Home() {
  return (
    <div className="bg-gray-50">
      <Head>
        <title>Trendex - Shop the Latest Trends</title>
        <meta
          name="description"
          content="Trendex.com - Your one-stop shop for trending T-shirts, Hoodies, Mugs, and Stickers."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 🌟 HERO SECTION */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/ecommerce.jpg"
          alt="Trendex Main Banner"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-lg">
            Your Vibe, Your Style,<br />
            <span className="text-pink-400">Trendex</span>
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-gray-200">
            Discover unique T-shirts, cozy Hoodies, stylish Mugs, and cool Stickers.
          </p>
          <Link href="/tshirts">
            <button className="mt-8 px-10 py-4 bg-pink-500 hover:bg-pink-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Shop Now & Express Yourself
            </button>
          </Link>
        </motion.div>
      </section>

      {/* 🛍️ CATEGORY SHOWCASE */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Explore Top Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {productCategories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={cat.href}>
                  <div
                    className={`bg-gradient-to-br ${cat.color} p-8 rounded-2xl text-white flex flex-col items-center justify-center shadow-lg ${cat.shadow} hover:scale-105 transform transition-all duration-300 cursor-pointer`}
                  >
                    <cat.icon className="text-5xl mb-3" />
                    <span className="text-lg font-semibold">{cat.name}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 💎 WHY CHOOSE US */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-3 border-b-4 border-teal-500 inline-block pb-2">
              Why Choose Trendex?
            </h2>
            <p className="text-lg text-gray-700">
              We stand for quality, speed, and creative self-expression.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-teal-100 text-teal-600 mb-5">
                    <feature.icon className="text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 💬 TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-4xl font-bold text-center mb-12 border-b-4 border-pink-500 inline-block pb-2">
            Loved by Our Community
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: "Emily R.",
                text: "Trendex has the most amazing designs! I always find something unique here. The quality is fantastic.",
                color: "bg-pink-500",
                role: "Fashion Blogger",
              },
              {
                name: "David M.",
                text: "Fast delivery and super comfortable hoodies. Trendex is my go-to for casual wear!",
                color: "bg-teal-500",
                role: "Tech Enthusiast",
              },
              {
                name: "Sarah L.",
                text: "The stickers are top-notch and the mugs make great gifts. Trendex truly delivers!",
                color: "bg-indigo-500",
                role: "Art Student",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <div className="border border-gray-200 bg-gray-50 rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300">
                  <p className="italic text-gray-700 mb-6">“{t.text}”</p>
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white font-bold text-lg mr-3`}
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{t.name}</h4>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 CTA SECTION */}
      <section className="bg-gradient-to-br from-pink-600 to-rose-500 py-20 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Find Your Next Favorite Item?
        </h2>
        <p className="text-lg mb-8 max-w-xl mx-auto">
          Don’t miss out on the latest drops — shop now and stay on trend!
        </p>
        <Link href="/hoodies">
          <button className="px-10 py-4 bg-white text-pink-600 font-bold text-lg rounded-full shadow-xl hover:scale-105 hover:bg-gray-100 transition-transform duration-300">
            Browse New Arrivals
          </button>
        </Link>
      </section>
    </div>
  );
}
