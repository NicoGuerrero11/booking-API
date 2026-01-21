import { db } from '../../db/db'
import { bookings, rooms } from '../../db/schema'
import { CreateBookingDTO } from './schemas/CreateBooking'
import { and, lt, gt, eq, ne, or } from 'drizzle-orm'
import { ConflictError, NotFoundError } from '../../utils/errors'

type CurrentUser = { id: number, isAdmin: boolean }


export const bookingService = {
    createBooking: async (userId: number, bookingData: CreateBookingDTO) => {
        const { room_id, start_date, end_date } = bookingData;

        const overLapping = await db
            .select({ id: bookings.id })
            .from(bookings)
            .where(
                and(
                    eq(bookings.room_id, room_id),
                    ne(bookings.status, 'CANCELLED'),
                    lt(bookings.start_date, end_date),
                    gt(bookings.end_date, start_date)
                )
            )
            .limit(1);

        if (overLapping.length > 0) {
            throw new ConflictError('The room is already booked for the selected dates.');
        }
        const [newBooking] = await db
            .insert(bookings)
            .values({
                user_id: userId,
                room_id,
                start_date,
                end_date,
                status: "PENDING"
            })
            .returning({
                id: bookings.id,
                start_date: bookings.start_date,
                end_date: bookings.end_date,
                status: bookings.status
            })

        return newBooking;
    },

    getBooking: async (userId: number) => {
        const userBookings = await db
            .select({
                id: bookings.id,
                room: {
                    id: rooms.id,
                    name: rooms.name,
                    type: rooms.type
                },
                start_date: bookings.start_date,
                end_date: bookings.end_date,
                status: bookings.status
            })
            .from(bookings)
            .innerJoin(rooms, eq(bookings.room_id, rooms.id))
            .where(
                and(
                    eq(bookings.user_id, userId),
                    ne(bookings.status, 'CANCELLED')
                )
            );
        return userBookings;

    },

    cancelBooking: async (bookingId: number, user: CurrentUser) => {
        const result = await db
            .select({
                id: bookings.id,
                user_id: bookings.user_id,
                status: bookings.status
            })
            .from(bookings)
            .where(eq(bookings.id, bookingId))
            .limit(1);

        const booking = result[0];

        if (!booking) {
            throw new NotFoundError('Booking not found.');
        }

        if (booking.status === "CANCELLED") {
            return { id: booking.id, status: booking.status }
        }

        const isOwner = booking.user_id === user.id;
        if (!isOwner && !user.isAdmin) {
            throw new ConflictError('You do not have permission to cancel this booking.');
        }

        const updatedBooking = await db
            .update(bookings)
            .set({ status: 'CANCELLED' })
            .where(eq(bookings.id, bookingId))
            .returning({
                id: bookings.id,
                status: bookings.status
            });

        return updatedBooking[0];

    },
}