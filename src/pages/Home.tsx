import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./home.css";

// Components
import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

// Images
import fabric1 from "../assets/Silk.jpeg";
import fabric2 from "../assets/Ankara.jpeg";
import fabric3 from "../assets/velvet.jpeg";
const Home = ({ cart, setCart }) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  const products = [
    {
      id: 1,
      name: "Royal Silk",
      price: 25000,
      category: "silk",
      img: fabric1,
      desc: "Luxurious silk fabric with soft elegance for premium outfits.",
    },
    {
      id: 2,
      name: "Velvet Charm",
      price: 30000,
      category: "velvet",
      img: fabric3,
      desc: "Premium velvet with a timeless shine — perfect for luxury wears.",
    },
    {
      id: 3,
      name: "Ankara Gold",
      price: 12500,
      category: "ankara",
      img: fabric2,
      desc: "Vibrant African print with bold golden accents — bright and beautiful.",
    },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);

      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, qty: 1 }];
      }
    });
  };

  // FILTER, SEARCH, SORT
  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (category === "all" ? true : p.category === category))
    .sort((a, b) => {
      if (sort === "low-high") return a.price - b.price;
      if (sort === "high-low") return b.price - a.price;

      if (sort === "newest") return b.id - a.id;
      if (sort === "oldest") return a.id - b.id;
      return 0;
    });

  return (
    <div className="home-page">
      <Navbar onLogout={handleLogout} />

      <FilterBar
        setSearch={setSearch}
        setCategory={setCategory}
        setSort={setSort}
        cartLength={cart.length}
      />

      <section className="product-container">
        {filteredProducts.map((p) => (
          <ProductCard key={p.id} product={p} addToCart={addToCart} />
        ))}
      </section>

      <Footer />
    </div>
  );
};

export default Home;
