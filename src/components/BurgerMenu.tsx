// src/components/BurgerMenu.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { REGIONS } from "@/data/regions";
import { supabase } from "@/lib/supabase";

type Props = { open: boolean; onClose: () => void };
type Profile = { nickname: string | null };

// ── helpers
function openPanel(panel: "about" | "faq") {
  document.querySelector("#chat-box")?.scrollIntoView({ behavior: "smooth", block: "center" });
  window.dispatchEvent(new CustomEvent("feelre:open-panel", { detail: { panel } }));
}
const errMsg = (e: unknown) => (e instanceof Error ? e.message : typeof e === "string" ? e : "Unknown error");

// ── component
export default function BurgerMenu({ open, onClose }: Props) {
  const router = useRouter();

  // prefs
  const [language, setLanguage] = useState("en");
  const [region, setRegion] = useState("DE");

  // auth + profile
  const [sessionReady, setSessionReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const isAuthed = !!userId;

  // UI
  const [accountOpen, setAccountOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // init prefs
  useEffect(() => {
    const L = localStorage.getItem("feelre:lang");
    const R = localStorage.getItem("feelre:region");
    if (L) setLanguage(L);
    if (R) setRegion(R);
  }, []);
  useEffect(() => localStorage.setItem("feelre:lang", language), [language]);
  useEffect(() => {
    localStorage.setItem("feelre:region", region);
    window.dispatchEvent(new CustomEvent("feelre:region-changed", { detail: { region } }));
  }, [region]);

  // watch auth
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const u = data.session?.user ?? null;
      setUserId(u?.id ?? null);
      setEmail(u?.email ?? null);
      setSessionReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      const u = s?.user ?? null;
      setUserId(u?.id ?? null);
      setEmail(u?.email ?? null);
      // подгружаем профиль при каждом изменении
      if (u?.id) fetchProfile(u.id);
      else setProfile(null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch profile
  async function fetchProfile(uid: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("id", uid)
      .single();
    if (!error) setProfile(data as Profile);
  }

  // начальная загрузка профиля, когда уже известен userId
  useEffect(() => {
    if (userId) fetchProfile(userId);
  }, [userId]);

  const displayName = useMemo(() => {
    return profile?.nickname || email || "User";
  }, [profile?.nickname, email]);

  async function handleLogout() {
    try {
      setSigningOut(true);
      await supabase.auth.signOut();
      onClose();
      router.push("/");
      router.refresh();
      window.dispatchEvent(new CustomEvent("feelre:user-signed-out"));
    } catch (e) {
      alert("Failed to sign out: " + errMsg(e));
    } finally {
      setSigningOut(false);
    }
  }

  // esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          />
          <motion.aside
            style={{ willChange: "transform" }}
            className="fixed right-0 top-0 z-50 h-full w-[92%] max-w-[520px] p-3 sm:p-4"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <div className="h-full overflow-hidden rounded-3xl bg-white shadow-[0_20px_80px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
              {/* header */}
              <div className="relative p-5">
                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6]" />
                <button
                  onClick={() => {
                    if (!isAuthed) {
                      // если гость — ведём на sign-in
                      onClose();
                      return router.push("/auth/sign-in");
                    }
                    setAccountOpen(v => !v);
                  }}
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
                      <div className="text-[17px] font-semibold text-neutral-900">
                        {sessionReady ? (isAuthed ? `@${displayName}` : "Guest") : "…"}
                      </div>
                      <div className="text-[13px] text-neutral-500">
                        {sessionReady ? (isAuthed ? "Account settings" : "Not signed in") : "Checking…"}
                      </div>
                    </div>
                  </div>
                  <motion.svg
                    width="18" height="18" viewBox="0 0 24 24"
                    animate={{ rotate: accountOpen ? 90 : 0 }} transition={{ duration: 0.25 }}
                    className="mr-1 opacity-70"
                  >
                    <path d="M8 10l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </motion.svg>
                </button>

                <motion.button
                  onClick={onClose} aria-label="Close" whileTap={{ scale: 0.9 }}
                  className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-2xl bg-black/5 hover:bg-black/10"
                >
                  <motion.div animate={{ rotate: open ? 180 : 0 }} className="relative h-5 w-5">
                    <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 block h-[2px] bg-black rotate-45" />
                    <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 block h-[2px] bg-black -rotate-45" />
                  </motion.div>
                </motion.button>
              </div>

              {/* content */}
              <div className="px-5 pb-5">
                {/* Account Settings (только для авторизованного) */}
                <AnimatePresence>
                  {isAuthed && accountOpen && (
                    <motion.div
                      key="account-panel"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="mb-4 overflow-hidden"
                    >
                      <AccountSettingsPanel email={email ?? ""} onClose={() => setAccountOpen(false)} />
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

                {/* Навигация */}
                <nav className="grid gap-1 text-[16px]">
                  <NavButton onClick={() => { onClose(); setTimeout(() => openPanel("about"), 120); }}>
                    About Us
                  </NavButton>
                  <NavButton onClick={() => { onClose(); setTimeout(() => openPanel("faq"), 120); }}>
                    FAQ
                  </NavButton>

                  <Divider />

                  <NavButton
                    onClick={() => {
                      onClose();
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        window.dispatchEvent(new CustomEvent("feelre:open-impressum"));
                      }, 160);
                    }}
                  >
                    Imprint
                  </NavButton>
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

                  <NavLink href="/privacy" onClick={onClose}>Privacy Policy</NavLink>
                  <NavLink href="/terms" onClick={onClose}>Terms of Service</NavLink>

                  <Divider />

                  {/* Auth area */}
                  {sessionReady && (
                    isAuthed ? (
                      <NavButton onClick={handleLogout} className="text-red-600 hover:bg-red-50">
                        {signingOut ? "Signing out…" : "Log out"}
                      </NavButton>
                    ) : (
                      <>
                        <NavLink href="/auth/sign-in" onClick={onClose}>Sign in</NavLink>
                        <NavLink href="/auth/sign-up" onClick={onClose}>Create account</NavLink>
                      </>
                    )
                  )}
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

/* ── helpers UI ────────────────────────────────────────────── */

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

function NavButton({
  onClick, children, className,
}: { onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`group w-full rounded-xl px-3 py-2 text-left hover:bg-neutral-50 active:bg-neutral-100 ${className ?? ""}`}
    >
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

/* ── Account Settings (только для авторизованного) ─────────── */

function AccountSettingsPanel({ onClose, email }: { onClose: () => void; email: string }) {
  const [username, setUsername] = useState("");
  const [newEmail, setNewEmail] = useState(email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // подгружаем ник из профиля (для редактирования)
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id;
      if (!uid) return;
      const { data: prof } = await supabase.from("profiles").select("nickname").eq("id", uid).single();
      setUsername(prof?.nickname ?? "");
    });
  }, []);

  async function postJSON(url: string, body: unknown) {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function saveProfile() {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id;
      if (!uid) throw new Error("No user");
      await supabase.from("profiles").upsert({ id: uid, nickname: username });
      setMsg("Profile saved.");
    } catch (e) {
      setMsg(errMsg(e));
    } finally {
      setLoading(false);
    }
  }

  async function changeEmail() {
    setLoading(true);
    try {
      await postJSON("/api/account/change-email", { newEmail });
      setMsg("Email change requested. Check your inbox to confirm.");
    } catch (e) {
      setMsg(errMsg(e));
    } finally {
      setLoading(false);
    }
  }

  async function changePassword() {
    setLoading(true);
    try {
      await postJSON("/api/account/change-password", { currentPassword, newPassword });
      setMsg("Password changed.");
    } catch (e) {
      setMsg(errMsg(e));
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

      <h3 className="mb-2 text-[16px] font-semibold">Account Settings</h3>
      {msg && <div className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">{msg}</div>}

      {/* Username (profile) */}
      <Row label="Username">
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-[15px]" />
        <div className="mt-2">
          <button onClick={saveProfile} disabled={loading} className="h-9 rounded-xl bg-neutral-900 px-3 text-white">
            Save username
          </button>
        </div>
      </Row>

      {/* Email */}
      <Row label="Email">
        <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-[15px]" />
        <div className="mt-2">
          <button onClick={changeEmail} disabled={loading} className="h-9 rounded-xl border px-3">
            Change email
          </button>
        </div>
      </Row>

      {/* Password */}
      <Row label="Change Password">
        <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mb-2 w-full rounded-xl border px-3 py-2" />
        <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
        <div className="mt-2">
          <button onClick={changePassword} disabled={loading} className="h-9 rounded-xl border px-3">
            Change password
          </button>
        </div>
      </Row>
    </div>
  );
}
