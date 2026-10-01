export const errorHandler = (
    error,
    req,
    res,
    next
) => {
    console.error(error);

    if (res.headersSent) {
        return next(error);
    }

    if (error.code === "23505") {
        return res.status(409).json({
            success: false,
            message:
                "A record with the same unique value already exists"
        });
    }

    if (error.code === "22P02") {
        return res.status(400).json({
            success: false,
            message:
                "Invalid value supplied for a database column"
        });
    }

    if (error.code === "23502") {
        return res.status(400).json({
            success: false,
            message:
                "A required database value is missing"
        });
    }

    const statusCode =
        error.statusCode ?? 500;

    return res
        .status(statusCode)
        .json({
            success: false,

            message:
                statusCode === 500
                    ? "Internal server error"
                    : error.message
        });
};

// PostgreSQL error codes handled here:

// 23505 → unique constraint violation
// 23502 → not-null constraint violation
// 22P02 → invalid text representation