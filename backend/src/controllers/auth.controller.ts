import { Request, Response } from "express";
import { authSchema } from "../validators/auth.validator.js";
import { loginUser, registerUser } from "../services/auth.service.js";

export async function register(req: Request, res: Response) {
  const { email, password } = authSchema.parse(req.body);
  const result = await registerUser(email, password);
  res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const { email, password } = authSchema.parse(req.body);
  const result = await loginUser(email, password);
  res.json(result);
}

export function logout(_req: Request, res: Response) {
  res.status(204).send();
}
