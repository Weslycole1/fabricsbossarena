import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../hooks/useToast";
import { supabase } from "../lib/supabase";

interface AccountProps {
  wishlistLength?: number;
  cartLength?: number;
  clearWishlist: () => void;
}

interface ProfileRow {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
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
}) => {
  const { isDark } = useTheme();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        checked ? "bg-[#C9974A]" : isDark ? "bg-[#2C2018]" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
};

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
  const { t } = useTheme();
  const [visible, setVisible] = useState(false);
  const strength = getPasswordStrength(value);
  const labelClass = `text-sm font-medium ${t.textSecondary} mb-1 block`;
  const inputClass = `${t.inputBg} border ${t.border} rounded-xl px-4 py-3 w-full focus:border-[#C9974A] focus:ring-1 focus:ring-[#C9974A] outline-none ${t.textPrimary}`;

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} pr-12`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 ${t.textSecondary} hover:text-[#C9974A] text-sm`}
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
          <p className={`text-xs ${t.textSecondary} mt-1`}>{strength.label}</p>
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
  const { t, isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [userId, setUserId] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [memberSinceYear, setMemberSinceYear] = useState<number | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // Always load the CURRENTLY authenticated user's profile — never hardcoded,
  // never another user's data. If no profile row exists yet (e.g. a signup
  // flow that didn't create one), create it automatically for this user id.
  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setLoadingProfile(true);

      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData?.user;

      if (userError || !user) {
        if (!mounted) return;
        navigate("/login");
        return;
      }

      if (!mounted) return;
      setUserId(user.id);
      if (user.created_at) {
        setMemberSinceYear(new Date(user.created_at).getFullYear());
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, first_name, last_name, phone")
        .eq("id", user.id)
        .maybeSingle<ProfileRow>();

      if (!mounted) return;

      if (profileError) {
        showToast(`Failed to load profile: ${profileError.message}`, "error");
        setEmail(user.email ?? "");
        setLoadingProfile(false);
        return;
      }

      if (profile) {
        setFirstName(profile.first_name ?? "");
        setLastName(profile.last_name ?? "");
        setEmail(profile.email ?? user.email ?? "");
        setPhone(profile.phone ?? "");
        setLoadingProfile(false);
        return;
      }

      // No profile row for this user yet — create one automatically.
      const { data: created, error: createError } = await supabase
        .from("profiles")
        .insert({ id: user.id, email: user.email ?? "" })
        .select("id, email, first_name, last_name, phone")
        .single<ProfileRow>();

      if (!mounted) return;

      if (createError || !created) {
        setEmail(user.email ?? "");
      } else {
        setFirstName(created.first_name ?? "");
        setLastName(created.last_name ?? "");
        setEmail(created.email ?? user.email ?? "");
        setPhone(created.phone ?? "");
      }
      setLoadingProfile(false);
    };

    void loadProfile();
    return () => {
      mounted = false;
    };
  }, [navigate, showToast]);

  const fullName = `${firstName} ${lastName}`.trim() || "Your Account";
  const avatarLetter = (firstName[0] || email[0] || "U").toUpperCase();

  const statValues = {
    orders: 0,
    wishlist: wishlistLength,
    saved: 0,
  };

  const handleSaveProfile = async () => {
    if (!userId) return;
    setSavingProfile(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      })
      .eq("id", userId); // scoped to the current user only

    setSavingProfile(false);

    if (error) {
      showToast(`Failed to save profile: ${error.message}`, "error");
      return;
    }
    showToast("Profile saved successfully!", "success");
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Please fill in all password fields.", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (newPassword === currentPassword) {
      showToast("New password must be different from the current password.", "error");
      return;
    }

    setSavingPassword(true);

    // Re-authenticate with the current password first — this both verifies
    // it's correct and confirms this is really the account owner before we
    // let them change the password.
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (verifyError) {
      setSavingPassword(false);
      showToast("Current password is incorrect.", "error");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setSavingPassword(false);

    if (updateError) {
      showToast(updateError.message, "error");
      return;
    }

    showToast("Password updated!", "success");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const cardClass = `${t.cardBg} rounded-2xl p-6 shadow-sm border ${t.border}`;
  const cardHeadingClass = `text-lg font-bold ${t.headingDark} mb-4 pb-2 border-b ${t.border}`;
  const labelClass = `text-sm font-medium ${t.textSecondary} mb-1 block`;
  const inputClass = `${t.inputBg} border ${t.border} rounded-xl px-4 py-3 w-full focus:border-[#C9974A] focus:ring-1 focus:ring-[#C9974A] outline-none ${t.textPrimary}`;

  return (
    <div className={`min-h-screen overflow-x-hidden ${t.pageBg}`}>
      <Navbar
        onLogout={handleLogout}
        wishlistLength={wishlistLength}
        cartLength={cartLength}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
        <h1 className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 ${t.headingDark}`}>
          My Account
        </h1>

        {loadingProfile ? (
          <LoadingSpinner label="Loading your account..." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile card */}
            <div
              className={`${t.cardBg} rounded-2xl p-6 sm:p-8 shadow-sm border ${t.border} text-center lg:col-span-1 h-fit w-full`}
            >
              <div className="bg-gradient-to-br from-[#C9974A] to-[#8a3b21] w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-lg">
                {avatarLetter}
              </div>
              <h2 className={`text-2xl font-bold mt-4 ${t.headingDark}`}>{fullName}</h2>
              <p className={`${t.textSecondary} text-sm mt-1`}>{email}</p>
              <span className="bg-[#C9974A]/10 text-[#C9974A] text-xs font-semibold px-4 py-1.5 rounded-full mt-3 inline-block">
                Member since {memberSinceYear ?? "—"}
              </span>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-6">
                {PROFILE_STATS.map((stat) => (
                  <div
                    key={stat.key}
                    className={`${t.mutedBg} rounded-xl p-2 sm:p-3 text-center`}
                  >
                    <p className="text-[#C9974A] font-bold text-base sm:text-xl">
                      {statValues[stat.key]}
                    </p>
                    <p className={`${t.textSecondary} text-[10px] sm:text-xs`}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings cards */}
            <div className="lg:col-span-2 flex flex-col gap-6 w-full">
              {/* Personal Information */}
              <div className={cardClass}>
                <h3 className={cardHeadingClass}>Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="mb-4">
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="bg-[#C9974A] hover:bg-[#b8863a] text-white font-bold rounded-xl px-6 py-2.5 transition shadow-sm disabled:opacity-60"
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>

              {/* Change Password */}
              <div className={cardClass}>
                <h3 className={cardHeadingClass}>Change Password</h3>
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
                  onClick={handleUpdatePassword}
                  disabled={savingPassword}
                  className="mt-4 bg-[#2C1810] hover:bg-[#3d2415] text-white font-bold rounded-xl px-6 py-2.5 transition shadow-sm disabled:opacity-60"
                >
                  {savingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>

              {/* Preferences */}
              <div className={cardClass}>
                <h3 className={cardHeadingClass}>Preferences</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${t.textSecondary}`}>
                      Dark Mode
                    </span>
                    <ToggleSwitch checked={isDark} onChange={toggleTheme} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${t.textSecondary}`}>
                      Email notifications
                    </span>
                    <ToggleSwitch
                      checked={notifications}
                      onChange={() => setNotifications((n) => !n)}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className={`text-sm font-medium ${t.textSecondary}`}>
                      Language
                    </span>
                    <select
                      className={`${inputClass} w-auto text-sm py-2`}
                      defaultValue="en"
                    >
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div
                className={`rounded-2xl p-6 shadow-sm border ${
                  isDark ? "border-red-900/40 bg-red-500/5" : "border-red-100 bg-red-50/30"
                }`}
              >
                <h3
                  className={`text-lg font-bold text-red-500 mb-4 pb-2 border-b ${
                    isDark ? "border-red-900/40" : "border-red-100"
                  }`}
                >
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
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Account;
