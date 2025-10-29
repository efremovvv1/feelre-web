// src/components/CookieSettingsSheet.tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import { CookieConsentStorage, type Consent } from "@/lib/cookie-consent";

type Props = { open: boolean; onClose: () => void };

export default function CookieSettingsSheet({ open, onClose }: Props) {
  const prefersReduced = useReducedMotion();
  const tween: Transition = prefersReduced
    ? { duration: 0 }
    : { type: "tween", ease: [0.22, 0.16, 0.2, 1], duration: 0.22 };

  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  // esc + scroll-lock
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

  // подхватываем ранее сохранённые значения при открытии
  useEffect(() => {
    if (!open) return;
    const c = CookieConsentStorage.read();
    if (c) {
      setAnalytics(c.analytics);
      setMarketing(c.marketing);
    }
  }, [open]);

  const save = (next?: Partial<Consent>) => {
    const base: Consent = {
      necessary: true,
      analytics,
      marketing,
      ts: Date.now(),
    };
    CookieConsentStorage.write({ ...base, ...next });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* overlay */}
          <motion.div
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-[1px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={tween}
          />

          {/* sheet */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-title"
            className="fixed left-1/2 top-6 z-[95] w-[92%] -translate-x-1/2 md:top-12 md:max-w-[760px]"
            initial={{ y: -28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -28, opacity: 0 }}
            transition={tween}
          >
            <div className="rounded-3xl border border-black/10 bg-white shadow-[0_12px_48px_rgba(0,0,0,0.16)]">
              {/* header */}
              <div className="relative rounded-t-3xl bg-gradient-to-b from-[#EEE7FF] to-white px-5 py-5 md:px-6">
                <h2 id="cookie-title" className="text-[20px] md:text-[22px] font-extrabold tracking-[-0.01em]">
                  Cookie settings
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl hover:bg-black/5"
                >
                  <span className="relative block h-4 w-4">
                    <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] w-full rotate-45 bg-black" />
                    <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] w-full -rotate-45 bg-black" />
                  </span>
                </button>
              </div>

              {/* content */}
              <div className="px-5 pb-5 pt-3 md:px-6 md:pb-6">
                <p className="mb-4 text-[14px] md:text-[15px] text-neutral-700">
                  We use cookies for essential functionality, analytics, and marketing. You can change your
                  preferences anytime.
                </p>

                <div className="space-y-3">
                  <ToggleRow
                    label="Necessary"
                    checked
                    disabled
                    description="Required for the site to work."
                  />
                  <ToggleRow
                    label="Analytics"
                    checked={analytics}
                    onChange={setAnalytics}
                    description="Helps us improve FEELRE."
                  />
                  <ToggleRow
                    label="Marketing"
                    checked={marketing}
                    onChange={setMarketing}
                    description="Personalised offers and reminders."
                  />
                </div>

                {/* actions */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button
                    className="h-11 w-full rounded-xl bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] px-5 text-white sm:w-auto"
                    onClick={() => save({ analytics: true, marketing: true })}
                  >
                    Accept all
                  </button>
                  <button
                    className="h-11 w-full rounded-xl border border-neutral-300 px-5 sm:w-auto"
                    onClick={() => save({ analytics: false, marketing: false })}
                  >
                    Reject all
                  </button>
                  <button
                    className="h-11 w-full rounded-xl bg-neutral-900 px-5 text-white sm:ml-auto sm:w-auto"
                    onClick={() => save()}
                  >
                    Save preferences
                  </button>
                </div>
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
  checked,
  onChange,
  disabled,
  description,
}: {
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-neutral-200 p-4">
      <div className="min-w-0 pr-3">
        <div className="text-[15px] font-medium">{label}</div>
        {description && (
          <div className="text-[13px] text-neutral-500">{description}</div>
        )}
      </div>

      {/* toggle */}
      <label className="relative inline-flex cursor-pointer items-center select-none">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={!!checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          aria-label={label}
        />
        <span
          className={[
            "relative block h-7 w-12 rounded-full transition-colors duration-200",
            disabled ? "bg-neutral-200" : "bg-neutral-300 peer-checked:bg-[#9E73FA]",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-[#9E73FA] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white",
            "before:content-[''] before:absolute before:left-0.5 before:top-0.5",
            "before:h-6 before:w-6 before:rounded-full before:bg-white before:shadow",
            "before:transition-transform before:duration-200",
            "peer-checked:before:translate-x-5",
          ].join(" ")}
        />
      </label>
    </div>
  );
}