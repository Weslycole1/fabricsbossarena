import { useState } from "react";
import { supabase } from "../lib/supabase";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface NewsletterSignupProps {
  className?: string;
}

const NewsletterSignup = ({ className = "" }: NewsletterSignupProps) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "duplicate" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!EMAIL_PATTERN.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setStatus("idle");

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: trimmed });

    setSubmitting(false);

    if (error) {
      // Postgres unique_violation — this email is already subscribed.
      if (error.code === "23505") {
        setStatus("duplicate");
        setMessage("You're already subscribed with this email. 💛");
        return;
      }
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      return;
    }

    setStatus("success");
    setMessage("Subscribed! Watch your inbox for new fabrics and collections. 🎉");
    setEmail("");
  };

  return (
    <div className={className}>
      <p className="text-[#F5EFE1] text-sm font-semibold mb-1">
        Join our newsletter
      </p>
      <p className="text-[#C9974A]/70 text-xs mb-3 max-w-sm">
        New fabrics, arrivals, collections, tailoring supplies, and promotions —
        straight to your inbox.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto sm:mx-0"
        noValidate
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          disabled={submitting}
          className="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-[#F5EFE1] placeholder:text-[#F5EFE1]/40 focus:border-[#C9974A] focus:ring-1 focus:ring-[#C9974A] outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-[#C9974A] hover:bg-[#b8863a] text-white font-bold rounded-xl px-5 py-2.5 text-sm transition disabled:opacity-60 flex-shrink-0"
        >
          {submitting ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {message && (
        <p
          role="status"
          className={`text-xs mt-2 ${
            status === "error"
              ? "text-red-400"
              : status === "duplicate"
              ? "text-[#C9974A]"
              : "text-emerald-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default NewsletterSignup;
