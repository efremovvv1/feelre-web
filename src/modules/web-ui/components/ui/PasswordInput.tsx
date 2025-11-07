// src/components/ui/PasswordInput.tsx
"use client";

import { useState } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  /** классы для самого <input> */
  inputClassName?: string;
  /** классы для внешнего контейнера (обычно не нужен) */
  containerClassName?: string;
};

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  autoComplete,
  inputClassName,
  containerClassName,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className={`relative ${containerClassName ?? ""}`}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={
          inputClassName ??
          "w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-[#9E73FA]"
        }
      />
      <button
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
      >
        {show ? (
          // открытый глаз
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="currentColor" strokeWidth="1.6"/>
            <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
          </svg>
        ) : (
          // закрытый глаз (перечёркнутый)
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6"/>
            <path d="M1.5 12S5.5 5 12 5c2.3 0 4.3.7 6 1.9" stroke="currentColor" strokeWidth="1.6"/>
            <path d="M22.5 12S18.5 19 12 19c-2.3 0-4.3-.7-6-1.9" stroke="currentColor" strokeWidth="1.6"/>
          </svg>
        )}
      </button>
    </div>
  );
}