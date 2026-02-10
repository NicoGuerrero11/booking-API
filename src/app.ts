import express, { Request, Response, Express } from 'express';
import { setupSwagger } from './swagger';
import mainRouter from './routes/main';



const app: Express = express();

app.use(express.json());
app.use('/api', mainRouter);


/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificar estado del servidor
 *     description: Endpoint para verificar que la API está funcionando correctamente
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: "ok" });
});

setupSwagger(app);


export default app