import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../hooks/useToast";

interface AccountProps {
  wishlistLength?: number;
  cartLength?: number;
  clearWishlist: () => void;
}

const CARD_CLASS =
  "bg-white rounded-2xl p-6 shadow-sm border border-[#E8E0D5]";
const CARD_HEADING_CLASS =
  "text-lg font-bold text-[#2C1810] mb-4 pb-2 border-b border-[#E8E0D5]";
const LABEL_CLASS = "text-sm font-medium text-[#6B5B4E] mb-1 block";
const INPUT_CLASS =
  "bg-[#FAF7F2] border border-[#E8E0D5] rounded-xl px-4 py-3 w-full focus:border-[#C9974A] focus:ring-1 focus:ring-[#C9974A] outline-none text-[#1A1A1A]";

const getPasswordStrength = (password: string): {
  label: string;
  color: string;
  width: string;
} => {
  if (!password) return { label: "", color: "bg-gray-200", width: "w-0" };
  if (password.length < 6)
    return { label: "Weak", color: "bg-red-500", width: "w-1/3" };
  if (password.length < 10)
    return { label: "Medium", color: "bg-yellow-400", width: "w-2/3" };
  return { label: "Strong", color: "bg-green-500", width: "w-full" };
};

const ToggleSwitch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`relative w-12 h-6 rounded-full transition-colors ${
      checked ? "bg-[#C9974A]" : "bg-gray-300"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
        checked ? "translate-x-6" : "translate-x-0"
      }`}
    />
  </button>
);

const PasswordInput = ({
  label,
  value,
  onChange,
  showStrength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  showStrength?: boolean;
}) => {
  const [visible, setVisible] = useState(false);
  const strength = getPasswordStrength(value);

  return (
    <div>
      <label className={LABEL_CLASS}>{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${INPUT_CLASS} pr-12`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B5B4E] hover:text-[#C9974A] text-sm"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {showStrength && value && (
        <div className="mt-2">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`}
            />
          </div>
          <p className="text-xs text-[#6B5B4E] mt-1">{strength.label}</p>
        </div>
      )}
    </div>
  );
};

const PROFILE_STATS = [
  { label: "Orders", key: "orders" as const },
  { label: "Wishlist", key: "wishlist" as const },
  { label: "Saved", key: "saved" as const },
];

const Account = ({
  wishlistLength = 0,
  cartLength = 0,
  clearWishlist,
}: AccountProps) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState("Wesley");
  const [lastName, setLastName] = useState("Cole-Showers");
  const [email, setEmail] = useState("wesley@fabricsbossarena.com");
  const [phone, setPhone] = useState("+234 803 440 1331");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifications, setNotifications] = useState(true);

  const fullName = `${firstName} ${lastName}`.trim();
  const avatarLetter = (firstName[0] || "U").toUpperCase();

  const statValues = {
    orders: 0,
    wishlist: wishlistLength,
    saved: 0,
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAF7F2]">
      <Navbar
        onLogout={handleLogout}
        wishlistLength={wishlistLength}
        cartLength={cartLength}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-[#2C1810]">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E8E0D5] text-center lg:col-span-1 h-fit w-full">
            <div className="bg-gradient-to-br from-[#C9974A] to-[#8a3b21] w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-lg">
              {avatarLetter}
            </div>
            <h2 className="text-2xl font-bold text-[#2C1810] mt-4">{fullName}</h2>
            <p className="text-[#6B5B4E] text-sm mt-1">{email}</p>
            <span className="bg-[#C9974A]/10 text-[#C9974A] text-xs font-semibold px-4 py-1.5 rounded-full mt-3 inline-block">
              Member since 2026
            </span>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-6">
              {PROFILE_STATS.map((stat) => (
                <div
                  key={stat.key}
                  className="bg-[#FAF7F2] rounded-xl p-2 sm:p-3 text-center"
                >
                  <p className="text-[#C9974A] font-bold text-base sm:text-xl">
                    {statValues[stat.key]}
                  </p>
                  <p className="text-[#6B5B4E] text-[10px] sm:text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Settings cards */}
          <div className="lg:col-span-2 flex flex-col gap-6 w-full">
            {/* Personal Information */}
            <div className={CARD_CLASS}>
              <h3 className={CARD_HEADING_CLASS}>Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={LABEL_CLASS}>First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className={LABEL_CLASS}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
              <div className="mb-4">
                <label className={LABEL_CLASS}>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
              <button
                type="button"
                onClick={() => showToast("Profile saved successfully!", "success")}
                className="bg-[#C9974A] hover:bg-[#b8863a] text-white font-bold rounded-xl px-6 py-2.5 transition shadow-sm"
              >
                Save Changes
              </button>
            </div>

            {/* Change Password */}
            <div className={CARD_CLASS}>
              <h3 className={CARD_HEADING_CLASS}>Change Password</h3>
              <div className="flex flex-col gap-4">
                <PasswordInput
                  label="Current Password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                />
                <PasswordInput
                  label="New Password"
                  value={newPassword}
                  onChange={setNewPassword}
                  showStrength
                />
                <PasswordInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (newPassword !== confirmPassword) {
                    showToast("Passwords do not match", "error");
                    return;
                  }
                  showToast("Password updated!", "success");
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="mt-4 bg-[#2C1810] hover:bg-[#3d2415] text-white font-bold rounded-xl px-6 py-2.5 transition shadow-sm"
              >
                Update Password
              </button>
            </div>

            {/* Preferences */}
            <div className={CARD_CLASS}>
              <h3 className={CARD_HEADING_CLASS}>Preferences</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#6B5B4E]">
                    Dark Mode
                  </span>
                  <ToggleSwitch checked={isDark} onChange={toggleTheme} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#6B5B4E]">
                    Email notifications
                  </span>
                  <ToggleSwitch
                    checked={notifications}
                    onChange={() => setNotifications((n) => !n)}
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-[#6B5B4E]">
                    Language
                  </span>
                  <select
                    className={`${INPUT_CLASS} w-auto text-sm py-2`}
                    defaultValue="en"
                  >
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl p-6 shadow-sm border border-red-100 bg-red-50/30">
              <h3 className="text-lg font-bold text-red-500 mb-4 pb-2 border-b border-red-100">
                Danger Zone
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    clearWishlist();
                    showToast("Wishlist cleared", "info");
                  }}
                  className="border border-red-200 text-red-500 hover:bg-red-500 hover:text-white rounded-xl px-4 py-2 text-sm transition"
                >
                  Clear Wishlist
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-red-500 text-white rounded-xl px-6 py-2.5 font-semibold hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Account;
