import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Product } from "./types/product";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import ProductDetails from "./pages/ProductDetails";

const WISHLIST_KEY = "fabricsbossarena-wishlist";

function App() {
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      /* ignore */
    }
  }, [wishlist]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);

      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/home"
        element={
          <Home
            cart={cart}
            setCart={setCart}
            addToCart={addToCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
          />
        }
      />
      <Route
        path="/cart"
        element={
          <Cart
            cart={cart}
            setCart={setCart}
            wishlistLength={wishlist.length}
          />
        }
      />
      <Route
        path="/wishlist"
        element={
          <Wishlist
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            addToCart={addToCart}
            cartLength={cart.length}
          />
        }
      />
      <Route
        path="/products"
        element={
          <Products
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            addToCart={addToCart}
          />
        }
      />
      <Route
        path="/products/:id"
        element={
          <ProductDetails
            addToCart={addToCart}
            wishlistLength={wishlist.length}
            cartLength={cart.length}
          />
        }
      />
      <Route
        path="/about"
        element={
          <About
            wishlistLength={wishlist.length}
            cartLength={cart.length}
          />
        }
      />
      <Route
        path="/contact"
        element={
          <Contact
            wishlistLength={wishlist.length}
            cartLength={cart.length}
          />
        }
      />
    </Routes>
  );
}

export default App;
