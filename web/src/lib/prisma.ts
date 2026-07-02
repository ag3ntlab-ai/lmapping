import { PrismaClient } from "@prisma/client";

// Singleton. Only instantiated when a database is configured, so the site
// runs locally (and the form works) without any Postgres present.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null;
  if (!globalForPrisma.prisma) globalForPrisma.prisma = new PrismaClient();
  return globalForPrisma.prisma;
}
