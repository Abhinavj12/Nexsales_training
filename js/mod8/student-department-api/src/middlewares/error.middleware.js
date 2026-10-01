const errorMiddleware = (err, req, res, next) => {

    console.error(err);

    const statusCode = err.statusCode || 500;

    const response = {
        success: false,
        message: err.message || "Internal server error"
    };

    if (err.details) {
        response.details = err.details;
    }

    return res.status(statusCode).json(response);
};

export default errorMiddleware;