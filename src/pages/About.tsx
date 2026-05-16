import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

const VALUES = [
  {
    icon: "🧵",
    title: "Premium Quality",
    desc: "Handpicked fabrics that meet the highest standards of texture, durability, and finish.",
  },
  {
    icon: "🇳🇬",
    title: "African Heritage",
    desc: "Celebrating bold Ankara prints and traditional craftsmanship rooted in Nigerian culture.",
  },
  {
    icon: "💛",
    title: "Customer First",
    desc: "Your satisfaction drives everything we do — from selection to delivery and support.",
  },
];

interface AboutProps {
  wishlistLength?: number;
  cartLength?: number;
}

const About = ({ wishlistLength = 0, cartLength = 0 }: AboutProps) => {
  const navigate = useNavigate();
  const { t } = useTheme();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className={`min-h-screen overflow-x-hidden ${t.pageBg}`}>
      <Navbar
        onLogout={handleLogout}
        wishlistLength={wishlistLength}
        cartLength={cartLength}
      />

      <main className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14 max-w-4xl mx-auto">
        <section className="text-center mb-12 sm:mb-16">
          <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-bold mb-6 ${t.headingDark}`}>
            Our Story
          </h1>
          <p className={`${t.textSecondary} leading-relaxed text-base sm:text-lg max-w-2xl mx-auto`}>
            FabricsBossArena was born from a passion for premium African fabrics.
            We believe every thread tells a story — of culture, elegance and timeless
            style. From the finest silk to vibrant Ankara prints, we bring you fabrics
            that speak before you even wear them.
          </p>
        </section>

        <section>
          <h2 className={`text-xl sm:text-2xl font-bold text-center mb-8 ${t.textPrimary}`}>
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className={`${t.cardBg} rounded-2xl p-6 shadow-sm border ${t.border} text-center`}
              >
                <span className="text-4xl mb-4 block">{value.icon}</span>
                <h3 className={`font-bold text-lg mb-2 ${t.textPrimary}`}>
                  {value.title}
                </h3>
                <p className={`text-sm ${t.textSecondary}`}>{value.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
