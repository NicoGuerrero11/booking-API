import { Request, Response } from "express";
import { authServices } from "./auth.services";
import { AppError } from "../../utils/errors";
import { RegisterDTO } from "./schemas/RegisterSchema";
import { LoginDTO } from "./schemas/LoginSchema";


export const register = async (req: Request, res: Response) => {
    try {
        const data: RegisterDTO = req.body;
        const user = await authServices.registerUser(data);
        return res.status(201).json({
            message: 'User registered successfully',
            user: user
        });

    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const data = req.body as LoginDTO;
        const result = await authServices.loginUser(data);
        return res.status(200).json({
            message: 'Login successful',
            token: result.token,
            user: {
                id: result.id,
                email: result.email
            }
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
}
