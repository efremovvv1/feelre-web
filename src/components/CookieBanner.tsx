// src/components/CookieBanner.tsx
"use client";

import { useEffect, useState } from "react";
import CookieSettingsSheet from "./CookieSettingsSheet";
import { CookieConsentStorage } from "@/lib/cookie-consent";

export default function CookieBanner() {
  const [openSheet, setOpenSheet] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const c = CookieConsentStorage.read();
    setShow(!c);
  }, []);

  if (!show) return null;

  const acceptAll = () => {
    CookieConsentStorage.write({
      necessary: true,
      analytics: true,
      marketing: true,
      ts: Date.now(),
    });
    setShow(false);
  };

  const rejectAll = () => {
    CookieConsentStorage.write({
      necessary: true,
      analytics: false,
      marketing: false,
      ts: Date.now(),
    });
    setShow(false);
  };

  return (
    <>
      <div className="fixed bottom-4 left-0 right-0 z-[65]">
        <div className="mx-auto w-[min(1000px,95%)] rounded-3xl border border-[#2d69ff]/30 bg-white p-5 shadow-[0_30px_100px_-20px_rgba(0,0,0,.35)]">
          <div className="mb-3 text-[24px] font-bold">We use cookies</div>
          <div className="text-[15px] text-neutral-700">
            We use cookies and similar technologies for essential functionality, analytics and marketing.
            Manage your preferences anytime in Cookie Settings.
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={acceptAll} className="h-11 rounded-xl bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] px-5 text-white">
              Accept All
            </button>
            <button onClick={rejectAll} className="h-11 rounded-xl border border-neutral-300 px-5">
              Reject All
            </button>
            <button onClick={() => setOpenSheet(true)} className="ml-auto h-11 rounded-xl bg-neutral-900 px-5 text-white">
              Cookie Settings
            </button>
          </div>
        </div>
      </div>

      <CookieSettingsSheet open={openSheet} onClose={() => setOpenSheet(false)} />
    </>
  );
}
