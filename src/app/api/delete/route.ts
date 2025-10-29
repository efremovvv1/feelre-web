// src/app/api/account/delete/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import supabaseAdmin from "@/lib/supabase-admin";
import { sendEmail } from "@/lib/mailer";
import React from "react";
import AccountDeletedEmail from "@/emails/AccountDeletedEmail";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization") || req.headers.get("Authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Временный клиент, чтобы вытащить user по access_token
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: userData, error: userErr } = await sb.auth.getUser();
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: userErr?.message || "Invalid token" }, { status: 401 });
    }

    const uid = userData.user.id;
    const email = userData.user.email || "";
    // ник из профиля (если есть)
    let nickname: string | null = null;
    const { data: prof } = await supabaseAdmin
      .from("profiles")
      .select("nickname")
      .eq("id", uid)
      .maybeSingle();
    nickname = (prof as { nickname?: string } | null)?.nickname ?? null;

    // 1) Отправляем письмо-подтверждение
    if (email) {
      await sendEmail({
        to: email,
        subject: "Your FEELRE account was deleted",
        react: React.createElement(AccountDeletedEmail, {
          nickname,
          supportEmail: "hello@feelre.com",
        }),
      });
    }

    // 2) Чистим профиль (не обязательно, но логично)
    await supabaseAdmin.from("profiles").delete().eq("id", uid).throwOnError();

    // 3) Удаляем пользователя
    const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(uid);
    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}