import * as z from 'zod';

export const CreateRoomSchema = z.object({
    name: z.string().min(1, 'Room name is required'),
    type: z.enum(['Normal', 'VIP', 'Presidential']).default('Normal'),
    price_per_night: z.string().min(0, 'Price per night must be a positive number'),
    is_available: z.boolean().optional(),
})

export type CreateRoomDTO = z.infer<typeof CreateRoomSchema>;