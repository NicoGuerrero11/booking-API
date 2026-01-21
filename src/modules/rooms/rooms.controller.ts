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
        const rooms = await roomsServices.getAllRooms();
        return res.status(200).json({
            message: 'Rooms retrieved successfully',
            data: rooms,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
}

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