import { Router } from 'express';
import { addNewRoom, getAllRooms, getRoom } from './rooms.controller';
import { CreateRoomSchema } from './schemas/CreateRoomSchema';
import { validateBody } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { isAdmin } from '../../middleware/role.middleware';


const roomsRouter: Router = Router();


/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Crear una nueva habitación (solo admin)
 *     description: Crea una habitación nueva. Requiere autenticación y rol de administrador.
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - price_per_night
 *             properties:
 *               name:
 *                 type: string
 *                 example: Suite 101
 *                 description: Nombre descriptivo de la habitación
 *               type:
 *                 type: string
 *                 enum: [Normal, VIP, Presidential]
 *                 example: VIP
 *                 description: Tipo de habitación
 *               price_per_night:
 *                 type: string
 *                 example: "150.00"
 *                 description: Precio por noche (formato decimal)
 *     responses:
 *       201:
 *         description: Habitación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Habitación creada exitosamente
 *                 room:
 *                   $ref: '#/components/schemas/Room'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (requiere rol de administrador)
 *       500:
 *         description: Error del servidor
 */

roomsRouter.post('/', validateBody(CreateRoomSchema), authMiddleware, isAdmin, addNewRoom);

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Obtener lista de habitaciones (con paginación)
 *     description: Retorna todas las habitaciones con soporte de paginación y filtros. Endpoint público.
 *     tags: [Rooms]
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Normal, VIP, Presidential]
 *         description: Filtrar por tipo de habitación
 *         example: VIP
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filtrar solo habitaciones disponibles
 *         example: true
 *     responses:
 *       200:
 *         description: Lista de habitaciones con información de paginación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Room'
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
 *                       example: 25
 *                       description: Total de habitaciones
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                       description: Total de páginas
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
roomsRouter.get('/', getAllRooms);

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Obtener una habitación por ID
 *     description: Retorna los detalles de una habitación específica
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la habitación
 *         example: 1
 *     responses:
 *       200:
 *         description: Habitación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Habitación no encontrada
 *       500:
 *         description: Error del servidor
 */
roomsRouter.get('/:id', getRoom);

export default roomsRouter;
