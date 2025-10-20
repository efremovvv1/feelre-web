"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { REGIONS } from "@/data/regions";

type Props = { open: boolean; onClose: () => void };

// Открыть карточки About / FAQ
function openPanel(panel: "about" | "faq") {
  document.querySelector("#chat-box")?.scrollIntoView({ behavior: "smooth", block: "center" });
  window.dispatchEvent(new CustomEvent("feelre:open-panel", { detail: { panel } }));
}


// Безопасное получение текста ошибки
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Unknown error";
  }
}

export default function BurgerMenu({ open, onClose }: Props) {
  const [language, setLanguage] = useState("en");
  const [region, setRegion] = useState("DE");
  const [accountOpen, setAccountOpen] = useState(false);

  // Init from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("feelre:lang");
    const savedRegion = localStorage.getItem("feelre:region");
    if (savedLang) setLanguage(savedLang);
    if (savedRegion) setRegion(savedRegion);
  }, []);

  useEffect(() => {
    localStorage.setItem("feelre:lang", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("feelre:region", region);
    window.dispatchEvent(new CustomEvent("feelre:region-changed", { detail: { region } }));
  }, [region]);

  // Close by ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* overlay */}
          <motion.div
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* panel */}
          <motion.aside
            style={{ willChange: "transform" }}
            className="fixed right-0 top-0 z-50 h-full w-[92%] max-w-[520px] p-3 sm:p-4"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <div className="h-full overflow-hidden rounded-3xl bg-white shadow-[0_20px_80px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
              {/* header */}
              <div className="relative p-5">
                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6]" />

                {/* profile row */}
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="mt-2 flex w-full items-center justify-between gap-3 rounded-2xl px-2 py-1 transition hover:bg-black/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-black/5">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke="black" strokeWidth="1.5" />
                        <path d="M4 20c1.7-3.6 5-5.5 8-5.5s6.3 1.9 8 5.5" stroke="black" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <div className="leading-tight text-left">
                      <div className="text-[17px] font-semibold text-neutral-900">@efremovvv</div>
                      <div className="text-[13px] text-neutral-500">Account settings</div>
                    </div>
                  </div>

                  <motion.svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    animate={{ rotate: accountOpen ? 90 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="mr-1 opacity-70"
                  >
                    <path d="M8 10l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </motion.svg>
                </button>

                {/* close button */}
                <motion.button
                  onClick={onClose}
                  aria-label="Close"
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-2xl bg-black/5 hover:bg-black/10"
                >
                  <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    className="relative h-5 w-5"
                  >
                    <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 block h-[2px] bg-black rotate-45" />
                    <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 block h-[2px] bg-black -rotate-45" />
                  </motion.div>
                </motion.button>
              </div>

              {/* content */}
              <div className="px-5 pb-5">
                {/* Account Settings */}
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      key="account-panel"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="mb-4 overflow-hidden"
                    >
                      <AccountSettingsPanel onClose={() => setAccountOpen(false)} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Preferences */}
                <div className="space-y-3">
                  <Row label="Language">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-[15px]"
                    >
                      <option value="en">English 🇬🇧</option>
                      <option value="de">Deutsch 🇩🇪</option>
                      <option value="uk">Українська 🇺🇦</option>
                      <option value="ru">Русский 🇷🇺</option>
                    </select>
                  </Row>

                  <Row label="Region">
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-[15px]"
                    >
                      {REGIONS.map((r) => (
                        <option key={r.code} value={r.code}>
                          {r.flag} {r.name}
                        </option>
                      ))}
                    </select>
                  </Row>
                </div>

                <Divider />

              {/* Navigation */}
                <nav className="grid gap-1 text-[16px]">
                {/* About + FAQ */}
                <NavButton
                    onClick={() => {
                    onClose();
                    setTimeout(() => openPanel("about"), 120);
                    }}
                >
                    About Us
                </NavButton>

                <NavButton
                    onClick={() => {
                    onClose();
                    setTimeout(() => openPanel("faq"), 120);
                    }}
                >
                    FAQ
                </NavButton>

                <Divider />

                {/* Imprint */}
                <NavButton
                    onClick={() => {
                    onClose();
                    setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: "smooth" }); // 👈 просто плавно наверх
                        window.dispatchEvent(new CustomEvent("feelre:open-impressum")); // 👈 открываем карточку
                    }, 160);
                    }}
                >
                    Imprint
                </NavButton>

                {/* Cookie Settings */}
                <NavButton
                    onClick={() => {
                    onClose();
                    setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        window.dispatchEvent(new CustomEvent("feelre:open-cookies"));
                    }, 160);
                    }}
                >
                    Cookie Settings
                </NavButton>

                <Divider />

                <NavLink href="/privacy" onClick={onClose}>
                    Privacy Policy
                </NavLink>
                <NavLink href="/terms" onClick={onClose}>
                    Terms of Service
                </NavLink>
                </nav>

                <Divider />

                {/* Contacts */}
                <div className="space-y-3">
                  <a href="mailto:hello@feerly.com" className="block text-[15px] hover:text-neutral-700">
                    hello@feerly.com
                  </a>
                  <div className="flex items-center gap-5">
                    {["instagram", "tiktok", "twitter"].map((icon) => (
                      <a key={icon} href="#" className="relative h-7 w-7 transition-opacity hover:opacity-80">
                        <Image src={`/icons/${icon}.png`} alt={icon} fill className="object-contain" sizes="28px" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ——— Helper Components ——— */

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1">
      <div className="text-[13px] font-medium text-neutral-600">{label} :</div>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="my-3 h-px bg-neutral-200/80" />;
}

function NavButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="group w-full rounded-xl px-3 py-2 text-left hover:bg-neutral-50 active:bg-neutral-100">
      <span className="inline-block transition-transform group-hover:translate-x-0.5">{children}</span>
    </button>
  );
}

function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="w-full rounded-xl px-3 py-2 hover:bg-neutral-50 active:bg-neutral-100">
      {children}
    </Link>
  );
}

/* ——— Account Settings (полная версия) ——— */

function AccountSettingsPanel({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState("efremovvv");
  const [email, setEmail] = useState("hello@feerly.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function postJSON(url: string, data: unknown) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function deleteAccount() {
    if (!confirm("Delete account permanently?")) return;
    setLoading(true);
    try {
      await postJSON("/api/account/delete", {});
      setMsg("Account deleted.");
      onClose();
    } catch (err) {
      setMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <button
        onClick={onClose}
        aria-label="Close account panel"
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-xl bg-black/5 hover:bg-black/10"
      >
        <div className="relative h-4 w-4">
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 block h-[2px] bg-black rotate-45" />
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 block h-[2px] bg-black -rotate-45" />
        </div>
      </button>

      <h3 className="text-[16px] font-semibold mb-2">Account Settings</h3>
      {msg && <div className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">{msg}</div>}

      {/* Username */}
      <Row label="Username">
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-[15px]" />
      </Row>

      {/* Email */}
      <Row label="Email">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-[15px]" />
      </Row>

      {/* Password */}
      <Row label="Change Password">
        <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mb-2 w-full rounded-xl border px-3 py-2" />
        <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
      </Row>

      {/* Danger */}
      <div className="mt-5 rounded-xl border border-red-300 bg-red-50 p-3 text-red-800">
        <div className="text-[14px] font-semibold">Danger Zone</div>
        <p className="text-[13px]">Delete your account permanently.</p>
        <button onClick={deleteAccount} disabled={loading} className="mt-2 h-9 rounded-xl bg-red-600 px-3 text-white hover:bg-red-700">
          Delete Account
        </button>
      </div>
    </div>
  );
}
