import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const { t } = useTheme();

  return (
    <footer
      className={`${t.footerBg} text-center text-[#C9974A]/70 text-[10px] sm:text-sm py-5 sm:py-6 mt-8 px-4`}
    >
      <p className="max-w-lg mx-auto">
        © 2026 FabricsBossArena | Designed with ❤️ by Wesley Cole-Showers
      </p>
    </footer>
  );
};

export default Footer;
