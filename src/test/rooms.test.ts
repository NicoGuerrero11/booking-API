// src/test/rooms.test.ts
import 'dotenv/config';
import request from 'supertest';
import app from '../app';

describe('GET /api/rooms', () => {
    it('debe retornar lista de habitaciones con paginación', async () => {
        const res = await request(app).get('/api/rooms');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('pagination');
        expect(Array.isArray(res.body.data)).toBe(true);

        // Verificar estructura de paginación
        expect(res.body.pagination).toHaveProperty('page');
        expect(res.body.pagination).toHaveProperty('limit');
        expect(res.body.pagination).toHaveProperty('total');
        expect(res.body.pagination).toHaveProperty('totalPages');
    });

    it('debe aceptar parámetros de paginación', async () => {
        const res = await request(app).get('/api/rooms?page=1&limit=5');

        expect(res.status).toBe(200);
        expect(res.body.pagination.page).toBe(1);
        expect(res.body.pagination.limit).toBe(5);
        expect(res.body.data.length).toBeLessThanOrEqual(5);
    });

    it('debe filtrar por tipo de habitación', async () => {
        const res = await request(app).get('/api/rooms?type=VIP');

        expect(res.status).toBe(200);

        // Si hay resultados, verificar que todos sean VIP
        if (res.body.data.length > 0) {
            res.body.data.forEach((room: any) => {
                expect(room.type).toBe('VIP');
            });
        }
    });

    it('debe filtrar por disponibilidad', async () => {
        const res = await request(app).get('/api/rooms?available=true');

        expect(res.status).toBe(200);

        // Si hay resultados, verificar que todos estén disponibles
        if (res.body.data.length > 0) {
            res.body.data.forEach((room: any) => {
                expect(room.is_available).toBe(true);
            });
        }
    });
});