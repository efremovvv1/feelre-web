import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import supabaseAdmin from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type Body = { currentPassword: string; newEmail: string; email: string };

export async function POST(req: Request) {
  try {
    const { currentPassword, newEmail, email } = (await req.json()) as Body;
    if (!newEmail || !email || !currentPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1) Проверяем, что это тот самый пользователь (ре-аутентификация)
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

    // 2) Меняем e-mail админом (без сессии)
    const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(
      signInData.user.id,
      { email: newEmail }
    );
    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }

    // Если хотите двуступенчатое подтверждение через письмо — вместо admin.updateUserById
    // можно оставить ваш прежний supabase.auth.updateUser({ email: newEmail })
    // но тогда снова потребуется сессия в куках.

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : typeof e === "string" ? e : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
