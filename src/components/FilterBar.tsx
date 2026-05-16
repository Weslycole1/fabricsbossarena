import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

interface FilterBarProps {
  setSearch: (value: string) => void;
  setCategory: (value: string) => void;
  setSort: (value: string) => void;
}

const TAG_CHIPS = ["exclusive", "luxury", "budget", "trending"] as const;

const FilterBar = ({ setSearch, setCategory, setSort }: FilterBarProps) => {
  const [activeChip, setActiveChip] = useState("");
  const { t } = useTheme();

  const handleChipClick = (value: string) => {
    const next = activeChip === value ? "" : value;
    setActiveChip(next);
    setCategory(next || "all");
  };

  const handleCategoryChange = (value: string) => {
    setActiveChip("");
    setCategory(value);
  };

  const selectClass = `rounded-full border ${t.border} ${t.mutedBg} px-4 py-2 ${t.textPrimary} text-sm focus:border-[#C9974A] outline-none`;
  const chipInactive = `border ${t.border} ${t.mutedBg} ${t.textSecondary} hover:border-[#C9974A] hover:text-[#C9974A]`;

  return (
    <section
      className={`${t.filterBarBg} border-b ${t.border} px-4 sm:px-6 lg:px-8 py-4`}
    >
      <input
        type="text"
        placeholder="Search fabric..."
        onChange={(e) => setSearch(e.target.value)}
        className={`w-full rounded-full ${t.mutedBg} border ${t.border} px-5 py-2.5 mb-3 text-sm sm:text-base ${t.textPrimary} focus:border-[#C9974A] outline-none`}
      />

      <div className="flex flex-wrap gap-3 items-center">
        <select
          onChange={(e) => handleCategoryChange(e.target.value)}
          defaultValue="all"
          className={selectClass}
        >
          <option value="all">All Categories</option>
          <option value="ankara">Ankara</option>
          <option value="silk">Silk</option>
          <option value="velvet">Velvet</option>
          <option value="chiffon">Chiffon</option>
          <option value="lace">Lace</option>
        </select>

        <select
          onChange={(e) => setSort(e.target.value)}
          defaultValue=""
          className={selectClass}
        >
          <option value="">Sort</option>
          <option value="low-high">Low → High</option>
          <option value="high-low">High → Low</option>
          <option value="newest">New → Old</option>
          <option value="oldest">Old → New</option>
        </select>

        {TAG_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleChipClick(chip)}
            className={`rounded-full px-4 py-2 border text-sm font-medium capitalize transition ${
              activeChip === chip
                ? "bg-[#C9974A] text-white border-[#C9974A]"
                : chipInactive
            }`}
          >
            {chip}
          </button>
        ))}
      </div>
    </section>
  );
};

export default FilterBar;
