import type { Request, Response } from "express";
import slug from "slug";
import { createUser, findUserByEmail, findUserByUsername } from "../services/user.js";
import { hash } from "bcrypt-ts";
import { usersTable } from "../db/schema.js";
import { createJWT } from "../utils/createJWT.js";

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" as const : "lax" as const,
  path: "/",
  maxAge: 86400 * 3 * 1000,
};

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
    const user = req.user as typeof usersTable.$inferSelect;

    const token = await createJWT(
      user.id as string,
      user.role
    );

    if (user.provider === "local") {
      if (user.googleId && !user.password) {
        return res.status(400).json({
          error: "Esta conta foi criada com Google."
        });
      }
    }

    const { password: _, ...userWithoutPassword } = user;

    res.cookie("token", token, cookieOptions);

    res.json({
      message: "Login bem sucedido",
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login", errorDetails: error });
  }
}

export const googleAuthCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as typeof usersTable.$inferSelect;

    const token = await createJWT(
      user.id as string,
      user.role
    );

    res.cookie("token", token, cookieOptions);

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback`);
  } catch (error) {
    res.status(500).json({
      error: "Erro na autenticação Google"
    });
  }
}