class AppError extends Error {
    constructor(statusCode, code, message, details = []) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}
class BadRequestError extends AppError {
    constructor(message = "Invalid request.", details = []) {
        super(400, "INVALID_REQUEST", message, details);
    }
}
class NotFoundError extends AppError {
    constructor(message = "Resource not found.") {
        super(404, "NOT_FOUND", message);
    }
}
class ConflictError extends AppError {
    constructor(message) {
        super(409, "CONFLICT", message);
    }
}
module.exports = { AppError, BadRequestError, NotFoundError, ConflictError };
