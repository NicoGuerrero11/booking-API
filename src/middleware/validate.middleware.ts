import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';


export const validateBody = (schema: z.ZodType) =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const { fieldErrors, formErrors } = result.error.flatten();

            return res.status(400).json({
                message: 'Validation error',
                errors: {
                    ...fieldErrors,
                    _form: formErrors,
                },
            });
        }

        req.body = result.data;
        next();
    };
