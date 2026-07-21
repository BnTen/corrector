import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/server/supabase/admin";
import { rateLimit } from "@/server/security/rate-limit";
import {
  EMAIL_BONUS_CREDITS,
  LEAD_COOKIE_NAME,
} from "@/features/funnel/lib/constants";

const LeadSchema = z.object({
  email: z.string().trim().email().max(254),
  source: z.string().trim().max(64).optional(),
});

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}

export async function POST(request: NextRequest) {
  try {
    const limit = rateLimit(`leads:${clientIp(request)}`, 10, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans une minute." },
        { status: 429 }
      );
    }

    const json = await request.json().catch(() => null);
    const parsed = LeadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Email invalide." },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const source = parsed.data.source?.trim() || "try_gate";
    const admin = createAdminClient();

    if (admin) {
      const { error } = await admin.from("leads").upsert(
        {
          email,
          source,
          credits_granted: EMAIL_BONUS_CREDITS,
        },
        { onConflict: "email", ignoreDuplicates: false }
      );

      if (error) {
        // Unique race or missing table — still grant client credits if duplicate
        if (error.code !== "23505") {
          console.error("[api/leads]", error.message);
          // Soft-fail: still unlock UX if DB is temporarily unavailable
        }
      }
    } else {
      console.warn("[api/leads] Supabase admin not configured — lead not persisted");
    }

    const response = NextResponse.json({
      ok: true,
      creditsGranted: EMAIL_BONUS_CREDITS,
      email,
    });

    response.cookies.set(LEAD_COOKIE_NAME, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("[api/leads]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
