import * as z from 'zod';
export const LoginSchema = z.object({
    email: z.email("invalid email"),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export type LoginDTO = z.infer<typeof LoginSchema>;