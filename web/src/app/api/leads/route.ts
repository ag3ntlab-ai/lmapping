import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Bump when the privacy notice materially changes; stored per lead as proof of
// which version was consented to.
const NOTICE_VERSION = "2026-07-03";
// Hidden field a human never sees or fills. Named to avoid browser autofill
// (never `company`/`email`/`name`/`phone`, which real users' autofill would trip).
const HONEYPOT = "homepage";
// Coarse sanity cap on payload length (UTF-16 code units, not a DoS control;
// the platform handles real ingress limits).
const MAX_BODY_CHARS = 4096;

const schema = z.object({
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().min(1).max(120),
  // Normalise to lower-case so the @unique constraint actually dedupes
  // Foo@Bar.com and foo@bar.com.
  email: z.string().trim().max(200).email().transform((s) => s.toLowerCase()),
  consent: z.literal(true),
});

export async function POST(req: Request) {
  // Reject a clearly oversized payload before buffering, when declared.
  const declared = Number(req.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_CHARS * 4) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }
  const raw = await req.text();
  if (raw.length > MAX_BODY_CHARS) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  // Reject non-object bodies (JSON.parse("null") === null, numbers, strings)
  // before any property access.
  if (typeof parsedBody !== "object" || parsedBody === null) {
    return NextResponse.json({ error: "invalid" }, { status: 422 });
  }
  const body = parsedBody as Record<string, unknown>;

  // Honeypot filled -> a bot. Return the exact same shape as a real success so
  // the bot cannot tell it was dropped; nothing is persisted.
  const hp = body[HONEYPOT];
  if (typeof hp === "string" && hp.trim() !== "") {
    return NextResponse.json({ ok: true, persisted: true });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }
  const data = parsed.data;

  const prisma = getPrisma();
  if (!prisma) {
    // Deployed environments MUST have a database. Fail closed so a misconfigured
    // env can never show the user a fake "you're on the list".
    if (process.env.VERCEL) {
      console.error("[lead] no DATABASE_URL in a deployed environment");
      return NextResponse.json({ error: "server_error" }, { status: 500 });
    }
    // Local dev without a database: acknowledge so the UI flow still works.
    console.info("[lead] captured (no DATABASE_URL, not persisted):", data.email);
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    await prisma.lead.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        source: "one-pager", // server-set, never trusted from the client
        consentAt: new Date(),
        noticeVersion: NOTICE_VERSION,
      },
    });
    return NextResponse.json({ ok: true, persisted: true });
  } catch (err) {
    // Duplicate email (unique violation): keep the first record, never overwrite
    // an existing person's data. Idempotent success, no enumeration signal.
    if (err && typeof err === "object" && "code" in err && (err as { code?: string }).code === "P2002") {
      return NextResponse.json({ ok: true, persisted: true });
    }
    console.error("[lead] persist failed:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
