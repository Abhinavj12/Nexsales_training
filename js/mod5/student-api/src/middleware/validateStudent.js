export const validateStudent = (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        age,
        course
    } = req.body;

    if (!firstName || typeof firstName !== "string") {
        return res.status(400).json({
            success: false,
            message: "firstName is required and must be a string"
        });
    }

    if (!lastName || typeof lastName !== "string") {
        return res.status(400).json({
            success: false,
            message: "lastName is required and must be a string"
        });
    }

    if (!email || typeof email !== "string") {
        return res.status(400).json({
            success: false,
            message: "email is required and must be a string"
        });
    }

    if (typeof age !== "number" || age <= 0) {
        return res.status(400).json({
            success: false,
            message: "age must be a positive number"
        });
    }

    if (!course || typeof course !== "string") {
        return res.status(400).json({
            success: false,
            message: "course is required and must be a string"
        });
    }

    next();
};