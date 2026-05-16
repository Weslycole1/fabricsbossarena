import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const { t } = useTheme();

  return (
    <footer
      className={`${t.footerBg} text-center text-[#C9974A]/70 text-xs sm:text-sm py-5 sm:py-6 mt-8`}
    >
      <p>© 2026 FabricsBossArena | Designed with ❤️ by Wesley Cole-Showers</p>
    </footer>
  );
};

export default Footer;
