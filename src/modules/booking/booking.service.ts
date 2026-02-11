import { db } from '../../db/db'
import { bookings, rooms } from '../../db/schema'
import { CreateBookingDTO } from './schemas/CreateBooking'
import { and, lt, gt, eq, ne, count, desc } from 'drizzle-orm'
import { ConflictError, NotFoundError } from '../../utils/errors'

type CurrentUser = { id: number, isAdmin: boolean }

// Interfaces para paginación
interface BookingPaginationParams {
    userId: number;
    page?: number | undefined;
    limit?: number | undefined;
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | undefined;
}
interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const bookingService = {
    createBooking: async (userId: number, bookingData: CreateBookingDTO) => {
        const { room_id, start_date, end_date } = bookingData;

        const roomsExist = await db
            .select({ id: rooms.id })
            .from(rooms)
            .where(eq(rooms.id, room_id))
            .limit(1);

        if (roomsExist.length === 0) {
            throw new NotFoundError('The specified room does not exist.');
        }

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
                room_id: bookings.room_id,
                start_date: bookings.start_date,
                end_date: bookings.end_date,
                status: bookings.status
            })

        return newBooking;
    },

    getBooking: async (
        params: BookingPaginationParams
    ): Promise<PaginatedResponse<typeof bookings.$inferSelect>> => {
        // Valores por defecto
        const page = params.page && params.page > 0 ? params.page : 1;
        const limit = params.limit && params.limit > 0 && params.limit <= 100 ? params.limit : 10;
        const offset = (page - 1) * limit;

        // Construir filtros
        const filters = [eq(bookings.user_id, params.userId)];
        if (params.status) {
            filters.push(eq(bookings.status, params.status));
        }

        // Obtener total
        const [totalResult] = await db
            .select({ count: count() })
            .from(bookings)
            .where(and(...filters));

        const total = totalResult?.count ?? 0;
        const totalPages = Math.ceil(total / limit);

        // Obtener datos paginados (ordenados por fecha de creación, más recientes primero)
        const data = await db
            .select()
            .from(bookings)
            .where(and(...filters))
            .orderBy(desc(bookings.created_at))
            .limit(limit)
            .offset(offset);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        };
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