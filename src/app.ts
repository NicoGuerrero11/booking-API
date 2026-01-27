import express, { Request, Response, Application } from 'express';
import mainRouter from './routes/main';


export const app: Application = express();

app.use(express.json());
app.use('/api', mainRouter);

app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: "ok" });
});
