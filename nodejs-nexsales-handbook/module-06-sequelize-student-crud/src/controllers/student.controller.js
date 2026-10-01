import Student from "../models/student.model.js";

const parseStudentId = id => {
    const studentId = Number(id);

    if (
        !Number.isInteger(studentId)
        || studentId <= 0
    ) {
        return null;
    }

    return studentId;
};

const handleSequelizeError = (
    error,
    res
) => {
    if (
        error.name
        === "SequelizeUniqueConstraintError"
    ) {
        return res.status(409).json({
            success: false,
            message:
                "A student with this email already exists"
        });
    }

    if (
        error.name
        === "SequelizeValidationError"
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Student validation failed",

            errors: error.errors.map(
                item => ({
                    field: item.path,
                    message: item.message
                })
            )
        });
    }

    console.error(error);

    return res.status(500).json({
        success: false,
        message:
            "An unexpected error occurred"
    });
};

export const getAllStudents =
    async (req, res) => {
        try {
            const students =
                await Student.findAll({
                    order: [
                        ["id", "ASC"]
                    ]
                });

            return res.status(200).json({
                success: true,
                count: students.length,
                data: students
            });
        } catch (error) {
            return handleSequelizeError(
                error,
                res
            );
        }
    };

export const getStudentById =
    async (req, res) => {
        try {
            const studentId =
                parseStudentId(
                    req.params.id
                );

            if (!studentId) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Student ID must be a positive integer"
                });
            }

            const student =
                await Student.findByPk(
                    studentId
                );

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Student not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: student
            });
        } catch (error) {
            return handleSequelizeError(
                error,
                res
            );
        }
    };

export const createStudent =
    async (req, res) => {
        try {
            const {
                firstName,
                lastName,
                email,
                age
            } = req.body;

            const student =
                await Student.create({
                    firstName,
                    lastName,
                    email,
                    age
                });

            return res.status(201).json({
                success: true,
                message:
                    "Student created successfully",
                data: student
            });
        } catch (error) {
            return handleSequelizeError(
                error,
                res
            );
        }
    };

export const updateStudent =
    async (req, res) => {
        try {
            const studentId =
                parseStudentId(
                    req.params.id
                );

            if (!studentId) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Student ID must be a positive integer"
                });
            }

            const student =
                await Student.findByPk(
                    studentId
                );

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Student not found"
                });
            }

            const allowedFields = [
                "firstName",
                "lastName",
                "email",
                "age"
            ];

            const updatedValues = {};

            for (
                const field
                of allowedFields
            ) {
                if (
                    req.body[field]
                    !== undefined
                ) {
                    updatedValues[field] =
                        req.body[field];
                }
            }

            if (
                Object.keys(
                    updatedValues
                ).length === 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Provide at least one field to update"
                });
            }

            await student.update(
                updatedValues
            );

            return res.status(200).json({
                success: true,
                message:
                    "Student updated successfully",
                data: student
            });
        } catch (error) {
            return handleSequelizeError(
                error,
                res
            );
        }
    };

export const deleteStudent =
    async (req, res) => {
        try {
            const studentId =
                parseStudentId(
                    req.params.id
                );

            if (!studentId) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Student ID must be a positive integer"
                });
            }

            const student =
                await Student.findByPk(
                    studentId
                );

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Student not found"
                });
            }

            await student.destroy();

            return res.status(204).send();
        } catch (error) {
            return handleSequelizeError(
                error,
                res
            );
        }
    };
