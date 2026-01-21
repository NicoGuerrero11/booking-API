export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Indica que es un error esperado
        Error.captureStackTrace(this, this.constructor);
    }
}

// Error 400 - Bad Request
export class BadRequestError extends AppError {
    constructor(message: string = 'Bad Request') {
        super(message, 400);
    }
}

// Error 401 - Unauthorized
export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
    }
}
// Error 403 - Forbidden
export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
    }
}

// Error 404 - Not Found
export class NotFoundError extends AppError {
    constructor(message: string = 'Not Found') {
        super(message, 404);
    }
}
// Error 409 - Conflict
export class ConflictError extends AppError {
    constructor(message: string = 'Conflict') {
        super(message, 409);
    }
}

// Error 422 - Unprocessable Entity
export class UnprocessableEntityError extends AppError {
    constructor(message: string = 'Validation Failed') {
        super(message, 422);
    }
}
