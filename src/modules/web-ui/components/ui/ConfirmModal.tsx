// src/components/ui/ConfirmModal.tsx
"use client";
import ModalBase from "@/modules/web-ui/components/ui/ModalBase";

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmModal({
  open,
  title = "Please confirm",
  message = "Are you sure?",
  onCancel,
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
}: Props) {
  return (
    <ModalBase open={open} onClose={onCancel} className="rounded-3xl border bg-white">
      <div className="p-5">
        <h3 className="text-[18px] font-semibold">{title}</h3>
        <p className="mt-2 text-[14px] text-neutral-600">{message}</p>
        <div className="mt-4 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="h-10 rounded-xl border border-neutral-300 px-4"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="h-10 rounded-xl bg-red-600 px-4 text-white"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
