"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SetHeaderTitle from "@/components/SetHeaderTitle";

// безопасное извлечение текста ошибки
function getErrMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Unexpected error";
  }
}

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "apple" | null>(null);

  const redirectTo = useMemo<string | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    return `${window.location.origin}/`;
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/");
    });
  }, [router]);

  async function handleSignIn() {
    setMsg(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/");
    } catch (e: unknown) {
      setMsg(getErrMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    if (!redirectTo) return;
    setMsg(null);
    setOauthLoading("google");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (e: unknown) {
      setMsg(getErrMessage(e));
      setOauthLoading(null);
    }
  }

  async function signInWithApple() {
    if (!redirectTo) return;
    setMsg(null);
    setOauthLoading("apple");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (e: unknown) {
      setMsg(getErrMessage(e));
      setOauthLoading(null);
    }
  }

  return (
    <main className="content mx-auto max-w-[560px] px-4 py-8">
      <SetHeaderTitle title="Welcome to FEELRE" />

      <div className="rounded-3xl border border-black/10 bg-white/90 shadow-[0_15px_60px_rgba(0,0,0,0.10)]">
        <div className="rounded-t-3xl bg-gradient-to-b from-[#EEE7FF] to-white px-6 pb-1 pt-6 text-center">
          
        </div>

        <div className="px-6 pb-6 pt-4">
          {msg && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[14px] text-red-700">
              {msg}
            </div>
          )}

          <label className="mb-1 block text-[13px] text-neutral-600">
            Enter your E-mail address :
          </label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-[#9E73FA]"
          />

          <div className="mb-1 flex items-center justify-between">
            <label className="block text-[13px] text-neutral-600">Enter your password :</label>
            <a
              href="/auth/forgot"
              className="text-[12px] text-[#6B66F6] underline-offset-4 hover:underline"
            >
              Forgot password
            </a>
          </div>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-3 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-[#9E73FA]"
          />

          <label className="mb-5 inline-flex cursor-pointer select-none items-center gap-2 text-[13px] text-neutral-700">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="peer hidden"
            />
            <span className="grid h-4 w-7 place-items-center rounded-full bg-neutral-300 peer-checked:bg-[#9E73FA]">
              <span className="h-[14px] w-[14px] translate-x-[-9px] rounded-full bg-white shadow transition peer-checked:translate-x-1" />
            </span>
            Remember me.
          </label>

          <button
            disabled={loading}
            onClick={handleSignIn}
            className="mb-5 h-11 w-full rounded-2xl bg-gradient-to-r from-[#B974FF] via-[#9E73FA] to-[#6B66F6] text-[15px] font-semibold text-white transition disabled:opacity-70"
          >
            {loading ? "Signing in…" : "Login"}
          </button>

          <div className="my-4 flex items-center gap-3 text-[12px] text-neutral-500">
            <span className="h-px flex-1 bg-neutral-200" />
            Or Log In With
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SocialBtn onClick={signInWithGoogle} loading={oauthLoading === "google"}>
              <svg width="18" height="18" viewBox="0 0 48 48" className="mr-2">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.2 29.3 35 24 35c-7.2 0-13-5.8-13-13S16.8 9 24 9c3.3 0 6.3 1.2 8.6 3.3l5.7-5.7C34.5 3.3 29.6 1 24 1 10.7 1 0 11.7 0 25s10.7 24 24 24 24-10.7 24-24c0-1.6-.2-3.1-.4-4.5z" />
                <path fill="#FF3D00" d="M6.3 14.1l6.6 4.8C14.5 16.1 18.9 13 24 13c3.3 0 6.3 1.2 8.6 3.3l5.7-5.7C34.5 3.3 29.6 1 24 1 15 1 7.6 6.2 4.1 14.1z" />
                <path fill="#4CAF50" d="M24 49c5.2 0 10-1.8 13.7-4.9l-6.3-5.2C29.2 40.2 26.7 41 24 41c-5.3 0-9.7-2.8-12.1-7l-6.6 5C7.6 43.8 15 49 24 49z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3C34.7 31.2 29.3 35 24 35c-5.3 0-9.7-2.8-12.1-7l-6.6 5C7.6 43.8 15 49 24 49c12.3 0 22-9.7 22-22 0-1.6-.2-3.1-.4-4.5z" />
              </svg>
              Google
            </SocialBtn>

            <SocialBtn onClick={signInWithApple} loading={oauthLoading === "apple"}>
              <svg width="16" height="16" viewBox="0 0 14 17" className="mr-2">
                <path d="M9.3 1.5c.7-.8 1.9-1.4 2.9-1.5.1 1-.3 2.1-1 2.9-.6.8-1.8 1.4-2.9 1.3-.1-1 .3-2.1 1-2.7zM12.8 13.5c-.5 1.1-1.3 2.2-2.3 2.2-.9 0-1.2-.6-2.3-.6s-1.5.6-2.3.6c-1 0-1.8-1.1-2.3-2.2C2.5 12.1 2 10 3.1 8.5 3.8 7.6 4.9 7 6 7c.9 0 1.7.6 2.3.6.6 0 1.6-.7 2.7-.6.5 0 2 .1 2.9 1.5-.1.1-1.7.9-1.1 3z" fill="currentColor" />
              </svg>
              Apple
            </SocialBtn>
          </div>

          <div className="mt-6 text-center text-[14px]">
            <span className="text-neutral-600">Don’t have an account? </span>
            <a href="/auth/sign-up" className="font-semibold text-[#6B66F6] underline-offset-4 hover:underline">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function SocialBtn({
  children,
  onClick,
  loading,
}: {
  children: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-neutral-300 bg-white px-4 text-[15px] font-medium transition hover:bg-neutral-50 disabled:opacity-70"
    >
      {loading ? "Redirecting…" : children}
    </button>
  );
}
