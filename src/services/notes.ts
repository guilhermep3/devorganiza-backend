import { notesRepository } from "../repositories/notes.js";
import {
  CreateBlockType, CreateNoteType, ReorderBlocksType, UpdateBlockType, UpdateNoteType,
} from "../schemas/notes.js";
import { AppError } from "../utils/appError.js";
import { getContentSize, MAX_NOTE_SIZE } from "../utils/getContentSize.js";

// ---------- Notes ----------

export const findAllNotesByUser = async (userId: string) => {
  return notesRepository.findAllByUser(userId);
};

export const findNoteById = async (id: string, userId: string) => {
  return notesRepository.findById(id, userId);
};

export const createNote = async (data: CreateNoteType, userId: string) => {
  const note = await notesRepository.create(data, userId);

  // Toda anotação inicia com um bloco text vazio !!!
  await notesRepository.createBlock(note!.id, userId, {
    type: "text",
    content: { text: "" },
    position: 0,
  });

  return note;
};

export const updateNote = async (id: string, userId: string, data: UpdateNoteType) => {
  return notesRepository.update(id, userId, data);
};

export const deleteNote = async (id: string, userId: string) => {
  return notesRepository.delete(id, userId);
};

// ---------- Blocks ----------

export const findBlocksByNote = async (notesId: string, userId: string) => {
  return notesRepository.findBlocksByNote(notesId, userId);
};

export const createBlock = async (notesId: string, userId: string, data: CreateBlockType) => {
  const blocks = await notesRepository.findBlocksByNote(notesId, userId);

  const currentSize = blocks.reduce((acc, b) => {
    return acc + getContentSize(b.content);
  }, 0);

  const newBlockSize = getContentSize(data.content);

  if (currentSize + newBlockSize > MAX_NOTE_SIZE) {
    throw new AppError(
      "Tamanho máximo da anotação excedido",
      "NOTE_SIZE_LIMIT_EXCEEDED",
      400
    );
  }

  return notesRepository.createBlock(notesId, userId, data);
};

export const updateBlock = async (noteId: string, blockId: string, userId: string, data: UpdateBlockType) => {
  const block = await notesRepository.findBlockById(blockId, userId);
  if (!block || block.notesId !== noteId) return null;

  const blocks = await notesRepository.findBlocksByNote(noteId, userId);

  const currentSize = blocks.reduce((acc, b) => {
    if (b.id === blockId) return acc;
    return acc + getContentSize(b.content);
  }, 0);

  const newBlockSize = getContentSize(data.content);

  if (currentSize + newBlockSize > MAX_NOTE_SIZE) {
    throw new AppError(
      "Tamanho máximo da anotação excedido",
      "NOTE_SIZE_LIMIT_EXCEEDED",
      400
    );
  }

  return notesRepository.updateBlock(blockId, userId, data);
};

export const deleteBlock = async (noteId: string, blockId: string, userId: string) => {
  const block = await notesRepository.findBlockById(blockId, userId);
  if (!block || block.notesId !== noteId) return null;

  return notesRepository.deleteBlock(blockId, userId);
};

export const reorderBlocks = async (
  noteId: string,
  userId: string,
  data: ReorderBlocksType
) => {
  // Valida que todos os blocks pertencem à nota
  const blocks = await notesRepository.findBlocksByNote(noteId, userId);
  const blockIds = new Set(blocks.map((b) => b.id));

  const allBelong = data.blocks.every((b) => blockIds.has(b.id));
  if (!allBelong) return null;

  return notesRepository.reorderBlocks(data.blocks, userId);
};