import { Request, Response } from "express";
import { getStats } from "../services/stats.service.js";

export async function getUserStats(req: Request, res: Response) {
  res.json(await getStats(req.user!.id));
}
