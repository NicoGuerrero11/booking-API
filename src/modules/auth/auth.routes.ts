import { Router } from "express";
import { register, login } from "./auth.controller";
import { validateBody } from "../../middleware/validate.middleware";
import { RegisterSchema } from "./schemas/RegisterSchema";
import { LoginSchema } from "./schemas/LoginSchema";
const router: Router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea una cuenta de usuario nueva. Por defecto, el usuario no es administrador.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nico Guerrero
 *                 description: Nombre completo del usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nico@example.com
 *                 description: Email único del usuario
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *                 minLength: 6
 *                 description: Contraseña (mínimo 6 caracteres)
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario registrado exitosamente
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos o email ya existe
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
router.post('/register', validateBody(RegisterSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica un usuario y devuelve un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nico@example.com
 *                 description: Email del usuario registrado
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqdWFuQGV4YW1wbGUuY29tIiwiaXNfYWRtaW4iOmZhbHNlLCJpYXQiOjE3MDk1NjQwMDB9.xyz123
 *                   description: Token JWT para autenticación (válido por 7 días)
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado
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
router.post('/login', validateBody(LoginSchema), login);

export default router;