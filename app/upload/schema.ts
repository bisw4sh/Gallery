import { z } from "zod";

export const schema = z.object({
  title: z
    .string()
    .min(1, { message: "name lenghth should be atleast 1 character" })
    .max(50),
  author: z.string().min(1).max(50),
  tags: z.string().optional(),
});

export type Schema = z.infer<typeof schema>;
