import { CreateRoomDTO } from './schemas/CreateRoomSchema';
import { db } from '../../db/db';
import { rooms } from '../../db/schema';
import { eq, count, and } from 'drizzle-orm';

interface PaginationParams {
    page?: number | undefined;
    limit?: number | undefined;
    type?: 'Normal' | 'VIP' | 'Presidential' | undefined;
    available?: boolean | undefined;
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

export const roomsServices = {

    // add room (admin)
    addRoom: async (data: CreateRoomDTO) => {
        const { name, type, price_per_night, is_available } = data;
        const [room] = await db
            .insert(rooms)
            .values({
                name,
                type,
                price_per_night,
                is_available,
            })
            .returning({
                id: rooms.id,
                name: rooms.name,
                type: rooms.type,
                price_per_night: rooms.price_per_night,
                is_available: rooms.is_available,
            });
        return room;

    },

    // get all rooms
    getAllRooms: async (
        params: PaginationParams = {}
    ): Promise<PaginatedResponse<typeof rooms.$inferSelect>> => {
        // Valores por defecto
        const page = params.page && params.page > 0 ? params.page : 1;
        const limit = params.limit && params.limit > 0 && params.limit <= 100 ? params.limit : 10;
        const offset = (page - 1) * limit;

        // Construir filtros dinámicos
        const filters = [];
        if (params.type) {
            filters.push(eq(rooms.type, params.type));
        }
        if (params.available !== undefined) {
            filters.push(eq(rooms.is_available, params.available));
        }

        // Obtener total de registros (para calcular páginas)
        const [totalResult] = await db
            .select({ count: count() })
            .from(rooms)
            .where(filters.length > 0 ? and(...filters) : undefined);

        const total = totalResult?.count ?? 0;
        const totalPages = Math.ceil(total / limit);

        // Obtener datos paginados
        const data = await db
            .select()
            .from(rooms)
            .where(filters.length > 0 ? and(...filters) : undefined)
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

    // get room by id
    getRoomById: async (id: number) => {
        const [room] = await db
            .select()
            .from(rooms)
            .where(eq(rooms.id, id))
            .limit(1);

        return room;
    },
}