import { NextResponse } from "next/server";
import { headers } from "next/headers";
import supabaseAdmin from "@/modules/shared/supabase/admin";
import { getServerSupabase } from "@/modules/shared/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  try {
    // 1) Bearer из заголовка
    const hdrs = await headers();               // <-- ВАЖНО: await
    const auth = hdrs.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

    let userId: string | null = null;

    if (token) {
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      if (!error && data?.user) userId = data.user.id;
    }

    // 2) Фолбэк по cookie
    if (!userId) {
      const supabase = await getServerSupabase();
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id ?? null;
    }

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 3) Удаляем профиль и сам аккаунт
    await supabaseAdmin.from("profiles").delete().eq("id", userId);
    const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {                       // <-- без any
    const message =
      e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
