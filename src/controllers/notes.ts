import { Response } from "express";
import { ExtendedRequest } from "../types/request.js";
import {
  createNoteSchema,
  updateNoteSchema,
  createBoxSchema,
  updateBoxSchema,
  reorderBoxesSchema,
} from "../schemas/notes.js";
import {
  findAllNotesByUser,
  findNoteById,
  createNote,
  updateNote,
  deleteNote,
  findBoxesByNote,
  createBox,
  updateBox,
  deleteBox,
  reorderBoxes,
} from "../services/notes.js";

// ---------- Notes ----------

export const getAllNotes = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.idLogged as string;
    const notes = await findAllNotesByUser(userId);
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar anotações", errorDetails: error });
  }
};

export const getNote = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.idLogged as string;
    const { id } = req.params;

    const note = await findNoteById(id as string, userId);
    if (!note) {
      res.status(404).json({ error: "Anotação não encontrada" });
      return;
    }

    const boxes = await findBoxesByNote(id as string, userId);

    res.json({ note, boxes });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar anotação", errorDetails: error });
  }
};

export const postNote = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.idLogged as string;
    const parsed = createNoteSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
      return;
    }

    const note = await createNote(parsed.data, userId);
    res.status(201).json({ note });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar anotação", errorDetails: error });
  }
};

export const putNote = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.idLogged as string;
    const { id } = req.params;
    const parsed = updateNoteSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
      return;
    }

    const note = await updateNote(id as string, userId, parsed.data);
    if (!note) {
      res.status(404).json({ error: "Anotação não encontrada" });
      return;
    }

    res.json({ note });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar anotação", errorDetails: error });
  }
};

export const deleteNoteController = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.idLogged as string;
    const { id } = req.params;

    const note = await deleteNote(id as string, userId);
    if (!note) {
      res.status(404).json({ error: "Anotação não encontrada" });
      return;
    }

    res.json({ message: "Anotação deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar anotação", errorDetails: error });
  }
};

// ---------- Boxes ----------

export const postBox = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.idLogged as string;
    const { id: noteId } = req.params;
    const parsed = createBoxSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
      return;
    }

    const note = await findNoteById(noteId as string, userId);
    if (!note) {
      res.status(404).json({ error: "Anotação não encontrada" });
      return;
    }

    const box = await createBox(noteId as string, userId, parsed.data);
    res.status(201).json({ box });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar bloco", errorDetails: error });
  }
};

export const putBox = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.idLogged as string;
    const { id: noteId, boxId } = req.params;
    const parsed = updateBoxSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
      return;
    }

    const box = await updateBox(noteId as string, boxId as string, userId, parsed.data);
    if (!box) {
      res.status(404).json({ error: "Bloco não encontrado" });
      return;
    }

    res.json({ box });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar bloco", errorDetails: error });
  }
};

export const deleteBoxController = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.idLogged as string;
    const { id: noteId, boxId } = req.params;

    const box = await deleteBox(noteId as string, boxId as string, userId);
    if (!box) {
      res.status(404).json({ error: "Bloco não encontrado" });
      return;
    }

    res.json({ message: "Bloco deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar bloco", errorDetails: error });
  }
};

export const putReorderBoxes = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.idLogged as string;
    const { id: noteId } = req.params;
    const parsed = reorderBoxesSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
      return;
    }

    const boxes = await reorderBoxes(noteId as string, userId, parsed.data);
    if (!boxes) {
      res.status(400).json({ error: "Um ou mais blocos não pertencem a esta anotação" });
      return;
    }

    res.json({ boxes });
  } catch (error) {
    res.status(500).json({ error: "Erro ao reordenar blocos", errorDetails: error });
  }
};