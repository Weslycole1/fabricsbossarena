import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import type { Product } from "./types/product";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Products from "./pages/Products";
import About from "./pages/About";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";

function App() {
  const [cart, setCart] = useState<any[]>([]);

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

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/home"
        element={<Home cart={cart} setCart={setCart} addToCart={addToCart} />}
      />
      <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
      <Route path="/products" element={<Products />} />
      <Route
        path="/products/:id"
        element={<ProductDetails addToCart={addToCart} />}
      />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;

