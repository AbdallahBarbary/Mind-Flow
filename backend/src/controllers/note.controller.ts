import { Request, Response } from "express";
import { createNote, deleteNote, listNotes, updateNote } from "../services/note.service.js";
import { routeParam } from "../utils/request.js";
import { noteSchema } from "../validators/note.validator.js";

export async function getNotes(req: Request, res: Response) {
  res.json(await listNotes(req.user!.id));
}

export async function postNote(req: Request, res: Response) {
  const { content } = noteSchema.parse(req.body);
  res.status(201).json(await createNote(req.user!.id, content));
}

export async function putNote(req: Request, res: Response) {
  const { content } = noteSchema.parse(req.body);
  res.json(await updateNote(req.user!.id, routeParam(req.params.id, "id"), content));
}

export async function removeNote(req: Request, res: Response) {
  await deleteNote(req.user!.id, routeParam(req.params.id, "id"));
  res.status(204).send();
}
