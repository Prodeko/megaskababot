import { prisma } from "../../config";
import type { Statistics } from "../common/types";

export function getStatistics(): Statistics {
	return new Map();
}
