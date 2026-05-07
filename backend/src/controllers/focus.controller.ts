import { Request, Response } from "express";
import {
  createFocusSession,
  getFocusSession,
  listFocusSessions
} from "../services/focus.service.js";
import { routeParam } from "../utils/request.js";
import { focusSessionSchema } from "../validators/focus.validator.js";

export async function getFocusSessions(req: Request, res: Response) {
  res.json(await listFocusSessions(req.user!.id));
}

export async function postFocusSession(req: Request, res: Response) {
  const { duration, completed } = focusSessionSchema.parse(req.body);
  res.status(201).json(await createFocusSession(req.user!.id, duration, completed));
}

export async function getFocusSessionById(req: Request, res: Response) {
  res.json(await getFocusSession(req.user!.id, routeParam(req.params.id, "id")));
}
