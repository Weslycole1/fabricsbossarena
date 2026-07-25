import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "./ui/Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Delete",
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onCancel}
        disabled={busy}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] animate-fadeIn"
      />
      <div className="relative bg-white rounded-xl2 shadow-premium-lg w-full max-w-sm p-6 animate-scaleIn">
        <div className="h-11 w-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <AlertTriangle size={22} strokeWidth={2} />
        </div>
        <h3
          id="confirm-dialog-title"
          className="font-display text-lg font-semibold text-brand-ink mb-1.5"
        >
          {title}
        </h3>
        <p className="text-sm text-brand-muted mb-6 leading-relaxed">
          {description}
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" size="md" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button
            ref={confirmRef}
            variant="danger"
            size="md"
            onClick={onConfirm}
            loading={busy}
            className="!bg-red-600 !text-white !border-red-600 hover:!bg-red-700"
          >
            {busy ? "Deleting…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
