import { NextResponse } from "next/server";
import { createAdminClient } from "@/server/supabase/admin";
import { requireUser } from "@/server/security/require-user";
import { isAdminEmail } from "@/server/security/admin";

export async function GET() {
  try {
    const user = await requireUser();
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json(
        { error: "Supabase admin non configuré.", leads: [], stats: null },
        { status: 503 }
      );
    }

    const since = new Date();
    since.setDate(since.getDate() - 7);

    const { data: leads, error } = await admin
      .from("leads")
      .select("id, email, source, credits_granted, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("[api/admin/leads]", error.message);
      return NextResponse.json(
        { error: error.message, leads: [] },
        { status: 500 }
      );
    }

    const rows = leads ?? [];
    const leads7d = rows.filter(
      (row) => new Date(row.created_at).getTime() >= since.getTime()
    ).length;

    return NextResponse.json({
      leads: rows,
      stats: {
        totalLeads: rows.length,
        leads7d,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("[api/admin/leads]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
