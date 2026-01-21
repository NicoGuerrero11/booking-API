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
            newBooking
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }

};


export const getBooking = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const userId = req.user.id;
        const bookings = await bookingService.getBooking(userId);
        return res.status(200).json({
            message: 'Bookings retrieved successfully',
            bookings
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
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


