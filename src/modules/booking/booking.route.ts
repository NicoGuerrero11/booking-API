import { Router } from "express";
import { createBooking, getBooking, cancelBooking } from "./booking.controller";
import { validateBody } from "../../middleware/validate.middleware";
import { CreateBookingSchema } from "./schemas/CreateBooking";

const router: Router = Router();

router.post('/', validateBody(CreateBookingSchema), createBooking);
router.get('/', getBooking);
router.patch('/:id', cancelBooking);

export default router;