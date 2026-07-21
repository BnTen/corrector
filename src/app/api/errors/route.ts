import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/server/supabase/server";
import {
  isSupabaseConfigured,
  requireUser,
} from "@/server/security/require-user";

const ErrorEventInputSchema = z.object({
  documentId: z.string().uuid().nullable().optional(),
  ruleId: z.string().nullable().optional(),
  category: z.string().min(1),
  message: z.string().min(1),
  contextSnippet: z.string().nullable().optional(),
  original: z.string().nullable().optional(),
  replacement: z.string().nullable().optional(),
  accepted: z.boolean().optional(),
});

const BatchSchema = z.object({
  events: z.array(ErrorEventInputSchema).min(1).max(100),
});

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ errors: [], mock: true });
  }

  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("error_events")
      .select(
        "id, user_id, document_id, rule_id, category, message, context_snippet, original, replacement, accepted, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ errors: data ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, mock: true, inserted: 0 });
  }

  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = BatchSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const supabase = createClient();
    const rows = parsed.data.events.map((event) => ({
      user_id: user.id,
      document_id: event.documentId ?? null,
      rule_id: event.ruleId ?? null,
      category: event.category,
      message: event.message,
      context_snippet: event.contextSnippet ?? null,
      original: event.original ?? null,
      replacement: event.replacement ?? null,
      accepted: event.accepted ?? false,
    }));

    const { data, error } = await supabase
      .from("error_events")
      .insert(rows)
      .select("id");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      inserted: data?.length ?? rows.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
