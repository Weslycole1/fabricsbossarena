import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "fabricsbossarena-theme";

export type ThemeClasses = {
  pageBg: string;
  navbarBg: string;
  navbarBorder: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  filterBarBg: string;
  inputBg: string;
  mutedBg: string;
  footerBg: string;
  headingDark: string;
  loginToggleActive: string;
  loginToggleInactive: string;
  backBtn: string;
  qtyBtn: string;
};

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
  t: ThemeClasses;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function buildTheme(isDark: boolean): ThemeClasses {
  if (isDark) {
    return {
      pageBg: "bg-[#0F0A07]",
      navbarBg: "bg-[#1A0F08]",
      navbarBorder: "border-[#2C2018]",
      cardBg: "bg-[#1C1410]",
      textPrimary: "text-[#F5F0E8]",
      textSecondary: "text-[#A89880]",
      border: "border-[#2C2018]",
      filterBarBg: "bg-[#1C1410]",
      inputBg: "bg-[#1C1410]",
      mutedBg: "bg-[#0F0A07]",
      footerBg: "bg-[#1A0F08]",
      headingDark: "text-[#F5F0E8]",
      loginToggleActive: "bg-[#C9974A] text-white",
      loginToggleInactive:
        "border border-[#2C2018] text-[#F5F0E8] hover:bg-[#2C2018]",
      backBtn:
        "inline-flex items-center gap-2 bg-[#1C1410] border border-[#2C2018] text-[#F5F0E8] hover:bg-[#2C2018] px-4 py-2 rounded-full text-sm font-medium shadow-sm transition",
      qtyBtn:
        "w-8 h-8 rounded-full border border-[#2C2018] bg-[#0F0A07] hover:border-[#C9974A] hover:text-[#C9974A] transition font-bold text-sm text-[#F5F0E8]",
    };
  }

  return {
    pageBg: "bg-[#FAF7F2]",
    navbarBg: "bg-[#2C1810]",
    navbarBorder: "border-[#3d2415]",
    cardBg: "bg-white",
    textPrimary: "text-[#1A1A1A]",
    textSecondary: "text-[#6B5B4E]",
    border: "border-[#E8E0D5]",
    filterBarBg: "bg-white",
    inputBg: "bg-white",
    mutedBg: "bg-[#FAF7F2]",
    footerBg: "bg-[#2C1810]",
    headingDark: "text-[#2C1810]",
    loginToggleActive: "bg-[#2C1810] text-white",
    loginToggleInactive:
      "border border-[#2C1810] text-[#2C1810] hover:bg-[#2C1810]/5",
    backBtn:
      "inline-flex items-center gap-2 bg-white border border-[#E8E0D5] text-[#2C1810] hover:bg-[#FAF7F2] px-4 py-2 rounded-full text-sm font-medium shadow-sm transition",
    qtyBtn:
      "w-8 h-8 rounded-full border border-[#E8E0D5] bg-[#FAF7F2] hover:border-[#C9974A] hover:text-[#C9974A] transition font-bold text-sm text-[#1A1A1A]",
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), []);

  const t = useMemo(() => buildTheme(isDark), [isDark]);

  const value = useMemo(
    () => ({ isDark, toggleTheme, t }),
    [isDark, toggleTheme, t]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
