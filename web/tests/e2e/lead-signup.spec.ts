import { test, expect } from "@playwright/test";
import type { PrismaClient } from "@prisma/client";

// Persistence oracle. Constructed lazily so local (no-database) runs that only
// exercise UI/guard specs never touch Prisma. @db specs assert real rows against
// the same database the target deployment writes to (DATABASE_URL).
let _db: PrismaClient | null = null;
async function db(): Promise<PrismaClient> {
  if (!_db) {
    const { PrismaClient } = await import("@prisma/client");
    _db = new PrismaClient();
  }
  return _db;
}

const TEST_DOMAIN = "@lmapping-test.dev";
const uniqEmail = () =>
  `e2e_${Date.now()}_${Math.floor(Math.random() * 1e6)}${TEST_DOMAIN}`;

test.beforeAll(() => {
  // At the preview gate the @db read-backs need a database; fail loudly rather
  // than silently skipping and reporting a false green (Rule #14).
  if (process.env.PLAYWRIGHT_BASE_URL && !process.env.DATABASE_URL) {
    throw new Error("Gate run requires DATABASE_URL for @db persistence read-backs.");
  }
});

test.afterAll(async () => {
  // Best-effort sweep of any test rows; no-ops locally where there is no DB.
  try {
    const p = await db();
    await p.lead.deleteMany({ where: { email: { contains: TEST_DOMAIN } } });
    await p.$disconnect();
  } catch {
    /* no database in this run */
  }
});

async function fillForm(
  page: import("@playwright/test").Page,
  email: string,
  opts: { consent: boolean },
) {
  await page.goto("/");
  const form = page.getByTestId("lead-form");
  await form.getByLabel("First name", { exact: true }).fill("Ada");
  await form.getByLabel("Last name", { exact: true }).fill("Lovelace");
  await form.getByLabel("Email", { exact: true }).fill(email);
  if (opts.consent) await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: /get early access/i }).click();
}

test.describe("lead signup - UI journey", () => {
  test("valid submit shows success and no error surface", async ({ page }) => {
    await fillForm(page, uniqEmail(), { consent: true });
    await expect(page.getByTestId("lead-success")).toBeVisible();
    // Negative assertion: the submit did not surface an error.
    await expect(page.getByText("Something went wrong. Please try again.")).toBeHidden();
  });

  test("submit without consent is blocked with a visible error", async ({ page }) => {
    await fillForm(page, uniqEmail(), { consent: false });
    await expect(page.getByText("Please accept to continue.")).toBeVisible();
    await expect(page.getByTestId("lead-success")).toHaveCount(0);
  });
});

test.describe("lead API guards", () => {
  test("missing consent is rejected", async ({ request }) => {
    const res = await request.post("/api/leads", {
      data: { firstName: "No", lastName: "Consent", email: uniqEmail() },
    });
    expect(res.status()).toBe(422);
  });

  test("valid lead persists with consent proof @db", async ({ request }) => {
    const email = uniqEmail();
    const res = await request.post("/api/leads", {
      data: { firstName: "Ada", lastName: "Lovelace", email, consent: true },
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, persisted: true });
    const row = await (await db()).lead.findUnique({ where: { email } });
    expect(row).not.toBeNull();
    expect(row?.noticeVersion).toBeTruthy();
    expect(row?.consentAt).toBeTruthy();
  });

  test("honeypot submission is accepted but never persisted @db", async ({ request }) => {
    const email = uniqEmail();
    const res = await request.post("/api/leads", {
      data: { firstName: "Bot", lastName: "Net", email, consent: true, homepage: "http://spam.example" },
    });
    expect(res.status()).toBe(200);
    const row = await (await db()).lead.findUnique({ where: { email } });
    expect(row).toBeNull();
  });

  test("duplicate email keeps the first record @db", async ({ request }) => {
    const email = uniqEmail();
    const a = await request.post("/api/leads", { data: { firstName: "First", lastName: "One", email, consent: true } });
    expect(a.status()).toBe(200);
    const b = await request.post("/api/leads", { data: { firstName: "Second", lastName: "Two", email, consent: true } });
    expect(b.status()).toBe(200);
    const rows = await (await db()).lead.findMany({ where: { email } });
    expect(rows).toHaveLength(1);
    expect(rows[0].firstName).toBe("First"); // create-first: existing PII not overwritten
  });

  test("email is normalised so case variants dedupe @db", async ({ request }) => {
    const base = `e2e_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const upper = `${base}@Lmapping-Test.dev`;
    const lower = `${base}@lmapping-test.dev`;
    const a = await request.post("/api/leads", { data: { firstName: "Case", lastName: "Upper", email: upper, consent: true } });
    expect(a.status()).toBe(200);
    const b = await request.post("/api/leads", { data: { firstName: "Case", lastName: "Lower", email: lower, consent: true } });
    expect(b.status()).toBe(200);
    // Query BOTH case variants: if normalisation breaks, an upper-cased row
    // survives and this finds 2, failing as it should.
    const rows = await (await db()).lead.findMany({ where: { email: { in: [lower, upper] } } });
    expect(rows).toHaveLength(1);
    expect(rows[0].email).toBe(lower);
  });
});
