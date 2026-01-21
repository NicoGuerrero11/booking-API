import express, { Request, Response } from 'express';
import 'dotenv/config';
import mainRouter from './routes/main';

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/api', mainRouter);

app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
