export const notFoundHandler = (
    req,
    res,
    next
) => {
    const error = new Error(
        `Route ${req.method} ${req.originalUrl} was not found`
    );

    error.statusCode = 404;

    next(error);
};