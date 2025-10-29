"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  cubicBezier,
  useReducedMotion,
} from "framer-motion";
import { useRouter } from "next/navigation";

import { REGIONS } from "@/data/regions";
import { supabase } from "@/lib/supabase";
import ConfirmModal from "@/components/ui/ConfirmModal";
import PasswordInput from "./ui/PasswordInput";

// Types
// -----------------------------------------------------------------------------
type Props = { open: boolean; onClose: () => void };

type Profile = { nickname: string | null };

// Utils
// -----------------------------------------------------------------------------
const errMsg = (e: unknown) =>
  e instanceof Error ? e.message : typeof e === "string" ? e : "Unknown error";

// Component
// -----------------------------------------------------------------------------
export default function BurgerMenu({ open, onClose }: Props) {
  const router = useRouter();
  const prefersReduced = useReducedMotion();

  // Prefs
  const [language, setLanguage] = useState("en");
  const [region, setRegion] = useState("DE");

  // Auth
  const [sessionReady, setSessionReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const isAuthed = !!userId;

  // UI
  const [accountOpen, setAccountOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Load prefs
  useEffect(() => {
    setLanguage(localStorage.getItem("feelre:lang") || "en");
    setRegion(localStorage.getItem("feelre:region") || "DE");
  }, []);

  useEffect(() => localStorage.setItem("feelre:lang", language), [language]);

  useEffect(() => {
    localStorage.setItem("feelre:region", region);
    window.dispatchEvent(
      new CustomEvent("feelre:region-changed", { detail: { region } })
    );
  }, [region]);

  const closeAnd = (fn: () => void) => {
    onClose();
    // Даем тик анимации закрытия, затем выполняем действие
    setTimeout(fn, 0);
  };

  // Auth watch
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
      if (u?.id) fetchProfile(u.id);
      else setProfile(null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(uid: string) {
    const { data } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("id", uid)
      .single();
    setProfile(data as Profile);
  }

  useEffect(() => {
    if (userId) fetchProfile(userId);
  }, [userId]);

  const displayName = useMemo(
    () => profile?.nickname || email || "User",
    [profile?.nickname, email]
  );

  async function handleLogout() {
    try {
      setSigningOut(true);
      await supabase.auth.signOut();
      onClose();
      router.push("/");
      router.refresh();
    } catch (e) {
      alert("Failed to sign out: " + errMsg(e));
    } finally {
      setSigningOut(false);
    }
  }

  // ESC + scroll lock
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

  const panelTransition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.28, ease: cubicBezier(0.25, 0.1, 0.25, 1) };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Panel */}
          <motion.aside
            className="fixed right-0 top-0 z-50 h-full w-[92%] max-w-[480px] p-3 sm:p-4 transform-gpu"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={panelTransition}
          >
            <div className="h-full overflow-y-auto rounded-2xl bg-white shadow-[0_12px_40px_-16px_rgba(0,0,0,.25)] ring-1 ring-black/5">
              {/* Header */}
              <div className="relative p-4 md:p-5 border-b border-black/5">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (!isAuthed) {
                        onClose();
                        return router.push("/auth/sign-in");
                      }
                      setAccountOpen((v) => !v);
                    }}
                    className="group flex w-full items-center justify-between rounded-xl px-2 py-1 hover:bg-black/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-black/5">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="8" r="4" stroke="black" strokeWidth="1.5" />
                          <path
                            d="M4 20c1.7-3.6 5-5.5 8-5.5s6.3 1.9 8 5.5"
                            stroke="black"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>

                      <div className="leading-tight text-left">
                        <div className="text-[15px] font-semibold text-neutral-900">
                          {sessionReady ? (isAuthed ? `@${displayName}` : "Guest") : "…"}
                        </div>
                        <div className="text-[12px] text-neutral-500">
                          {sessionReady
                            ? isAuthed
                              ? "Account settings"
                              : "Not signed in"
                            : "Checking…"}
                        </div>
                      </div>
                    </div>

                    <motion.svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      animate={{ rotate: accountOpen ? 90 : 0 }}
                      transition={{ duration: prefersReduced ? 0 : 0.2 }}
                      className="opacity-70"
                    >
                      <path
                        d="M8 10l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </motion.svg>
                  </button>

                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl hover:bg-black/5"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-5 space-y-4">
                {/* Account panel */}
                <AnimatePresence initial={false}>
                  {isAuthed && accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={panelTransition}
                      className="overflow-hidden"
                    >
                      <AccountSettingsPanel
                        email={email ?? ""}
                        onClose={() => setAccountOpen(false)}
                        onEmailChanged={(next) => setEmail(next)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Preferences */}
                <div className="space-y-3">
                  <Row label="Language">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="m-input w-full border border-neutral-200 bg-white"
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
                      className="m-input w-full border border-neutral-200 bg-white"
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

                {/* Nav */}
                <nav className="grid gap-1 text-[15px] md:text-[16px]">
                  {/* ABOUT / FAQ */}
                  <NavButton
                    onClick={() =>
                      closeAnd(() =>
                        window.dispatchEvent(
                          new CustomEvent("feelre:open-panel", {
                            detail: { panel: "about" },
                          })
                        )
                      )
                    }
                  >
                    About Us
                  </NavButton>

                  <NavButton
                    onClick={() =>
                      closeAnd(() =>
                        window.dispatchEvent(
                          new CustomEvent("feelre:open-panel", {
                            detail: { panel: "faq" },
                          })
                        )
                      )
                    }
                  >
                    FAQ
                  </NavButton>

                  <Divider />

                  {/* IMPRESSUM / COOKIES */}
                  <NavButton
                    onClick={() =>
                      closeAnd(() =>
                        window.dispatchEvent(new CustomEvent("feelre:open-impressum"))
                      )
                    }
                  >
                    Imprint
                  </NavButton>

                  <NavButton
                    onClick={() =>
                      closeAnd(() =>
                        window.dispatchEvent(new CustomEvent("feelre:open-cookies"))
                      )
                    }
                  >
                    Cookie Settings
                  </NavButton>

                    <Divider />

                  {/* Эти уже закрываются, т.к. у <NavLink> стоит onClick={onClose} */}
                  <NavLink href="/privacy" onClick={onClose}>
                    Privacy Policy
                  </NavLink>
                  <NavLink href="/terms" onClick={onClose}>
                    Terms of Service
                  </NavLink>

                  <Divider />

                  {sessionReady &&
                    (isAuthed ? (
                      <NavButton
                        onClick={handleLogout}
                        className="text-red-600 hover:bg-red-50"
                      >
                        {signingOut ? "Signing out…" : "Log out"}
                      </NavButton>
                    ) : (
                      <>
                        <NavLink href="/auth/sign-in" onClick={onClose}>
                          Sign in
                        </NavLink>
                        <NavLink href="/auth/sign-up" onClick={onClose}>
                          Create account
                        </NavLink>
                      </>
                    ))}
                </nav>

                <Divider />

                {/* Contacts */}
                <div className="space-y-3">
                  <a
                    href="mailto:hello@feerly.com"
                    className="block text-[14px] hover:text-neutral-700"
                  >
                    hello@feerly.com
                  </a>

                  <div className="flex gap-5">
                    {["instagram", "tiktok", "twitter"].map((icon) => (
                      <a key={icon} href="#" className="relative h-6 w-6 hover:opacity-80">
                        <Image
                          src={`/icons/${icon}.png`}
                          alt={icon}
                          fill
                          className="object-contain"
                          sizes="24px"
                        />
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

// UI Helpers
// -----------------------------------------------------------------------------
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
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group w-full rounded-xl px-3 py-2 text-left hover:bg-neutral-50 active:bg-neutral-100 ${
        className ?? ""
      }`}
    >
      <span className="inline-block transition-transform group-hover:translate-x-0.5">
        {children}
      </span>
    </button>
  );
}

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="w-full rounded-xl px-3 py-2 hover:bg-neutral-50 active:bg-neutral-100"
    >
      {children}
    </Link>
  );
}

function AccountSettingsPanel({
  onClose,
  email,
  onEmailChanged,
}: {
  onClose: () => void;
  email: string;
  onEmailChanged: (next: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [newEmail, setNewEmail] = useState(email);
  useEffect(() => {
    setNewEmail(email);
  }, [email]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [msg, setMsg] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // независимые лоадеры
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id;
      if (!uid) return;
      const { data: prof } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", uid)
        .single();
      setUsername(prof?.nickname ?? "");
    });
  }, []);

  // -------------------------

  async function saveProfile() {
    setMsg(null);
    setSavingProfile(true);
    try {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id;
      if (!uid) throw new Error("No user");
      await supabase.from("profiles").upsert({ id: uid, nickname: username });
      setMsg("Profile saved.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setSavingProfile(false);
    }
  }


  // внутри AccountSettingsPanel в BurgerMenu.tsx
async function changeEmail() {
  setMsg(null);
  setChangingEmail(true);
  try {
    const res = await fetch("/api/change-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newEmail,
        currentPassword,
      }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error || "Failed to change email");

    // просто обновляем UI локально
    onEmailChanged?.(newEmail);
    setMsg("Email updated!");
    setCurrentPassword("");
  } catch (e) {
    setMsg(e instanceof Error ? e.message : String(e));
  } finally {
    setChangingEmail(false);
  }
}

  // внутри AccountSettingsPanel

  async function changePassword() {
  setMsg(null);
  setChangingPassword(true);
  try {
    const res = await fetch("/api/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: newEmail || email,    // <-- передаём адрес
        currentPassword,
        newPassword,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "Request failed");

    setMsg("Password changed. A confirmation email has been sent.");
    setCurrentPassword("");
    setNewPassword("");
  } catch (e) {
    setMsg(e instanceof Error ? e.message : String(e));
  } finally {
    setChangingPassword(false);
  }
}

  // открыть confirm-модалку
  // внутри AccountSettingsPanel

function askDelete() {
  setConfirmOpen(true);
}

async function doDeleteConfirmed() {
  setMsg(null);
  setDeleting(true);
  try {
    // берём access_token для Authorization
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token ?? "";

    const res = await fetch("/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error || "Failed to delete account");

    setMsg("Account deleted. You’ll receive a confirmation email. Signing out…");

    // локально выходим и уходим на главную
    await supabase.auth.signOut();
    window.location.href = "/";
  } catch (e) {
    setMsg(e instanceof Error ? e.message : String(e));
  } finally {
    setDeleting(false);
    setConfirmOpen(false);
  }
}

  return (
    <div className="relative rounded-2xl border border-neutral-200 bg-white p-4 md:p-5 shadow-sm">
      <button
        onClick={onClose}
        aria-label="Close account panel"
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-xl hover:bg-black/5"
      >
        ✕
      </button>

      <h3 className="mb-3 text-[15px] md:text-[16px] font-semibold">Account Settings</h3>

      {msg && (
        <div className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">
          {msg}
        </div>
      )}

      {/* Username */}
      <div className="mb-4">
        <div className="mb-1 text-[13px] text-neutral-600">Username</div>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="m-input w-full border border-neutral-200 bg-white"
        />
        <div className="mt-2">
          <button
            onClick={saveProfile}
            disabled={savingProfile}
            className="m-btn rounded-xl bg-neutral-900 px-4 text-white disabled:opacity-60"
          >
            {savingProfile ? "Saving…" : "Save username"}
          </button>
        </div>
      </div>

      {/* Email */}
      <div className="mb-4">
        <div className="mb-1 text-[13px] text-neutral-600">Email</div>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="m-input w-full border border-neutral-200 bg-white"
        />
        <div className="mt-2">
          <button
            onClick={changeEmail}
            disabled={changingEmail}
            className="m-btn rounded-xl border px-4 disabled:opacity-60"
          >
            {changingEmail ? "Sending…" : "Change email"}
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="mb-4">
        <div className="mb-1 text-[13px] text-neutral-600">Change Password</div>
        <PasswordInput
          placeholder="Current password"
          value={currentPassword}
          onChange={setCurrentPassword}
          inputClassName="m-input mb-2 w-full border border-neutral-200 bg-white"
        />
        <PasswordInput
          placeholder="New password (8+ chars)"
          value={newPassword}
          onChange={setNewPassword}
          inputClassName="m-input w-full border border-neutral-200 bg-white"
        />
        <div className="mt-2">
          <button
            onClick={changePassword}
            disabled={changingPassword || newPassword.length < 8}
            className="m-btn rounded-xl border px-4 disabled:opacity-60"
          >
            {changingPassword ? "Updating…" : "Change password"}
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-3">
        <div className="mb-2 text-[13px] font-medium text-red-700">Danger zone</div>
        <button
          onClick={askDelete}
          disabled={deleting}
          className="m-btn w-full rounded-xl bg-red-600 text-white disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete account"}
        </button>

        <ConfirmModal
          open={confirmOpen}
          title="Delete account?"
          message="This will permanently remove your FEELRE account and profile data. This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={doDeleteConfirmed}
        />

        <p className="mt-2 text-[12px] text-red-700/80">
          This will permanently remove your account and profile data.
        </p>
      </div>
    </div>
  );
}


