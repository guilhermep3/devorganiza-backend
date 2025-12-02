import z from "zod";
import { usersTable } from "../db/schema";

export type UserInsert = typeof usersTable.$inferInsert;
export type UpdateUserType = z.infer<typeof updateUserSchema>;

export const signupSchema: z.ZodType<UserInsert> = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  username: z.string().min(3, "Usuário muito curto").max(40, "Usuário deve ter no máximo 40 caracteres")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Username pode conter letras, números, _ . -"),
  email: z.string().email("Email inválido").max(100),
  password: z.string().min(4, "Senha deve ter pelo menos 4 caracteres").max(255, "Senha muito longa"),
})

export const signinSchema = z.object({
  email: z.string({ message: 'Email é obrigatório.' }).email({ message: 'Email inválido' }),
  password: z.string({ message: 'Senha é obrigatória.' }).min(4, 'Mínimo 4 caracteres.')
})

export const updateUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres").optional(),
  username: z.string().min(3, "Usuário muito curto").max(40, "Usuário deve ter no máximo 40 caracteres")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Username pode conter letras, números, _ . -").optional(),
  email: z.string().email("Email inválido").max(100).optional(),
  password: z.string().min(4, "Senha deve ter pelo menos 4 caracteres").max(255, "Senha muito longa").optional(),
  role: z.string().optional()
})
