"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

type Props = { open: boolean; onClose: () => void };

export default function ImpressumSheet({ open, onClose }: Props) {
  // ESC для закрытия + блок скролла фона
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
          {/* overlay */}
          <motion.div
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* modal (сверху, по центру) */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-8 z-[95] w-[92%] max-w-[820px] -translate-x-1/2 rounded-3xl border border-[#2d69ff]/35 bg-white shadow-[0_30px_120px_-20px_rgba(0,0,0,.35)]"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {/* header */}
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

            {/* content */}
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
                  We are not the seller of listed items and are not responsible for
                  external shop content.
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
