import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

const CONTACT_CARDS = [
  {
    icon: "📱",
    title: "WhatsApp",
    desc: "Chat with us on WhatsApp",
    action: (
      <a
        href="https://wa.me/2348034401331"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4 bg-[#25D366] hover:bg-[#1ebe5c] text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm"
      >
        Open WhatsApp
      </a>
    ),
  },
  {
    icon: "📧",
    title: "Email",
    desc: "Send us an email",
    action: (
      <a
        href="mailto:info@fabricsbossarena.com"
        className="inline-block mt-4 bg-[#C9974A] hover:bg-[#b8863a] text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm"
      >
        info@fabricsbossarena.com
      </a>
    ),
  },
  {
    icon: "📍",
    title: "Location",
    desc: "Lagos, Nigeria",
    action: null,
  },
];

interface ContactProps {
  wishlistLength?: number;
  cartLength?: number;
}

const Contact = ({ wishlistLength = 0, cartLength = 0 }: ContactProps) => {
  const navigate = useNavigate();
  const { t } = useTheme();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className={`min-h-screen ${t.pageBg}`}>
      <Navbar
        onLogout={handleLogout}
        wishlistLength={wishlistLength}
        cartLength={cartLength}
      />

      <main className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14 max-w-5xl mx-auto">
        <h1 className={`text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-14 ${t.headingDark}`}>
          Get In Touch
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CONTACT_CARDS.map((card) => (
            <div
              key={card.title}
              className={`${t.cardBg} rounded-2xl p-6 shadow-sm border ${t.border} text-center`}
            >
              <span className="text-4xl mb-3 block">{card.icon}</span>
              <h3 className={`font-bold text-lg mb-2 ${t.textPrimary}`}>
                {card.title}
              </h3>
              <p className={`text-sm ${t.textSecondary}`}>{card.desc}</p>
              {card.action}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
