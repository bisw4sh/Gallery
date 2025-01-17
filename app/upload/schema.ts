import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const schema = z.object({
  title: z
    .string()
    .min(1, { message: "Name length should be at least 1 character" })
    .max(50, { message: "Name length should not exceed 50 characters" }),
  author: z
    .string()
    .min(1, { message: "Author name is required" })
    .max(50, { message: "Author name should not exceed 50 characters" }),
  tags: z.string().optional(),
  picture: z
    .any()
    .refine((file) => file instanceof FileList && file.length > 0, {
      message: "File is required",
    })
    .refine((file) => file[0]?.size <= MAX_FILE_SIZE, {
      message: "Max image size is 5MB",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file[0]?.type), {
      message: "Only .jpg, .jpeg, .png, and .webp formats are supported",
    }),
});

export type Schema = z.infer<typeof schema>;
