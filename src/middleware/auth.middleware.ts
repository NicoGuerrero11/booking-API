import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { db } from '../db/db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';


const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Invalid token format' });
    }
    try {
        const verifyToken = jwt.verify(token, JWT_SECRET!) as JwtPayload;

        const result = await db
            .select({
                id: users.id,
                email: users.email,
                isAdmin: users.is_admin,
            })
            .from(users)
            .where(eq(users.id, verifyToken.id))
            .limit(1);

        const user = result[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

}