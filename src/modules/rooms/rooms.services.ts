import { CreateRoomDTO } from './schemas/CreateRoomSchema';
import { db } from '../../db/db';
import { rooms } from '../../db/schema';
import { eq } from 'drizzle-orm';

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
    getAllRooms: async () => {
        const allRooms = await db
            .select()
            .from(rooms)

        return allRooms;
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