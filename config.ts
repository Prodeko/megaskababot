import { PrismaClient } from "./prisma/generated/client/deno/edge.ts";

const prisma = new PrismaClient();

export { prisma };
