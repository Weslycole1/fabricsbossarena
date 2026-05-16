import type { ToastType } from "../context/ToastContext";

interface ToastProps {
  message: string;
  type: ToastType;
}

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

const STYLES: Record<ToastType, string> = {
  success: "border-l-4 border-[#25D366]",
  error: "border-l-4 border-red-500",
  info: "border-l-4 border-[#C9974A]",
};

const ICON_BG: Record<ToastType, string> = {
  success: "bg-[#25D366]/10 text-[#25D366]",
  error: "bg-red-50 text-red-500",
  info: "bg-[#C9974A]/10 text-[#C9974A]",
};

const Toast = ({ message, type }: ToastProps) => {
  return (
    <div
      role="alert"
      className={`pointer-events-auto bg-white shadow-lg rounded-xl px-5 py-4 flex items-center gap-3 min-w-[260px] max-w-sm animate-[slideIn_0.3s_ease-out] ${STYLES[type]}`}
    >
      <span
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${ICON_BG[type]}`}
      >
        {ICONS[type]}
      </span>
      <p className="text-[#1A1A1A] text-sm font-medium">{message}</p>
    </div>
  );
};

export default Toast;
