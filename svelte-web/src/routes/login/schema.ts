import {z} from "zod";

export const formSchema = z.object({
  username: z
    .string()
    .regex(/^[a-zA-Z][a-zA-Z0-9]*$/, "Username must start with a letter")
    .refine(
      (value) => {
        const numbers = value.match(/\d/g);
        return numbers === null || numbers.length <= 4;
      },
      "Username can only contain up to 4 numbers"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export type FormSchema = typeof formSchema;