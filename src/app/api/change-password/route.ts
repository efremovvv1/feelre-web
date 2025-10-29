// src/app/api/change-password/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import supabaseAdmin from "@/lib/supabase-admin";
import { sendEmail } from "@/lib/mailer";
import React from "react";
import PasswordChangedEmail from "@/emails/PasswordChangedEmail";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Body = {
  currentPassword: string;
  newPassword: string;
  email?: string; // передаём с клиента (проще всего)
};

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword, email } = (await req.json()) as Body;

    if (!currentPassword || !newPassword || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1) Ре-аутентифицируемся без сохранения сессии
    const supabaseNoPersist = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data: signInData, error: signInErr } =
      await supabaseNoPersist.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

    if (signInErr || !signInData?.user) {
      return NextResponse.json({ error: "Wrong password" }, { status: 403 });
    }

    const uid = signInData.user.id;

    // 2) Меняем пароль админом
    const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(
      uid,
      { password: newPassword }
    );
    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }

    // 3) Берём ник для письма (необязательно)
   // стало (короче и чище)
const nickname: string | undefined = uid
  ? (
      await supabaseAdmin
        .from("profiles")
        .select("nickname")
        .eq("id", uid)
        .maybeSingle()
    ).data?.nickname ?? undefined
  : undefined;

    // 4) Письмо-подтверждение (не валим ответ, если почта упала)
    try {
      await sendEmail({
        to: email,
        subject: "Your FEELRE password was changed",
        react: React.createElement(PasswordChangedEmail, { nickname }),
      });
    } catch (mailErr) {
      console.error("Email send failed:", mailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("change-password error:", e);
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}