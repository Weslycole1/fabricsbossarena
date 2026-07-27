import { useTheme } from "../context/ThemeContext";
import Logo from "./brand/Logo";

const Footer = () => {
  const { t } = useTheme();

  return (
    <footer className={`${t.footerBg} text-center py-4 sm:py-5 mt-6 px-4`}>
      <div className="flex justify-center mb-2">
        <Logo
          iconSize={22}
          iconWrapperClassName="w-5 h-5"
          wordmarkClassName="text-[#F5EFE1] text-sm"
        />
      </div>
      <p className="max-w-lg mx-auto text-[#C9974A]/70 text-[10px] sm:text-xs">
        © 2026 FabricsBossArena | Designed with ❤️ by Wesley Cole-Showers
      </p>
    </footer>
  );
};

export default Footer;
