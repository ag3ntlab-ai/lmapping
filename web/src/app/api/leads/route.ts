import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

const schema = z.object({
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  mobile: z.string().trim().max(40).optional().or(z.literal("")),
  source: z.string().trim().max(60).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }
  const data = parsed.data;
  const lead = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    mobile: data.mobile ? data.mobile : null,
    source: data.source ?? "one-pager",
  };

  const prisma = getPrisma();
  if (!prisma) {
    // Local dev with no database: validate + acknowledge so the UI flow works.
    console.info("[lead] captured (no DATABASE_URL, not persisted):", lead);
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    await prisma.lead.create({ data: lead });
    return NextResponse.json({ ok: true, persisted: true });
  } catch (err) {
    console.error("[lead] persist failed:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
