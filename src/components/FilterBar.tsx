 import {Link} from "react-router-dom";
import { useState } from "react";
const FilterBar = ({ setSearch, setCategory, setSort, cartLength }: any) => {
  const [activeChip, setActiveChip] = useState("");

  const handleChipClick = (value: string) => {
    setActiveChip(value);
    setCategory(value);
  };

  return (
    <section className="filter-bar">
      <input
        type="text"
        placeholder="Search fabric..."
        onChange={(e) => setSearch(e.target.value)}
      />
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All Categories</option>
        <option value="ankara">Ankara</option>
        <option value="silk">Silk</option>
        <option value="velvet">Velvet</option>
        <option value="chiffon">Chiffon</option>
        <option value="lace">Lace</option>
      </select>
      <select onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort</option>
        <option value="low-high">Low → High</option>
        <option value="high-low">High → Low</option>
        <option value="newest">New → Old</option>
        <option value="oldest">Old → New</option>
      </select>
      {/* ✅ CHIPS WITH ACTIVE STATE */}
      <div className="chips">
        <button
          className={`chip ${activeChip === "exclusive" ? "active" : ""}`}
          onClick={() => handleChipClick("exclusive")}
        >
          Exclusive
        </button>

        <button
          className={`chip ${activeChip === "luxury" ? "active" : ""}`}
          onClick={() => handleChipClick("luxury")}
        >
          Luxury
        </button>

        <button
          className={`chip ${activeChip === "budget" ? "active" : ""}`}
          onClick={() => handleChipClick("budget")}
        >
          Budget
        </button>

        <button
          className={`chip ${activeChip === "trending" ? "active" : ""}`}
          onClick={() => handleChipClick("trending")}
        >
          Trending
        </button>
      </div>
     
      <Link className="cart-icon" to="/cart">
        🛒 <span>{cartLength}</span>
      </Link>
    </section>
  );
};
export default FilterBar;
