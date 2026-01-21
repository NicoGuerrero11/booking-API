import { Router } from "express";
import authRouter from "../modules/auth/auth.routes";
import roomsRouter from "../modules/rooms/rooms.router";
import bookingRouter from "../modules/booking/booking.route";
import { authMiddleware } from "../middleware/auth.middleware";

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/rooms', roomsRouter);
router.use('/bookings', authMiddleware, bookingRouter);

export default router;