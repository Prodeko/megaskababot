import type { Request, Response } from "express";

export const validatePeriod = (req: Request, res: Response) => {
  const start = req.query.start;
  const end = req.query.end;

  if (!start || !end) {
    return res.status(400).send(
      "Period start and end query parameters are required",
    );
  }

  if (typeof start !== "string" || typeof end !== "string") {
    return res.status(400).send(
      "Invalid period start and end query parameters",
    );
  }

  if (Number.isNaN(Date.parse(start)) || Number.isNaN(Date.parse(end))) {
    return res.status(400).send(
      "Period start and end query parameters must be valid dates",
    );
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (startDate > endDate) {
    return res.status(400).send("Period start must be before period end");
  }

  res.locals.periodStart = startDate;
  res.locals.periodEnd = endDate;

  return res;
};
