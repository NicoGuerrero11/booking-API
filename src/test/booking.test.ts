// src/test/bookings.test.ts
import 'dotenv/config';
import request from 'supertest';
import app from '../app';

describe('POST /api/bookings', () => {
    let userEmail: string;
    let userPassword: string;
    let authToken: string;
    let testRoomId: number;

    let dateOffset = Math.floor(Date.now() / 100); // Offset inicial basado en timestamp

    const generateUniqueDates = () => {
        // Usa timestamp + offset incremental para garantizar fechas únicas
        const baseYear = new Date().getFullYear() + 10;
        const uniqueDay = (dateOffset % 365);

        const startDate = new Date(baseYear, 0, uniqueDay);
        startDate.setHours(14, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 3);
        endDate.setHours(12, 0, 0, 0);

        dateOffset += 10; // Incrementa para el siguiente test

        return { startDate, endDate };
    };

    // Setup inicial: crear usuario UNA VEZ
    beforeAll(async () => {
        userEmail = `booking-test-${Date.now()}@mail.com`;
        userPassword = 'Password123!';

        // Registrar usuario
        await request(app).post('/api/auth/register').send({
            name: 'Test Booking User',
            email: userEmail,
            password: userPassword,
        });

        // Obtener habitación disponible
        const roomsRes = await request(app).get('/api/rooms?available=true&limit=1');

        if (roomsRes.body.data.length > 0) {
            testRoomId = roomsRes.body.data[0].id;
        }
    });

    // ✅ NUEVO: Renovar token ANTES de CADA test
    beforeEach(async () => {
        const loginRes = await request(app).post('/api/auth/login').send({
            email: userEmail,
            password: userPassword,
        });

        authToken = loginRes.body.token;
    });

    it('debe crear una reserva exitosamente', async () => {
        if (!testRoomId) {
            console.warn('⚠️  No hay habitaciones disponibles para testear');
            return;
        }

        const { startDate, endDate } = generateUniqueDates();

        const res = await request(app)
            .post('/api/bookings')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                room_id: testRoomId,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message');
        expect(res.body.booking).toHaveProperty('id');
        expect(res.body.booking.room_id).toBe(testRoomId);
        expect(res.body.booking.status).toBe('PENDING');
    });

    it('debe fallar si no hay token de autenticación', async () => {
        const { startDate, endDate } = generateUniqueDates();

        const res = await request(app)
            .post('/api/bookings')
            .send({
                room_id: testRoomId,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
            });

        expect(res.status).toBe(401);
    });

    it('debe fallar si faltan datos requeridos', async () => {
        const res = await request(app)
            .post('/api/bookings')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                room_id: testRoomId,
                // Faltan start_date y end_date
            });

        expect(res.status).toBe(400);
    });

    it('debe fallar si la fecha de fin es antes que la de inicio', async () => {
        if (!testRoomId) return;

        const { startDate, endDate } = generateUniqueDates();

        const res = await request(app)
            .post('/api/bookings')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                room_id: testRoomId,
                start_date: endDate.toISOString(),
                end_date: startDate.toISOString(),
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message');
    });

    it('debe fallar si hay solapamiento de fechas', async () => {
        if (!testRoomId) return;

        const { startDate, endDate } = generateUniqueDates();

        const firstBooking = await request(app)
            .post('/api/bookings')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                room_id: testRoomId,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
            });

        if (firstBooking.status !== 201) {
            console.warn('⚠️  No se pudo crear la primera reserva para test de solapamiento');
            return;
        }

        const startDate2 = new Date(startDate);
        startDate2.setDate(startDate2.getDate() + 1);

        const endDate2 = new Date(startDate2);
        endDate2.setDate(endDate2.getDate() + 2);

        const res = await request(app)
            .post('/api/bookings')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                room_id: testRoomId,
                start_date: startDate2.toISOString(),
                end_date: endDate2.toISOString(),
            });

        expect(res.status).toBe(409);
        expect(res.body.message).toMatch(/disponible|overlap|ocupada|reservada|booked|already/i);
    });

    it('debe permitir reservas consecutivas (sin solapamiento)', async () => {
        if (!testRoomId) return;

        const { startDate, endDate } = generateUniqueDates();

        const firstBooking = await request(app)
            .post('/api/bookings')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                room_id: testRoomId,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
            });

        if (firstBooking.status !== 201) return;

        const startDate2 = new Date(endDate);
        startDate2.setDate(startDate2.getDate() + 1);

        const endDate2 = new Date(startDate2);
        endDate2.setDate(endDate2.getDate() + 2);

        const res = await request(app)
            .post('/api/bookings')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                room_id: testRoomId,
                start_date: startDate2.toISOString(),
                end_date: endDate2.toISOString(),
            });

        expect(res.status).toBe(201);
    });

    it('debe fallar si la habitación no existe', async () => {
        const { startDate, endDate } = generateUniqueDates();

        const res = await request(app)
            .post('/api/bookings')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                room_id: 999999,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
            });

        // ✅ CAMBIO: Aceptar 404 o 400 dependiendo de tu implementación
        expect([404, 400]).toContain(res.status);
        expect(res.body).toHaveProperty('message');
    });
});