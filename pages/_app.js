import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    try {
      if (localStorage.getItem("cart")) {
        const storedCart = JSON.parse(localStorage.getItem("cart"));
        setCart(storedCart);
        saveCart(storedCart);
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem("cart");
    }
  }, []);

  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart));
    let subt = 0;
    let keys = Object.keys(myCart);
    for (let i = 0; i < keys.length; i++) {
      subt += myCart[keys[i]].price * myCart[keys[i]].qty;
    }
    setSubTotal(subt);
  };

  // ✅ FIXED: include img in cart item
  const addToCart = (itemcode, img, qty, price, name, size, varient) => {
    let newCart = { ...cart };
    if (itemcode in newCart) {
      newCart[itemcode].qty += qty;
    } else {
      newCart[itemcode] = { qty, price, name, size, varient, img };
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const clearCart = () => {
    setCart({});
    saveCart({});
  };

  const removeFromCart = (itemcode, qty, price, name, size, varient) => {
    let newCart = { ...cart };
    if (itemcode in newCart) {
      newCart[itemcode].qty -= qty;
      if (newCart[itemcode].qty <= 0) {
        delete newCart[itemcode];
      }
    }
    setCart(newCart);
    saveCart(newCart);
  };

  return (
    <>
      <Navbar
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
      />
      <Component
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
        {...pageProps}
      />
      <Footer />
    </>
  );
}
