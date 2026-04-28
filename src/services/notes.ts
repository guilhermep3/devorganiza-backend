import { notesRepository } from "../repositories/notes.js";
import {
  CreateBoxType,
  CreateNoteType,
  ReorderBoxesType,
  UpdateBoxType,
  UpdateNoteType,
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
  await notesRepository.createBox(note!.id, userId, {
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

// ---------- Boxes ----------

export const findBoxesByNote = async (notesId: string, userId: string) => {
  return notesRepository.findBoxesByNote(notesId, userId);
};

export const createBox = async (notesId: string, userId: string, data: CreateBoxType) => {
  const boxes = await notesRepository.findBoxesByNote(notesId, userId);

  const currentSize = boxes.reduce((acc, b) => {
    return acc + getContentSize(b.content);
  }, 0);

  const newBoxSize = getContentSize(data.content);

  if (currentSize + newBoxSize > MAX_NOTE_SIZE) {
    throw new AppError(
      "Tamanho máximo da anotação excedido",
      "NOTE_SIZE_LIMIT_EXCEEDED",
      400
    );
  }

  return notesRepository.createBox(notesId, userId, data);
};

export const updateBox = async (noteId: string, boxId: string, userId: string, data: UpdateBoxType) => {
  const box = await notesRepository.findBoxById(boxId, userId);
  if (!box || box.notesId !== noteId) return null;

  const boxes = await notesRepository.findBoxesByNote(noteId, userId);

  const currentSize = boxes.reduce((acc, b) => {
    if (b.id === boxId) return acc;
    return acc + getContentSize(b.content);
  }, 0);

  const newBoxSize = getContentSize(data.content);

  if (currentSize + newBoxSize > MAX_NOTE_SIZE) {
    throw new AppError(
      "Tamanho máximo da anotação excedido",
      "NOTE_SIZE_LIMIT_EXCEEDED",
      400
    );
  }

  return notesRepository.updateBox(boxId, userId, data);
};

export const deleteBox = async (noteId: string, boxId: string, userId: string) => {
  const box = await notesRepository.findBoxById(boxId, userId);
  if (!box || box.notesId !== noteId) return null;

  return notesRepository.deleteBox(boxId, userId);
};

export const reorderBoxes = async (
  noteId: string,
  userId: string,
  data: ReorderBoxesType
) => {
  // Valida que todos os boxes pertencem à nota
  const boxes = await notesRepository.findBoxesByNote(noteId, userId);
  const boxIds = new Set(boxes.map((b) => b.id));

  const allBelong = data.boxes.every((b) => boxIds.has(b.id));
  if (!allBelong) return null;

  return notesRepository.reorderBoxes(data.boxes, userId);
};