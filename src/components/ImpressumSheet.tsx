// src/components/ImpressumSheet.tsx
"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import { useEffect } from "react";

type Props = { open: boolean; onClose: () => void };

export default function ImpressumSheet({ open, onClose }: Props) {
  const prefersReduced = useReducedMotion();

  // ✅ Явный тип Transition — снимает ошибки TS
  const tween: Transition = prefersReduced
    ? { duration: 0 }
    : { type: "tween", ease: [0.22, 0.16, 0.2, 1], duration: 0.22 };

  // esc + scroll lock
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

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-[1px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={tween}
          />

          {/* Sheet / Dialog */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="impressum-title"
            className="
              fixed left-1/2 top-6 z-[95] w-[92%] -translate-x-1/2
              md:top-12 md:max-w-[760px]
            "
            initial={{ y: -28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -28, opacity: 0 }}
            transition={tween}
          >
            <div className="rounded-3xl border border-black/10 bg-white shadow-[0_12px_48px_rgba(0,0,0,0.16)]">
              {/* Header */}
              <div className="relative rounded-t-3xl bg-gradient-to-b from-[#EEE7FF] to-white px-5 py-5 md:px-6">
                <h2 id="impressum-title" className="text-[20px] md:text-[22px] font-extrabold tracking-[-0.01em]">
                  Legal notice (Imprint)
                </h2>

                <button
                  aria-label="Close"
                  onClick={onClose}
                  className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl hover:bg-black/5"
                >
                  <span className="relative block h-4 w-4">
                    <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] w-full rotate-45 bg-black" />
                    <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] w-full -rotate-45 bg-black" />
                  </span>
                </button>
              </div>

              {/* Content */}
              <div className="px-5 pb-5 pt-3 md:px-6 md:pb-6">
                <div className="prose max-w-none prose-p:my-3 prose-strong:font-semibold text-[14px] leading-[1.55] text-neutral-800">
                  <p><strong>FEELRE — AI Shopping Assistant</strong></p>
                  <p>Responsible person: Daniil Yefremov</p>
                  <p>Email: <a href="mailto:hello@feerly.com">hello@feerly.com</a></p>
                  <p>Address: [c/o or PO Box], [City], Germany</p>

                  <p><strong>Kleinunternehmer according to §19 UStG (no VAT charged).</strong></p>

                  <p>
                    <strong>Disclaimer:</strong><br />
                    FEELRE provides AI-assisted product recommendations and affiliate links.
                    We are not the seller of listed items and are not responsible for external shop content.
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}