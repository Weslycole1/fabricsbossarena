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
          <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-display font-semibold mb-6 ${t.headingDark}`}>
            Our Story
          </h1>
          <div className={`${t.textSecondary} leading-relaxed text-base sm:text-lg max-w-2xl mx-auto text-left sm:text-center space-y-4`}>
            <p>
              FabricsBossArena started as a small family business with one simple
              goal: make it easy for people to find good materials for the things
              they're making, whether that's a wedding outfit, a work uniform, or
              a quilt they've been planning for months.
            </p>
            <p>
              Over the years we've grown into a one-stop shop for premium fabrics,
              wool, and other textile materials, alongside the fashion accessories
              and tailoring supplies that turn fabric into a finished garment —
              buttons, threads, linings, and the small details that matter as much
              as the cloth itself. If you sew, design, or tailor for a living, or
              just enjoy a weekend project, we try to carry what you actually need.
            </p>
            <p>
              We still run things the way we started: by knowing our fabrics well,
              answering questions honestly, and standing behind what we sell. Every
              order is picked and packed by people who care whether it arrives in
              good shape and on time — because that's how we'd want to be treated
              too.
            </p>
          </div>
        </section>

        <section>
          <h2 className={`text-xl sm:text-2xl font-display font-semibold text-center mb-8 ${t.textPrimary}`}>
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className={`${t.cardBg} rounded-2xl p-6 shadow-sm border ${t.border} text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}
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
