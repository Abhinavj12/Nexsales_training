const { AppError } = require("../lib/errors");
module.exports = (error, req, res, next) => {
    void next;
    let status = error.statusCode || 500;
    let code = error.code || "INTERNAL_SERVER_ERROR";
    let message = error.message || "Unexpected error.";
    let details = error.details || [];

    if (error.name === "SequelizeValidationError") {
        status = 400;
        code = "VALIDATION_ERROR";
        message = "Validation failed.";
        details = error.errors.map((item) => ({ field: item.path, message: item.message }));
    } else if (error.name === "SequelizeUniqueConstraintError") {
        status = 409;
        code = "DUPLICATE_VALUE";
        message = "A unique value already exists.";
    } else if (error instanceof SyntaxError && error.status === 400) {
        status = 400;
        code = "INVALID_JSON";
        message = "Invalid JSON body.";
    } else if (!(error instanceof AppError)) {
        console.error(error);
        message = "Unexpected server error.";
    }
    return res.status(status).json({ error: { code, message, details } });
};
