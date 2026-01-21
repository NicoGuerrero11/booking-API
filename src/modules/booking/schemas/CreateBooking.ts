import * as z from 'zod';

export const CreateBookingSchema = z.object({
    room_id: z.number().int().positive({ message: 'Room ID must be a positive integer' }),
    start_date: z.iso.datetime({ message: "Invalid start date" }),
    end_date: z.iso.datetime({ message: "Invalid end date" }),
}).refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: 'End date must be after start date',
    path: ['end_date'],
})
    .transform((data) => ({
        ...data,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
    }));

export type CreateBookingDTO = z.infer<typeof CreateBookingSchema>;