import { NextRequest, NextResponse } from "next/server";
import { checkText } from "@/server/languagetool/client";
import { CheckRequestSchema } from "@/server/languagetool/schemas";
import { rateLimit } from "@/server/security/rate-limit";
import {
  isSupabaseConfigured,
  requireUser,
} from "@/server/security/require-user";

function clientKey(request: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;

  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous";

  return `ip:${ip}`;
}

export async function POST(request: NextRequest) {
  try {
    // Anonymous check is allowed (landing/workspace editor UX); rate-limit by IP or user id.
    const user = isSupabaseConfigured() ? await requireUser() : null;

    const json = await request.json().catch(() => null);
    const parsed = CheckRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const key = clientKey(request, user?.id);
    const limit = rateLimit(key);

    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000))
            ),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const matches = await checkText(parsed.data.text, parsed.data.language);

    return NextResponse.json(
      { matches },
      {
        headers: {
          "X-RateLimit-Remaining": String(limit.remaining),
        },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("[api/check]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
