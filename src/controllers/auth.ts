import type { Request, Response } from "express";
import { signinSchema, signupSchema } from "../schemas/auth.js";
import slug from "slug";
import { createUser, findUserByEmail, findUserByUsername } from "../services/user.js";
import { compare, hash } from "bcrypt-ts";
import { createJWT } from "../middlewares/jwt.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const safeData = signupSchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(422).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const hasEmail = await findUserByEmail(safeData.data.email);
    if (hasEmail) {
      res.status(409).json({ error: 'Email já existe' });
      return;
    }

    let generateSlug = true;
    let username = safeData.data.username;
    while (generateSlug) {
      const hasSlug = await findUserByUsername(username);
      if (hasSlug) {
        const slugSuffix = Math.floor(Math.random() * 999999).toString();
        username = slug(safeData.data.username + slugSuffix);
      } else {
        generateSlug = false;
      }
    }

    const hashPassword = await hash(safeData.data.password, 10);

    const userData = {
      ...safeData.data,
      username,
      password: hashPassword
    }

    const newUser = await createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar conta de usuário", errorDetails: error });
  }
}

export const signin = async (req: Request, res: Response) => {
  try {
    const safeData = signinSchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(422).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const account = await findUserByEmail(safeData.data.email);
    if (!account) {
      res.status(400).json({ error: 'Acesso negado' });
      return;
    }

    const verifyPassword = await compare(
      safeData.data.password,
      account.password
    );

    if (!verifyPassword) {
      res.status(400).json({ error: 'Acesso negado' });
      return;
    }

    const token = await createJWT(
      account.id as string,
      account.role
    );

    const { password: _, ...userWithoutPassword } = account;

    res.json({
      message: "Login bem sucedido",
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar conta de usuário", errorDetails: error });
  }
}