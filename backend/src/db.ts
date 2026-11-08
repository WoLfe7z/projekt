import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const globalZaPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalZaPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production")
  globalZaPrisma.prisma = prisma;