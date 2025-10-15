"use client";
import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaMinusCircle, FaMapMarkerAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { IoBagCheck } from "react-icons/io5";
import { MdDeleteSweep } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Helper component for loading state or verification status
const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

const Checkout = ({ cart, addToCart, removeFromCart, clearCart, subTotal }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    localAddress: "",
    city: "",
    state: "",
  });
  const [pin, setPin] = useState("");
  // Renamed 'accept' to 'isServiceable' for clarity
  const [isServiceable, setIsServiceable] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState("idle"); // idle, verifying, accepted, rejected
  const [paymentMethod, setPaymentMethod] = useState("online"); // New state for payment

  // Load address and set initial state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAddress = JSON.parse(localStorage.getItem("Address"));
      if (savedAddress) {
        setForm(savedAddress);
        setPin(savedAddress.pincode);
        setIsServiceable(true);
        setPincodeStatus("accepted");
      }
    }
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    // Reset serviceability on any address change
    if (isServiceable) setIsServiceable(false);
    if (pincodeStatus !== "idle") setPincodeStatus("idle");

    setForm({ ...form, [e.target.id]: e.target.value });
    // If the change is in state/city/address, reset verification
    if (["localAddress", "city", "state"].includes(e.target.id)) {
      setPin("");
    }
  };

  // Handle Pincode change separately to allow for immediate verification logic
  const handlePinChange = (e) => {
    const newPin = e.target.value.slice(0, 6);
    setPin(newPin);
    setIsServiceable(false);
    setPincodeStatus("idle");
  };

  // Validation function
  const validateForm = () => {
    if (!form.name || !form.email || !form.phone || !form.localAddress || !form.city || !form.state) {
      toast.error("Please fill in all address details.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Invalid email address format.");
      return false;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Phone number must be 10 digits.");
      return false;
    }
    if (!/^\d{6}$/.test(pin)) {
      toast.error("Pincode must be 6 digits.");
      return false;
    }
    return true;
  };

  // Verify Address and Pincode
  const handleVerify = async () => {
    if (loading) return;
    if (!validateForm()) return;

    setLoading(true);
    setPincodeStatus("verifying");

    try {
      // 1. Check Pincode Serviceability (Mock API call)
      const pinsRes = await fetch("https://trendex-eight.vercel.app/api/pincode");
      const pinsJson = await pinsRes.json();
      
      if (!pinsJson.map(String).includes(String(pin))) {
        toast.error(`❌ Sorry! We do not deliver to pincode ${pin}.`);
        setIsServiceable(false);
        setPincodeStatus("rejected");
        return;
      }

      // 2. Check User Authentication (Mock token check)
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        toast.error("🔑 Please login to save and continue.");
        setLoading(false);
        setPincodeStatus("rejected");
        return;
      }

      // 3. Save Address to Backend (Mock API call)
      await axios.post(
        "/api/Address",
        { ...form, pincode: pin },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Success
      localStorage.setItem("Address", JSON.stringify({ ...form, pincode: pin }));
      toast.success("✅ Address verified! You can now place your order.");
      setIsServiceable(true);
      setPincodeStatus("accepted");

    } catch (err) {
      console.error(err);
      toast.error("⚠️ An error occurred during verification.");
      setIsServiceable(false);
      setPincodeStatus("rejected");
    } finally {
      setLoading(false);
    }
  };

  // Place order handler
  const handlePlaceOrder = () => {
    if (!isServiceable) {
      return toast.error("Please verify your delivery address first.");
    }
    if (Object.keys(cart).length === 0) {
      return toast.error("Your cart is empty. Add items to place an order.");
    }

    // Save order data and redirect (Simplified for frontend)
    const orderData = {
      cart,
      subTotal,
      address: { ...form, pincode: pin },
      paymentMethod, // Include payment method
    };
    
    // In a real app, you would submit this data to a server API first.
    localStorage.setItem("OrderData", JSON.stringify(orderData));
    
    // Redirect to order page
    window.location.href = "/order";
  };

  const isCartEmpty = Object.keys(cart).length === 0;

  return (
    <div className="container mx-auto py-12 px-4 bg-gray-50 min-h-screen">
      <ToastContainer position="top-center" autoClose={3000} newestOnTop />

      <h1 className="font-extrabold text-4xl text-center text-indigo-700 mb-10">
        Secure Checkout
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        
        {/* --- Left Column: Delivery Details & Payment --- */}
        <div className="lg:w-2/3 space-y-8">
          
          {/* 1. Delivery Details Section */}
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200">
            <h2 className="font-bold text-2xl mb-6 text-indigo-600 flex items-center">
              <FaMapMarkerAlt className="mr-3" /> 1. Delivery Details
            </h2>
            
            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name and Email */}
              <input id="name" value={form.name} onChange={handleChange} placeholder="Full Name *" className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" required />
              <input id="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address *" className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" required />
              
              {/* Phone and City */}
              <input id="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number *" className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" required />
              <input id="city" value={form.city} onChange={handleChange} placeholder="City *" className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" required />

              {/* Address and State */}
              <input id="localAddress" value={form.localAddress} onChange={handleChange} placeholder="Street Address / Locality *" className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" required />
              <input id="state" value={form.state} onChange={handleChange} placeholder="State *" className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" required />
            </div>

            {/* Pincode and Verification */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-1/2">
                <input
                  value={pin}
                  onChange={handlePinChange}
                  type="number"
                  placeholder="Pincode *"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pr-12 focus:ring-pink-500 focus:border-pink-500 transition duration-200"
                  required
                />
                {/* Dynamic Status Icon */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {pincodeStatus === "accepted" && <FaCheckCircle className="text-green-500" />}
                  {pincodeStatus === "rejected" && <FaExclamationCircle className="text-red-500" />}
                </div>
              </div>

              <button
                onClick={handleVerify}
                disabled={loading || pin.length !== 6 || !validateForm()}
                className={`w-full sm:w-1/2 flex items-center justify-center py-3 px-6 rounded-lg text-white font-semibold transition duration-300 transform hover:scale-[1.01] shadow-md
                  ${
                    loading || pin.length !== 6 || !validateForm()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-pink-300"
                  }`}
              >
                {loading ? <LoadingSpinner /> : (isServiceable ? "Address Verified" : "Verify Pincode")}
              </button>
            </div>
          </div>
          
          {/* 3. Payment Method Section (New Feature) */}
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200">
            <h2 className="font-bold text-2xl mb-6 text-indigo-600 flex items-center">
              💳 3. Payment Method
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Online Payment Option */}
              <div
                onClick={() => setPaymentMethod("online")}
                className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition duration-300 ${
                  paymentMethod === "online"
                    ? "border-indigo-500 bg-indigo-50 shadow-lg"
                    : "border-gray-300 hover:border-indigo-300"
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="online"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    readOnly
                    className="h-5 w-5 text-indigo-600"
                  />
                  <label htmlFor="online" className="ml-3 font-semibold text-gray-800">
                    Online Payment (Credit/Debit/UPI)
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2 ml-8">Fast and secure payment method.</p>
              </div>

              {/* Cash on Delivery Option */}
              <div
                onClick={() => setPaymentMethod("cod")}
                className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition duration-300 ${
                  paymentMethod === "cod"
                    ? "border-indigo-500 bg-indigo-50 shadow-lg"
                    : "border-gray-300 hover:border-indigo-300"
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    readOnly
                    className="h-5 w-5 text-indigo-600"
                  />
                  <label htmlFor="cod" className="ml-3 font-semibold text-gray-800">
                    Cash on Delivery (COD)
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2 ml-8">Pay in cash at the time of delivery.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* --- Right Column: Order Summary (Sticky) --- */}
        <div className="lg:w-1/3">
          <div className="sticky top-10 bg-pink-100 p-6 sm:p-8 rounded-xl shadow-2xl border border-pink-300">
            <h2 className="font-bold text-2xl mb-6 text-pink-700 flex items-center">
              🛒 2. Order Summary
            </h2>
            
            {isCartEmpty ? (
              <p className="text-center text-gray-600 py-8">Your cart is empty. Add items to proceed.</p>
            ) : (
              <div className="max-h-80 overflow-y-auto pr-2 space-y-4">
                {Object.keys(cart).map((item) => (
                  <div key={item} className="flex justify-between items-center pb-2 border-b border-pink-200 transition hover:bg-pink-50 p-2 rounded-md">
                    <div className="w-2/3 font-medium text-gray-800 text-sm">
                      {cart[item].name} ({cart[item].size}/{cart[item].varient})
                    </div>
                    
                    <div className="font-semibold flex items-center w-1/3 justify-end text-pink-600">
                      <FaMinusCircle
                        onClick={() =>
                          removeFromCart(item, 1, cart[item].price, cart[item].name, cart[item].size, cart[item].varient)
                        }
                        className="mx-1 text-lg cursor-pointer hover:text-pink-800 transition"
                      />
                      <span className="text-base text-gray-700 w-6 text-center">{cart[item].qty}</span>
                      <FaPlusCircle
                        onClick={() =>
                          addToCart(item, 1, cart[item].price, cart[item].name, cart[item].size, cart[item].varient)
                        }
                        className="mx-1 text-lg cursor-pointer hover:text-pink-800 transition"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-t border-pink-300 pt-4 mt-6">
              <div className="flex justify-between font-bold text-xl text-gray-800">
                <span>Subtotal:</span>
                <span className="text-pink-600">₹{subTotal.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Shipping charges will be calculated at the time of delivery.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={handlePlaceOrder}
                disabled={!(isServiceable && !isCartEmpty)}
                className={`w-full flex items-center justify-center text-white py-3 px-4 rounded-lg text-lg font-bold transition duration-300 transform hover:scale-[1.01] shadow-lg
                  ${
                    isServiceable && !isCartEmpty
                      ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                <IoBagCheck className="mr-2 text-2xl" /> Place Order
              </button>
              <button
                onClick={clearCart}
                disabled={isCartEmpty}
                className={`w-full flex items-center justify-center text-red-600 border border-red-600 bg-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-red-50 transition duration-300 ${
                    isCartEmpty ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                <MdDeleteSweep className="mr-1" /> Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Sticky Place Order Footer */}
      {!isCartEmpty && (
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 lg:hidden shadow-2xl flex justify-between items-center z-50 border-t border-gray-200">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-800">Total:</span>
            <span className="font-extrabold text-2xl text-pink-600">₹{subTotal.toLocaleString("en-IN")}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={!(isServiceable && !isCartEmpty)}
            className={`flex items-center text-white py-3 px-6 rounded-lg text-lg font-bold transition ${
              isServiceable && !isCartEmpty
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <IoBagCheck className="mr-2" /> Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;