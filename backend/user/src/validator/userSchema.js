import { z, ZodError } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
});
