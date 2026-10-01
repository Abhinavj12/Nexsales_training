const validate = (schema) => {
    return (req, res, next) => {

        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const validationError = new Error(
                "Validation failed"
            );

            validationError.statusCode = 400;

            validationError.details = error.details.map((detail) => ({
                field: detail.path.join("."),
                message: detail.message
            }));

            return next(validationError);
        }

        req.body = value;

        next();
    };
};

export default validate;