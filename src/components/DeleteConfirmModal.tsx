"use client";

interface DeleteConfirmModalProps {
  open: boolean;
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  open,
  name,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-3">
      <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/90 p-5 shadow-2xl backdrop-blur-xl dark:bg-slate-900/80">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Delete Appointment?
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          This will permanently remove{" "}
          <span className="font-semibold">{name || "this appointment"}</span>.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 flex-1 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-11 flex-1 rounded-lg bg-red-500 px-3 text-sm font-semibold text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
