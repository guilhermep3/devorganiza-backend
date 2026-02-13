import type { Response } from "express";
import type { ExtendedRequest } from "../types/request.js";
import {
  createUserTask, deleteUserTask, findFinishedTasksCount, findTaskById, findTasksCount, updateUserTask
} from "../services/task.js";
import { TaskInsert, updateTaskSchema } from "../schemas/task.js";
import { updateStudyStatusProgress } from "../services/study.js";

export const createTask = async (req: ExtendedRequest, res: Response) => {
  try {
    const studyId = req.params.studyId as string;
    if (!studyId) {
      res.status(400).json({ error: "Id do estudo inválido" });
      return;
    }

    const data: TaskInsert = req.body;

    const convertedData = {
      ...data,
      title: data.title,
      link: data.link ?? null,
      finishIn: data.finishIn ?? null,
      done: false,
    };

    const newTask = await createUserTask({
      ...convertedData,
      studyId
    });


    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar tarefa", errorDetails: error });
  }
}

export const updateTask = async (req: ExtendedRequest, res: Response) => {
  try {
    const taskId = req.params.taskId as string;

    if (!taskId) {
      res.status(400).json({ error: "Id da tarefa inválida" });
      return;
    }

    const safeData = updateTaskSchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(400).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const currentTask = await findTaskById(taskId);

    if (!currentTask) {
      res.status(404).json({ error: "Tarefa não encontrada" });
      return;
    }

    const studyId = (currentTask as any).studyId;

    const cleanedData: any = Object.fromEntries(
      Object.entries(safeData.data).filter(([_, v]) => v !== undefined)
    );

    if ("done" in cleanedData) {
      if (cleanedData.done === true) {
        cleanedData.finishedAt = new Date();
      } else {
        cleanedData.finishedAt = null;
      }
    }

    const updatedTask = await updateUserTask(taskId, cleanedData as Parameters<typeof updateUserTask>[1]);

    if ("done" in cleanedData) {
      const tasksCount = await findTasksCount(studyId);
      const finishedTasksCount = await findFinishedTasksCount(studyId);

      const progress = tasksCount === 0 ? 0 : Math.round((finishedTasksCount / tasksCount) * 100);

      await updateStudyStatusProgress(studyId, progress);
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao atualizar tarefa",
      errorDetails: error instanceof Error ? error.message : error
    });
  }
};

export const deleteTask = async (req: ExtendedRequest, res: Response) => {
  try {
    const taskId = req.params.taskId as string;
    if (!taskId) {
      res.status(400).json({ error: "Id da tarefa inválida" });
      return;
    }

    await deleteUserTask(taskId);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar tarefa", errorDetails: error });
  }
}