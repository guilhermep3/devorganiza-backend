import { Response } from "express";
import { ExtendedRequest } from "../types/request.js";
import {
  createNoteSchema, updateNoteSchema, createBlockSchema, updateBlockSchema, reorderBlocksSchema,
} from "../schemas/notes.js";
import {
  findAllNotesByUser, findNoteById, createNote, updateNote,
  deleteNote, findBlocksByNote, createBlock, updateBlock,
  deleteBlock, reorderBlocks,
} from "../services/notes.js";
import { AppError } from "../utils/appError.js";

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

    const blocks = await findBlocksByNote(id as string, userId);

    res.json({ note, blocks });
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

// ---------- Blocks ----------

export const postBlock = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.idLogged as string;
    const { id: noteId } = req.params;
    const parsed = createBlockSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
      return;
    }

    const note = await findNoteById(noteId as string, userId);
    if (!note) {
      res.status(404).json({ error: "Anotação não encontrada" });
      return;
    }

    const block = await createBlock(noteId as string, userId, parsed.data);
    res.status(201).json({ block });
  } catch (error) {
    if (error instanceof AppError && error.code === "NOTE_SIZE_LIMIT_EXCEEDED") {
      res.status(400).json({
        error: error.message,
        code: error.code
      });
    } else {
      res.status(500).json({
        error: "Erro ao criar bloco"
      });
    }
  }
};

export const putBlock = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.idLogged as string;
    const { id: noteId, blockId } = req.params;
    const parsed = updateBlockSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
      return;
    }

    const block = await updateBlock(noteId as string, blockId as string, userId, parsed.data);
    if (!block) {
      res.status(404).json({ error: "Bloco não encontrado" });
      return;
    }

    res.json({ block });
  } catch (error) {
    if (error instanceof AppError && error.code === "NOTE_SIZE_LIMIT_EXCEEDED") {
      res.status(400).json({
        error: error.message,
        code: error.code
      });
    } else {
      res.status(500).json({
        error: "Erro ao atualizar bloco"
      });
    }
  }
};

export const deleteBlockController = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.idLogged as string;
    const { id: noteId, blockId } = req.params;

    const block = await deleteBlock(noteId as string, blockId as string, userId);
    if (!block) {
      res.status(404).json({ error: "Bloco não encontrado" });
      return;
    }

    res.json({ message: "Bloco deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar bloco", errorDetails: error });
  }
};

export const putReorderBlocks = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.idLogged as string;
    const { id: noteId } = req.params;
    const parsed = reorderBlocksSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
      return;
    }

    const blocks = await reorderBlocks(noteId as string, userId, parsed.data);
    if (!blocks) {
      res.status(400).json({ error: "Um ou mais blocos não pertencem a esta anotação" });
      return;
    }

    res.json({ blocks });
  } catch (error) {
    res.status(500).json({ error: "Erro ao reordenar blocos", errorDetails: error });
  }
};