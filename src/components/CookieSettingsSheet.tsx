"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  ts: number;
};

const KEY = "feelre:consent:v1";

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}
function writeConsent(c: Consent) {
  localStorage.setItem(KEY, JSON.stringify(c));
  window.dispatchEvent(new CustomEvent("feelre:consent-updated", { detail: c }));
}

type Props = { open: boolean; onClose: () => void };

export default function CookieSettingsSheet({ open, onClose }: Props) {
  const existing = readConsent();
  const [analytics, setAnalytics] = useState(existing?.analytics ?? true);
  const [marketing, setMarketing] = useState(existing?.marketing ?? false);

  // ESC + lock scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const save = () => {
    writeConsent({ necessary: true, analytics, marketing, ts: Date.now() });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-8 z-[95] w-[92%] max-w-[820px] -translate-x-1/2 rounded-3xl border border-[#2d69ff]/35 bg-white shadow-[0_30px_120px_-20px_rgba(0,0,0,.35)]"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <div className="relative rounded-t-3xl bg-gradient-to-b from-[#f2eaff] to-white p-5">
              <h2 className="text-[22px] font-semibold">Cookie Settings</h2>
              <button
                aria-label="Close"
                onClick={onClose}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl bg-black/5 hover:bg-black/10"
              >
                <span className="relative block h-4 w-4">
                  <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] w-full rotate-45 bg-black" />
                  <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] w-full -rotate-45 bg-black" />
                </span>
              </button>
            </div>

            <div className="px-6 pb-6">
              <p className="mb-4 text-[15px] text-neutral-700">
                We use cookies for essential functionality, analytics and marketing.
                You can change your preferences anytime.
              </p>

              <div className="space-y-3">
                <ToggleRow
                  label="Necessary"
                  description="Required for the site to work."
                  checked
                  disabled
                />
                <ToggleRow
                  label="Analytics"
                  description="Helps us improve FEELRE."
                  checked={analytics}
                  onChange={setAnalytics}
                />
                <ToggleRow
                  label="Marketing"
                  description="Personalised offers and reminders."
                  checked={marketing}
                  onChange={setMarketing}
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setAnalytics(true);
                    setMarketing(true);
                    save();
                  }}
                  className="h-11 rounded-xl bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] px-5 text-white"
                >
                  Accept all
                </button>
                <button
                  onClick={() => {
                    setAnalytics(false);
                    setMarketing(false);
                    save();
                  }}
                  className="h-11 rounded-xl border border-neutral-300 px-5"
                >
                  Reject all
                </button>
                <button
                  onClick={save}
                  className="ml-auto h-11 rounded-xl bg-neutral-900 px-5 text-white"
                >
                  Save preferences
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-neutral-200 p-4">
      <div>
        <div className="text-[15px] font-medium">{label}</div>
        {description && (
          <div className="text-[13px] text-neutral-500">{description}</div>
        )}
      </div>
      <label className="inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer hidden"
          checked={!!checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
        />
        <span
          className={`relative h-6 w-11 rounded-full ${
            disabled ? "bg-neutral-200" : "bg-neutral-300"
          } peer-checked:bg-[#9E73FA]`}
        >
          <span className="absolute left-[3px] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
        </span>
      </label>
    </div>
  );
}

export const CookieConsentStorage = {
  read: readConsent,
  write: writeConsent,
  key: KEY,
};
