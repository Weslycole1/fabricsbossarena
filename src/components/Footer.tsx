import { useTheme } from "../context/ThemeContext";
import Logo from "./brand/Logo";

const Footer = () => {
  const { t } = useTheme();

  return (
    <footer className={`${t.footerBg} text-center py-7 sm:py-8 mt-8 px-4`}>
      <div className="flex justify-center mb-3">
        <Logo
          iconSize={28}
          iconWrapperClassName="w-7 h-7"
          wordmarkClassName="text-[#F5EFE1] text-base"
          wordmarkWrapperClassName="flex flex-col items-center leading-tight min-w-0"
          subtitle="Premium Fabrics & Fashion"
          subtitleClassName="text-[#C9974A]/70"
        />
      </div>
      <p className="max-w-lg mx-auto text-[#C9974A]/70 text-[10px] sm:text-sm">
        © 2026 FabricsBossArena | Designed with ❤️ by Wesley Cole-Showers
      </p>
    </footer>
  );
};

export default Footer;
