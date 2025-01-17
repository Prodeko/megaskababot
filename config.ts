import { PrismaClient } from "./prisma/generated/client/index.js";
import type { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

export { prisma };
