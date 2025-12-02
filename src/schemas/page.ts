import z from "zod";

export const pageSchema = z.object({
  page: z.coerce.number().min(0).optional()
})