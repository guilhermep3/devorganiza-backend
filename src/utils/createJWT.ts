import jwt from "jsonwebtoken";

export const createJWT = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: 86400 * 3 }) // 3 dias
}
