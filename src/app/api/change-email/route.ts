// src/app/api/account/change-email/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import supabaseAdmin from "@/lib/supabase-admin";
import { sendEmail } from "@/lib/mailer";
import React from "react";
import EmailChangedEmail from "@/emails/EmailChangedEmail";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Body = {
  email: string;            // текущий email (из BurgerMenu)
  newEmail: string;         // новый email
  currentPassword: string;  // пароль для ре-аутентификации
};

export async function POST(req: Request) {
  try {
    const { email, newEmail, currentPassword } = (await req.json()) as Body;

    if (!email || !newEmail || !currentPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (email.toLowerCase() === newEmail.toLowerCase()) {
      return NextResponse.json(
        { error: "New email must be different" },
        { status: 400 }
      );
    }

    // 1) Ре-аутентификация по паролю (без сохранения сессии)
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

    const user = signInData.user;

    // 2) Подтянем ник
    let nickname: string | undefined;
    {
      const { data: prof } = await supabaseAdmin
        .from("profiles")
        .select("nickname")
        .eq("id", user.id)
        .maybeSingle();
      nickname = prof?.nickname ?? undefined;
    }

    // 3) Меняем email админом (без куки-сессии)
    const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { email: newEmail }
    );
    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }

    // 4) Отправляем уведомления на старый и новый адреса
    await Promise.all([
      sendEmail({
        to: email,
        subject: "Your FEELRE email was changed",
        react: React.createElement(EmailChangedEmail, {
          nickname,
          oldEmail: email,
          newEmail,
          recipient: "old",
        }),
      }),
      sendEmail({
        to: newEmail,
        subject: "Your FEELRE email change is confirmed",
        react: React.createElement(EmailChangedEmail, {
          nickname,
          oldEmail: email,
          newEmail,
          recipient: "new",
        }),
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : typeof e === "string" ? e : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}