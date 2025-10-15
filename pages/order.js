"use client";
import React, { useEffect, useState, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaBox,
  FaTruck,
  FaShippingFast,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaShoppingCart,
} from "react-icons/fa";

const Order = () => {
  const [orderData, setOrderData] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState("Pending");
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    const storedData = localStorage.getItem("OrderData");
    const confirmedStatus = localStorage.getItem("OrderConfirmed");
    const savedStatus = localStorage.getItem("OrderStatus");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setOrderData(parsedData);

      const initialSelection = {};
      Object.keys(parsedData.cart).forEach((key) => {
        initialSelection[key] = true;
      });
      setSelectedItems(initialSelection);
    }

    if (confirmedStatus) {
      setConfirmed(true);
      // Prevent starting at “Delivered”
      const validStatus =
        savedStatus && savedStatus !== "Delivered" ? savedStatus : "Confirmed";
      setStatus(validStatus);
    }
  }, []);

  const { cart, address } = orderData || {};
  const currentSubTotal = useMemo(() => {
    if (!cart) return 0;
    return Object.keys(cart).reduce((total, key) => {
      const item = cart[key];
      if (selectedItems[key]) {
        return total + item.price * item.qty;
      }
      return total;
    }, 0);
  }, [cart, selectedItems]);

  if (!orderData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="p-10 text-center text-gray-600 bg-white shadow-2xl rounded-3xl">
          <FaShoppingCart className="text-6xl text-indigo-500 mx-auto mb-4" />
          <p className="text-xl font-semibold">No order found 😕</p>
          <p className="text-sm mt-2 text-gray-500">
            Please checkout your items to view them here.
          </p>
        </div>
      </div>
    );
  }

  const today = new Date();
  const expected = new Date();
  expected.setDate(today.getDate() + 4);
  const expectedDate = expected.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const handleItemToggle = (key) => {
    if (confirmed) {
      toast.error("⚠️ Cannot modify a confirmed order!");
      return;
    }
    setSelectedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleConfirm = () => {
    if (currentSubTotal === 0) {
      toast.error("❌ Please select at least one item to confirm the order.");
      return;
    }

    const newCart = Object.keys(cart).reduce((acc, key) => {
      if (selectedItems[key]) acc[key] = cart[key];
      return acc;
    }, {});

    const newOrderData = {
      ...orderData,
      cart: newCart,
      subTotal: currentSubTotal,
    };

    localStorage.setItem("OrderData", JSON.stringify(newOrderData));
    localStorage.setItem("OrderConfirmed", "true");
    localStorage.setItem("OrderStatus", "Confirmed");

    setOrderData(newOrderData);
    setConfirmed(true);
    setStatus("Confirmed");
    toast.success("✅ Order Confirmed Successfully!");
  };

  const handleTrack = () => {
    const stages = ["Confirmed", "Shipped", "Out for Delivery", "Delivered"];
    const current = stages.indexOf(status);

    if (current < stages.length - 1) {
      const next = stages[current + 1];
      setStatus(next);
      localStorage.setItem("OrderStatus", next);
      toast.info(`📦 Order status updated: ${next}`);
    } else {
      toast.success("🎉 Your order has been delivered!");
    }
  };

  return (
    <section className="text-gray-800 bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen">
      <ToastContainer position="top-center" autoClose={3000} newestOnTop />
      <div className="container px-4 sm:px-6 py-12 mx-auto max-w-5xl">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-700 drop-shadow-lg">
          🛍️ Order Summary & Tracking
        </h1>

        {/* Delivery Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl mb-8 shadow-2xl border border-indigo-100 hover:shadow-indigo-200 transition">
          <div className="flex items-center mb-4 border-b pb-3">
            <FaMapMarkerAlt className="text-2xl text-indigo-500 mr-3" />
            <h2 className="font-bold text-2xl text-gray-800">
              Delivery Information
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-gray-600 text-sm">
            <p className="font-semibold text-base">{address.name}</p>
            <p>
              <span className="font-medium">Email:</span> {address.email}
            </p>
            <p>
              {address.localAddress}, {address.city}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {address.phone}
            </p>
            <p>
              {address.state} - <span className="font-bold">{address.pincode}</span>
            </p>
          </div>
        </div>

        {/* Cart Items */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <FaShoppingCart className="mr-2 text-indigo-600" />
          Items in Your Cart ({Object.keys(cart).length})
        </h2>

        <div className="space-y-4 mb-6">
          {Object.keys(cart).map((key) => {
            const item = cart[key];
            const isSelected = selectedItems[key];
            const itemTotal = item.price * item.qty;

            return (
              <div
                key={key}
                className={`bg-white rounded-2xl flex items-start gap-4 p-4 shadow-md hover:shadow-lg border transition duration-300 ${
                  isSelected
                    ? "border-indigo-400 scale-[1.01]"
                    : "border-gray-200 opacity-90"
                }`}
              >
                {!confirmed && (
                  <div className="mt-3 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleItemToggle(key)}
                      className="h-5 w-5 text-indigo-600 rounded-lg border-gray-300 cursor-pointer"
                    />
                  </div>
                )}

                <img
                  src={item.img || "/placeholder.png"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-100"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Size: <span className="font-medium">{item.size}</span> | Color:{" "}
                    <span className="font-medium">{item.varient}</span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-gray-600 font-medium">
                    Qty: <span className="font-bold">{item.qty}</span>
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-green-600">
                    ₹{itemTotal}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary & Action */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 p-5 bg-indigo-50 rounded-xl shadow-lg border border-indigo-200">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <p className="text-xl font-medium text-gray-700">Total Payable</p>
            <p className="text-3xl font-extrabold text-indigo-600 mt-1">
              ₹{currentSubTotal.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="text-center">
            {!confirmed ? (
              <button
                onClick={handleConfirm}
                disabled={currentSubTotal === 0}
                className={`flex items-center justify-center py-3 px-8 rounded-full text-lg font-bold transition duration-300 transform hover:scale-[1.02] shadow-lg ${
                  currentSubTotal > 0
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
              >
                <FaCheckCircle className="mr-2" />
                Confirm Order
              </button>
            ) : (
              <button
                onClick={handleTrack}
                className="flex items-center justify-center py-3 px-8 rounded-full text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                <FaShippingFast className="mr-2" />
                Track Order ({status})
              </button>
            )}
            {confirmed && (
              <p className="text-sm italic text-gray-600 mt-2">
                Expected delivery by{" "}
                <span className="font-bold text-indigo-600">{expectedDate}</span>
              </p>
            )}
          </div>
        </div>

        {/* Tracking Timeline */}
        {confirmed && (
          <div className="mt-12 p-8 bg-white rounded-3xl shadow-2xl border border-gray-200">
            <h2 className="font-bold text-2xl mb-6 text-center text-gray-800">
              Current Order Progress
            </h2>
            <TrackingTimeline status={status} />
          </div>
        )}
      </div>
    </section>
  );
};

// Subcomponent: Tracking Timeline
const TrackingTimeline = ({ status }) => {
  const stages = [
    { icon: <FaBox />, label: "Confirmed" },
    { icon: <FaShippingFast />, label: "Shipped" },
    { icon: <FaTruck />, label: "Out for Delivery" },
    { icon: <FaCheckCircle />, label: "Delivered" },
  ];

  const currentStageIndex = stages.findIndex((stage) => stage.label === status);

  return (
    <div className="flex justify-between items-center relative px-2 sm:px-6">
      <div className="absolute left-0 right-0 h-1 bg-gray-200 top-1/2 transform -translate-y-1/2 mx-auto w-[90%] sm:w-[85%] rounded-full overflow-hidden">
        <div
          className="h-1 bg-green-500 transition-all duration-700 ease-out"
          style={{
            width: `${(currentStageIndex / (stages.length - 1)) * 100}%`,
          }}
        ></div>
      </div>

      {stages.map((step, index) => {
        const active = index <= currentStageIndex;
        return (
          <div
            key={index}
            className="relative z-10 flex flex-col items-center text-center w-1/4"
          >
            <div
              className={`p-3 rounded-full shadow-lg ${
                active
                  ? "bg-green-500 text-white ring-4 ring-green-200"
                  : "bg-gray-200 text-gray-600"
              } transition duration-500 transform ${
                active ? "scale-110" : "scale-100"
              }`}
            >
              {step.icon}
            </div>
            <span
              className={`mt-3 text-xs sm:text-sm font-semibold ${
                active ? "text-green-600" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Order;
