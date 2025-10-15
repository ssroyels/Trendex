import Link from "next/link";
import React from "react";
import Image from "next/image";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // React Icons for social media

const Footer = () => {
  return (
    <div className="mt-10 border-t border-gray-200">
      <footer className="text-gray-700 body-font bg-white">
        <div className="container px-5 pt-16 pb-8 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
          
          {/* Company Info / Logo */}
          <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
            <Link href={"/"} className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
              {/* Assuming /logo.png is the Trendex logo, set proper dimensions for a good footer look */}
              <Image src="/logo_1.png" alt="Trendex Logo" width={100} height={32} className="object-contain" />
            </Link>

            <p className="mt-4 text-sm text-gray-500 max-w-xs md:max-w-none">
              Discover the latest trends in fashion and accessories. Shop smart, look great, with **Trendex**.
            </p>
          </div>

          {/* Links Section */}
          <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
            
            {/* Shop Categories */}
            <div className="lg:w-1/4 md:w-1/2 w-full px-4 mb-6">
              <h2 className="title-font font-bold text-gray-900 tracking-wider text-md mb-3 border-b-2 border-pink-500 inline-block pb-1">
                SHOP
              </h2>
              <nav className="list-none space-y-2">
                <li><Link href="/tshirts" className="text-gray-600 hover:text-pink-600 transition">T-Shirts</Link></li>
                <li><Link href="/hoodies" className="text-gray-600 hover:text-pink-600 transition">Hoodies</Link></li>
                <li><Link href="/mugs" className="text-gray-600 hover:text-pink-600 transition">Mugs</Link></li>
                <li><Link href="/stickers" className="text-gray-600 hover:text-pink-600 transition">Stickers</Link></li>
              </nav>
            </div>
            
            {/* Customer Service */}
            <div className="lg:w-1/4 md:w-1/2 w-full px-4 mb-6">
              <h2 className="title-font font-bold text-gray-900 tracking-wider text-md mb-3 border-b-2 border-pink-500 inline-block pb-1">
                CUSTOMER SERVICE
              </h2>
              <nav className="list-none space-y-2">
                <li><Link href="/contact" className="text-gray-600 hover:text-pink-600 transition">Contact Us</Link></li>
                <li><Link href="/about" className="text-gray-600 hover:text-pink-600 transition">About Us</Link></li>
                <li><Link href="/returns" className="text-gray-600 hover:text-pink-600 transition">Returns Policy</Link></li>
                <li><Link href="/sitemap" className="text-gray-600 hover:text-pink-600 transition">Sitemap</Link></li>
              </nav>
            </div>

            {/* Policy */}
            <div className="lg:w-1/4 md:w-1/2 w-full px-4 mb-6">
              <h2 className="title-font font-bold text-gray-900 tracking-wider text-md mb-3 border-b-2 border-pink-500 inline-block pb-1">
                POLICY
              </h2>
              <nav className="list-none space-y-2">
                <li><Link href="/privacy" className="text-gray-600 hover:text-pink-600 transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-pink-600 transition">Terms of Use</Link></li>
                <li><Link href="/shipping" className="text-gray-600 hover:text-pink-600 transition">Shipping</Link></li>
              </nav>
            </div>
            
            {/* Newsletter (Empty placeholder for now) */}
             <div className="lg:w-1/4 md:w-1/2 w-full px-4 mb-6">
              <h2 className="title-font font-bold text-gray-900 tracking-wider text-md mb-3 border-b-2 border-pink-500 inline-block pb-1">
                JOIN US
              </h2>
              <p className="text-sm text-gray-500">Sign up for exclusive offers!</p>
              {/* You can add a Newsletter form here */}
            </div>

          </div>
        </div>
        
        {/* Copyright and Social Media */}
        <div className="bg-teal-700">
          <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
            
            {/* Copyright */}
            <p className="text-white text-sm text-center sm:text-left">
              © {new Date().getFullYear()} Trendex — All Rights Reserved
            </p>
            
            {/* Social Icons */}
            <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start space-x-4">
              <a href="#" target="_blank" className="text-white hover:text-pink-300 transition-colors">
                <FaFacebook className="w-5 h-5"/>
              </a>
              <a href="#" target="_blank" className="text-white hover:text-pink-300 transition-colors">
                <FaTwitter className="w-5 h-5"/>
              </a>
              <a href="#" target="_blank" className="text-white hover:text-pink-300 transition-colors">
                <FaInstagram className="w-5 h-5"/>
              </a>
              <a href="#" target="_blank" className="text-white hover:text-pink-300 transition-colors">
                <FaLinkedin className="w-5 h-5"/>
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;