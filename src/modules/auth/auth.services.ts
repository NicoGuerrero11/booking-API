import { db } from '../../db/db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { hash, verify } from 'argon2';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
}

import { ConflictError, UnauthorizedError, NotFoundError } from '../../utils/errors';
import { RegisterDTO } from './schemas/RegisterSchema';
import { LoginDTO } from './schemas/LoginSchema';

export const authServices = {
    registerUser: async (data: RegisterDTO) => {
        const { name, email, password, is_admin } = data;
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (existingUser.length > 0) {
            throw new ConflictError('Email is already in use');
        }
        const hashedPassword = await hash(password);
        const [createdUser] = await db
            .insert(users)
            .values({
                name,
                email,
                password: hashedPassword,
                is_admin: is_admin ?? false
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
            });

        return createdUser;

    },

    loginUser: async (data: LoginDTO) => {
        const { email, password } = data;
        const result = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
        const user = result[0];
        if (!user) {
            throw new NotFoundError('email or password is incorrect');
        }
        const passwordValid = await verify(user.password, password);
        if (!passwordValid) {
            throw new UnauthorizedError('email or password is incorrect');
        }
        const token = jwt.sign(
            { id: user.id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        return {
            id: user.id,
            email: user.email,
            token
        };

    }
}