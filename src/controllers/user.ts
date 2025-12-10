import { Response } from "express";
import { ExtendedRequest } from "../types/request.js";
import {
  deleteUserById, findAllUsers, findUserById, findUserStudies,
  getUserStudiesCount, getUserStudiesPercentage, getUserTasksCount, updateImageByUser, updateUserById
} from "../services/user.js";
import cloudinary from "../utils/cloudinary.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { updateUserSchema } from "../schemas/auth.js";

export const getAllUsers = async (req: ExtendedRequest, res: Response) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 0;

    const perPage = 10;
    const currentPage = page ?? 0;

    const users = await findAllUsers(perPage, currentPage);

    res.json({ users, page: currentPage });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar todos os usuários", errorDetails: error });
  }
};

export const getUser = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged as string;

    const user = await findUserById(idLogged);
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    const studiesCount = await getUserStudiesCount(user.id);
    const tasksCount = await getUserTasksCount(user.id);
    const studiesPercentage = await getUserStudiesPercentage(user.id);

    res.json({ user, studiesCount, tasksCount, studiesPercentage });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário", errorDetails: error });
  }
};

export const getStudies = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged as string;

    if (!idLogged) {
      res.status(401).json({ error: "Acesso negado" });
      return;
    }

    const studies = await findUserStudies(idLogged);

    res.json({ studies });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar estudos", errorDetails: error });
  }
};

export const updateUser = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged as string;

    const data = updateUserSchema.safeParse(req.body);
    if (!data.success || !data.data) {
      res.status(422).json({ error: data.error.flatten() });
      return;
    }

    const userUpdated = await updateUserById(idLogged, data.data);
    if (!userUpdated) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    res.json({ userUpdated });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário", errorDetails: error });
  }
};

export const updateUserImage = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.idLogged as string;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "Nenhum arquivo enviado." });
      return;
    }

    const user = await findUserById(userId);
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer, "Users");

    if (user.profileImage) {
      const publicId = user.profileImage.split("/").pop()?.split(".")[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`Users/${publicId}`);
      }
    }

    const updatedUser = await updateImageByUser(userId, imageUrl);

    res.status(200).json({
      message: `Imagem ${user.profileImage ? "atualizada" : "adicionada"} com sucesso!`,
      imageUrl,
      user: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Erro ao atualizar imagem do usuário",
      details: error.message || error
    });
  }
};

export const deleteUser = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.idLogged as string;

    await deleteUserById(userId);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário", errorDetails: error });
  }
};
