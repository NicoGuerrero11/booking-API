import { Router } from "express";
import { createBooking, getBooking, cancelBooking } from "./booking.controller";
import { validateBody } from "../../middleware/validate.middleware";
import { CreateBookingSchema } from "./schemas/CreateBooking";

const router: Router = Router();


/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Crear una nueva reserva
 *     description: Crea una reserva para una habitación disponible. Requiere autenticación.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - room_id
 *               - start_date
 *               - end_date
 *             properties:
 *               room_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID de la habitación a reservar
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-02-15T14:00:00Z"
 *                 description: Fecha y hora de check-in
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-02-18T12:00:00Z"
 *                 description: Fecha y hora de check-out
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reserva creada exitosamente
 *                 booking:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Datos inválidos o habitación no disponible
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Habitación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.post('/', validateBody(CreateBookingSchema), createBooking);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Obtener mis reservas (con paginación)
 *     description: Retorna todas las reservas del usuario autenticado con soporte de paginación
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Número de página
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Cantidad de resultados por página
 *         example: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED]
 *         description: Filtrar por estado de reserva
 *         example: CONFIRMED
 *     responses:
 *       200:
 *         description: Lista de reservas del usuario con información de paginación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 5
 *                       description: Total de reservas
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                       description: Total de páginas
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   patch:
 *     summary: Cancelar una reserva
 *     description: Cambia el estado de una reserva a CANCELLED. Solo el dueño puede cancelar.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a cancelar
 *         example: 1
 *     responses:
 *       200:
 *         description: Reserva cancelada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reserva cancelada exitosamente
 *                 booking:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: La reserva ya está cancelada
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (no es tu reserva)
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error del servidor
 */
router.patch('/:id', cancelBooking);

export default router;