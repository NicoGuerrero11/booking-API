import { Request, Response } from 'express';
import { AppError } from '../../utils/errors';
import { bookingService } from './booking.service';
import { CreateBookingDTO } from './schemas/CreateBooking';


// cliente
export const createBooking = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const { id } = req.user;
        const bookingData: CreateBookingDTO = req.body;
        const newBooking = await bookingService.createBooking(id, bookingData);
        return res.status(201).json({
            message: 'Booking created successfully',
            booking: newBooking

        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }

};


export const getBooking = async (req: Request, res: Response) => {
    try {
        // @ts-ignore - el middleware authMiddleware agrega req.user
        const userId = req.user.id;

        // Extraer parámetros de query
        const page = req.query.page ? parseInt(req.query.page as string) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
        const status = req.query.status as 'PENDING' | 'CONFIRMED' | 'CANCELLED' | undefined;

        const result = await bookingService.getBooking({
            userId,
            page,
            limit,
            status
        });

        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({
            message: 'Error al obtener reservas',
            error: error.message,
        });
    }
};

// cliente o admin
export const cancelBooking = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { id, isAdmin } = req.user;
    const bookingId = req.params.id;
    try {
        const user = { id, isAdmin };
        const cancel = await bookingService.cancelBooking(Number(bookingId), user);
        return res.status(200).json({
            message: 'Booking cancelled successfully',
            cancel
        });

    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};


