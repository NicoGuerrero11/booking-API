import swaggerJSDoc from "swagger-jsdoc";
import { Express } from "express";
import swaggerUi from 'swagger-ui-express'

const options: swaggerJSDoc.Operation = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Booking API',
            version: '1.0.0',
            description: 'API REST para gestion de reservas de hotel con autenticación JWT y sistema de roles',
            contact: {
                name: 'Nicolas Guerrero',
                url: 'https://github.com/NicoGuerrero11',
            },
            licence: {
                name: 'ISC',
                url: 'https://opensource.org/licenses/ISC',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desarrollo'
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Ingresa el token JWT obtenido del login (sin el prefijo "Bearer")',
                },
            },
            schemas: {
                // ERROR
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Manejo de error',
                            example: 'Ocurrio un error',
                        },
                        error: {
                            type: 'string',
                            description: 'Detalles adicionales del error',
                            example: 'Error destallado aqui',
                        },
                    },
                },
                // USER
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID unico del usuario',
                            example: 1
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre completo del usuario',
                            Example: 'Nico Guerrero'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email del usuario',
                            example: 'nico@gmail.com',
                        },
                        is_admin: {
                            type: 'boolean',
                            description: 'Indica si el user es administrador',
                            example: false,
                        },
                    },
                },
                // ROOM
                Room: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID unico por habitacion',
                            example: 1,
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre de la habitacion',
                            example: 'Suite 101',
                        },
                        type: {
                            type: 'string',
                            enum: ['Normal', 'VIP', 'Presidencial'],
                            description: 'Tipo de habitacion',
                            example: 'VIP',
                        },
                        price_per_night: {
                            type: 'string',
                            description: 'Precio por noche',
                            example: '150.00',
                        },
                        is_available: {
                            type: 'boolean',
                            description: 'Indica si la habitacion esta disponible',
                            example: true,
                        },
                    },
                },
                // Booking
                Booking: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'ID único de la reserva',
                            example: 1,
                        },
                        user_id: {
                            type: 'integer',
                            description: 'ID del usuario que hizo la reserva',
                            example: 1,
                        },
                        room_id: {
                            type: 'integer',
                            description: 'ID de la habitación reservada',
                            example: 1,
                        },
                        start_date: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha y hora de inicio de la reserva',
                            example: '2026-02-15T14:00:00Z',
                        },
                        end_date: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha y hora de fin de la reserva',
                            example: '2026-02-18T12:00:00Z',
                        },
                        status: {
                            type: 'string',
                            enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
                            description: 'Estado actual de la reserva',
                            example: 'PENDING',
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de creación de la reserva',
                            example: '2026-02-10T10:30:00Z',
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: 'Health',
                description: 'Health check del server',
            },
            {
                name: 'Auth',
                description: 'Endpoints de auth y register',
            },
            {
                name: 'Rooms',
                description: 'Gesttion de habitaciones (CRUD)',
            },
            {
                name: 'Bookings',
                description: 'Gestion de reservas',
            },
        ],
    },
    // Archivos de busqueda [documentacion]
    apis: [
        './src/app.ts',
        './src/modules/**/*.ts',
        './src/routes/**/*.ts'
    ],
};

const swaggertSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
    // UI en /api-docs

    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggertSpec, {
            customCss: 'swagger-ui .topbar {display:none}',
            customSiteTitle: 'Booking API - Documentation',
        })
    );

    // JSON endpoint
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggertSpec);
    });
    console.log('📚 Swagger docs disponibles en: http://localhost:3000/api-docs');
}