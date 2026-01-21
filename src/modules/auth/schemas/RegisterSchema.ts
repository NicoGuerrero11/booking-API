import * as z from 'zod';

export const RegisterSchema = z.object({
    name: z.string(),
    email: z.email("invalid email"),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    is_admin: z.boolean().optional()
})

export type RegisterDTO = z.infer<typeof RegisterSchema>;