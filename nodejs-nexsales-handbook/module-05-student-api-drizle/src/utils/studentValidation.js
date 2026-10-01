export const parseStudentId = idValue => {
    const id = Number(idValue);

    if (!Number.isInteger(id) || id <= 0) {
        const error = new Error(
            "Student ID must be a positive integer"
        );

        error.statusCode = 400;

        throw error;
    }

    return id;
};

export const validateStudentData = data => {
    if (
        !data.firstName ||
        !data.lastName ||
        !data.email ||
        data.age === undefined
    ) {
        const error = new Error(
            "firstName, lastName, email and age are required"
        );

        error.statusCode = 400;

        throw error;
    }
};

export const validateUpdateData = data => {
    if (Object.keys(data).length === 0) {
        const error = new Error(
            "At least one field must be provided"
        );

        error.statusCode = 400;

        throw error;
    }
};