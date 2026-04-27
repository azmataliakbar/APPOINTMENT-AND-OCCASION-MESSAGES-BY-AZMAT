"use client";

import { CheckCircle2, XCircle } from "lucide-react";

interface ToastProps {
  open: boolean;
  message: string;
  variant?: "success" | "error";
}

export function Toast({ open, message, variant = "success" }: ToastProps) {
  if (!open) return null;
  const success = variant === "success";
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex max-w-xs items-start gap-2 rounded-xl border px-4 py-3 text-sm shadow-xl backdrop-blur ${
        success
          ? "border-emerald-300/50 bg-emerald-500/90 text-white"
          : "border-red-300/50 bg-red-500/90 text-white"
      }`}
    >
      {success ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
      <p className="leading-5">{message}</p>
    </div>
  );
}
