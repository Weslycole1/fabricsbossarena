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
      <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#FAF7F2] border border-[#E8E0D5] rounded-xl px-4 py-2.5 pr-12 text-[#1A1A1A] focus:border-[#C9974A] outline-none text-sm"
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

const Account = ({
  wishlistLength = 0,
  cartLength = 0,
  clearWishlist,
}: AccountProps) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme, t } = useTheme();
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

  const handleLogout = () => {
    navigate("/login");
  };

  const inputClass = `w-full ${t.mutedBg} border ${t.border} rounded-xl px-4 py-2.5 ${t.textPrimary} focus:border-[#C9974A] outline-none text-sm`;

  return (
    <div className={`min-h-screen ${t.pageBg}`}>
      <Navbar
        onLogout={handleLogout}
        wishlistLength={wishlistLength}
        cartLength={cartLength}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${t.headingDark}`}>
          My Account
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile card */}
          <div
            className={`${t.cardBg} rounded-2xl p-8 shadow-sm border ${t.border} text-center lg:col-span-1 h-fit`}
          >
            <div className="bg-[#C9974A] text-white text-4xl font-bold flex items-center justify-center w-24 h-24 rounded-full mx-auto">
              {avatarLetter}
            </div>
            <h2 className={`font-bold text-xl mt-4 ${t.textPrimary}`}>
              {fullName}
            </h2>
            <p className={`${t.textSecondary} text-sm mt-1`}>{email}</p>
            <span className="inline-block mt-4 bg-[#C9974A]/10 text-[#C9974A] text-xs px-3 py-1 rounded-full">
              Member since 2026
            </span>
          </div>

          {/* Settings cards */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Personal Information */}
            <div
              className={`${t.cardBg} rounded-2xl p-6 shadow-sm border ${t.border}`}
            >
              <h3 className={`font-bold text-lg mb-4 ${t.textPrimary}`}>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${t.textPrimary}`}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${t.textPrimary}`}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-1.5 ${t.textPrimary}`}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-1.5 ${t.textPrimary}`}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                onClick={() => showToast("Profile saved successfully!", "success")}
                className="bg-[#C9974A] text-white rounded-xl px-6 py-2.5 font-semibold hover:bg-[#b8863a] transition"
              >
                Save Changes
              </button>
            </div>

            {/* Change Password */}
            <div
              className={`${t.cardBg} rounded-2xl p-6 shadow-sm border ${t.border}`}
            >
              <h3 className={`font-bold text-lg mb-4 ${t.textPrimary}`}>
                Change Password
              </h3>
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
                className="mt-4 bg-[#2C1810] text-white rounded-xl px-6 py-2.5 font-semibold hover:bg-[#3d2415] transition"
              >
                Update Password
              </button>
            </div>

            {/* Preferences */}
            <div
              className={`${t.cardBg} rounded-2xl p-6 shadow-sm border ${t.border}`}
            >
              <h3 className={`font-bold text-lg mb-4 ${t.textPrimary}`}>
                Preferences
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${t.textPrimary}`}>
                    Dark Mode
                  </span>
                  <ToggleSwitch checked={isDark} onChange={toggleTheme} />
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${t.textPrimary}`}>
                    Email notifications
                  </span>
                  <ToggleSwitch
                    checked={notifications}
                    onChange={() => setNotifications((n) => !n)}
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className={`text-sm font-medium ${t.textPrimary}`}>
                    Language
                  </span>
                  <select
                    className={`${t.mutedBg} border ${t.border} rounded-xl px-4 py-2 text-sm ${t.textPrimary} focus:border-[#C9974A] outline-none`}
                    defaultValue="en"
                  >
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
              <h3 className="font-bold text-lg mb-4 text-red-600">Danger Zone</h3>
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
