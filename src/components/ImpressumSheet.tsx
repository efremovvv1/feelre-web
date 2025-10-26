"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

type Props = { open: boolean; onClose: () => void };

export default function ImpressumSheet({ open, onClose }: Props) {
  const prefersReduced = useReducedMotion();
  const tween = prefersReduced ? { duration: 0 } : { type: "tween" as const, ease: [0.22, 0.16, 0.2, 1], duration: 0.22 };

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
          <motion.div
            className="fixed inset-0 z-[90] bg-black/40 will-change-[opacity] transform-gpu"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={tween}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-8 z-[95] w-[92%] max-w-[820px] -translate-x-1/2 will-change-[transform,opacity] transform-gpu"
            initial={{ y: -28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -28, opacity: 0 }}
            transition={tween}
          >
            <div className="rounded-3xl border border-[#2d69ff]/35 bg-white shadow-[0_12px_48px_rgba(0,0,0,0.16)]">
              <div className="relative rounded-t-3xl bg-gradient-to-b from-[#f2eaff] to-white p-5">
                <h2 className="text-[22px] font-semibold">Impressum</h2>
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
                <div className="prose max-w-none prose-p:my-3 prose-strong:font-semibold">
                  <p><strong>FEELRE – AI Shopping Assistant</strong></p>
                  <p>Responsible person: Daniil Yefremov</p>
                  <p>Email: hello@feerly.com</p>
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
