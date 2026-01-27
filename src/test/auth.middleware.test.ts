import 'dotenv/config';
import request from "supertest";
import { app } from "../app";

describe("Auth middleware", () => {
    it("debe regresar 401 si no hay token", async () => {
        const res = await request(app).get("/api/bookings");

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toContain("Authorization");
    });

    it("debe permitir registro y login, obteniendo token válido", async () => {
        const uniqueEmail = `test${Date.now()}@mail.com`;
        
        // 1) Registrar usuario
        const registerRes = await request(app).post("/api/auth/register").send({
            name: "Test User",
            email: uniqueEmail,
            password: "Password123!",
        });

        expect(registerRes.status).toBe(201);
        expect(registerRes.body).toHaveProperty("user");
        expect(registerRes.body.user.email).toBe(uniqueEmail);

        // 2) Hacer login y obtener token
        const loginRes = await request(app).post("/api/auth/login").send({
            email: uniqueEmail,
            password: "Password123!",
        });

        expect(loginRes.status).toBe(200);
        expect(loginRes.body).toHaveProperty("token");
        
        const token = loginRes.body.token;
        expect(token).toBeTruthy();
        expect(typeof token).toBe("string");

        // 3) Llamar endpoint protegido con Authorization header
        const res = await request(app)
            .get("/api/bookings")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("bookings");
        expect(Array.isArray(res.body.bookings)).toBe(true);
    });

    it("debe rechazar token inválido", async () => {
        const res = await request(app)
            .get("/api/bookings")
            .set("Authorization", "Bearer token_invalido");

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toContain("Invalid");
    });
});
