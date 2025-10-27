// src/components/CookieSettingsSheet.tsx
"use client";

import { useEffect, useState } from "react";
import ModalBase from "@/components/ui/ModalBase";
import { CookieConsentStorage, type Consent } from "@/lib/cookie-consent";

type Props = { open: boolean; onClose: () => void };

export default function CookieSettingsSheet({ open, onClose }: Props) {
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  // подхватываем ранее сохранённые значения
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
    <ModalBase open={open} onClose={onClose} className="rounded-3xl border border-[#2d69ff]/35 bg-white shadow-xl">
      <div className="relative rounded-t-3xl bg-gradient-to-b from-[#f2eaff] to-white p-5">
        <h2 className="text-[22px] font-semibold">Cookie Settings</h2>
        <button
          onClick={onClose}
          aria-label="Close"
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
          We use cookies for essential functionality, analytics and marketing. You can change your preferences anytime.
        </p>

        <div className="space-y-3">
          <ToggleRow label="Necessary" checked disabled description="Required for the site to work." />
          <ToggleRow label="Analytics" checked={analytics} onChange={setAnalytics} description="Helps us improve FEELRE." />
          <ToggleRow label="Marketing" checked={marketing} onChange={setMarketing} description="Personalised offers and reminders." />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            className="h-11 rounded-xl bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] px-5 text-white"
            onClick={() => save({ analytics: true, marketing: true })}
          >
            Accept all
          </button>
          <button
            className="h-11 rounded-xl border border-neutral-300 px-5"
            onClick={() => save({ analytics: false, marketing: false })}
          >
            Reject all
          </button>
          <button className="ml-auto h-11 rounded-xl bg-neutral-900 px-5 text-white" onClick={() => save()}>
            Save preferences
          </button>
        </div>
      </div>
    </ModalBase>
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
      <div className="min-w-0">
        <div className="text-[15px] font-medium">{label}</div>
        {description && (
          <div className="text-[13px] text-neutral-500">{description}</div>
        )}
      </div>

      {/* Тумблер */}
      <label className="relative inline-flex cursor-pointer items-center select-none">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={!!checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          aria-label={label}
        />
        <span
          className={[
            // трек
            "relative block h-7 w-12 rounded-full transition-colors duration-200",
            disabled ? "bg-neutral-200" : "bg-neutral-300 peer-checked:bg-[#9E73FA]",
            // focus-обводка (без outline-конфликтов)
            "peer-focus-visible:ring-2 peer-focus-visible:ring-[#9E73FA] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white",
            // Кружок — через ::before, чтобы работал peer-checked
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




