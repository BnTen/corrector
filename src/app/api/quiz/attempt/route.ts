import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/server/supabase/server";
import {
  isSupabaseConfigured,
  requireUser,
} from "@/server/security/require-user";

const AttemptSchema = z.object({
  exerciseType: z.enum(["fill-blank", "conjugation", "mcq"]),
  category: z.string().nullable().optional(),
  correct: z.boolean(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, mock: true });
  }

  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = AttemptSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("quiz_attempts")
      .insert({
        user_id: user.id,
        exercise_type: parsed.data.exerciseType,
        category: parsed.data.category ?? null,
        correct: parsed.data.correct,
        payload: parsed.data.payload ?? {},
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
