import { Request, Response } from 'express';
import { CreateRoomDTO } from './schemas/CreateRoomSchema';
import { roomsServices } from './rooms.services';

export const addNewRoom = async (req: Request, res: Response) => {
    try {
        const data: CreateRoomDTO = req.body;
        const newRoom = await roomsServices.addRoom(data);
        return res.status(201).json({
            message: 'Room added successfully',
            data: newRoom,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
}

export const getAllRooms = async (req: Request, res: Response) => {
    try {
        // Extraer parámetros de query
        const page = req.query.page ? parseInt(req.query.page as string) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
        const type = req.query.type as 'Normal' | 'VIP' | 'Presidential' | undefined;
        const available = req.query.available === 'true' ? true :
            req.query.available === 'false' ? false :
                undefined;

        const result = await roomsServices.getAllRooms({
            page,
            limit,
            type,
            available
        });

        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error al obtener habitaciones:', error);
        res.status(500).json({
            message: 'Error al obtener habitaciones',
            error: error.message,
        });
    }
};

export const getRoom = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: 'Invalid room id',
            });
        }
        const room = await roomsServices.getRoomById(id);

        if (!room) {
            return res.status(404).json({
                message: 'Room not found',
            });
        }

        return res.status(200).json({
            message: 'Room retrieved successfully',
            data: room,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
}