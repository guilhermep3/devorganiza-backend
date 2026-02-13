import type { Request, Response } from "express";
import slug from "slug";
import { createUser, findUserByEmail, findUserByUsername } from "../services/user.js";
import { compare, hash } from "bcrypt-ts";
import { createJWT } from "../middlewares/jwt.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const hasEmail = await findUserByEmail(data.email);
    if (hasEmail) {
      res.status(409).json({ error: 'Email já existe' });
      return;
    }

    let finalUsername = data.username;
    let userExists = await findUserByUsername(finalUsername);

    while (userExists) {
      const slugSuffix = Math.floor(Math.random() * 999999).toString();
      finalUsername = slug(data.username + slugSuffix);
      userExists = await findUserByUsername(finalUsername);
    }

    const hashPassword = await hash(data.password, 10);

    const userData = {
      name: data.name,
      username: finalUsername,
      email: data.email,
      password: hashPassword,
    }

    const newUser = await createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar conta de usuário", errorDetails: error });
  }
}

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const account = await findUserByEmail(email);
    if (!account) {
      res.status(400).json({ error: 'Acesso negado' });
      return;
    }

    const verifyPassword = await compare(
      password,
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
    res.status(500).json({ error: "Erro ao fazer login", errorDetails: error });
  }
}