import {
    Student,
    StudentProfile
} from "../models/index.js";

import parseStudentId from "../utils/parse-student-id.js";

const sendSequelizeError = (
    error,
    res
) => {
    if (
        error.name ===
        "SequelizeValidationError"
    ) {
        return res.status(400).json({
            success: false,

            errors: error.errors.map(
                validationError =>
                    validationError.message
            )
        });
    }

    if (
        error.name ===
        "SequelizeUniqueConstraintError"
    ) {
        return res.status(409).json({
            success: false,
            message:
                "A record with the given unique value already exists"
        });
    }

    console.error(error);

    return res.status(500).json({
        success: false,
        message:
            "An unexpected error occurred"
    });
};

export const createStudent = async (
    req,
    res
) => {
    try {
        const student =
            await Student.create({
                firstName:
                    req.body.firstName,

                lastName:
                    req.body.lastName,

                email:
                    req.body.email,

                age:
                    req.body.age
            });

        return res.status(201).json({
            success: true,
            data: student
        });
    } catch (error) {
        return sendSequelizeError(
            error,
            res
        );
    }
};

export const createStudentProfile = async (
    req,
    res
) => {
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

        const existingProfile =
            await StudentProfile.findOne({
                where: {
                    studentId
                }
            });

        if (existingProfile) {
            return res.status(409).json({
                success: false,
                message:
                    "Student already has a profile"
            });
        }

        const profile =
            await StudentProfile.create({
                phone:
                    req.body.phone,

                address:
                    req.body.address,

                dateOfBirth:
                    req.body.dateOfBirth,

                studentId
            });

        return res.status(201).json({
            success: true,
            data: profile
        });
    } catch (error) {
        return sendSequelizeError(
            error,
            res
        );
    }
};

export const getAllStudents = async (
    req,
    res
) => {
    try {
        const students =
            await Student.findAll({
                include: {
                    model:
                        StudentProfile,

                    as: "profile"
                },

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
        return sendSequelizeError(
            error,
            res
        );
    }
};

export const getStudentById = async (
    req,
    res
) => {
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
                studentId,
                {
                    include: {
                        model:
                            StudentProfile,

                        as: "profile"
                    }
                }
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
        return sendSequelizeError(
            error,
            res
        );
    }
};

export const updateStudent = async (
    req,
    res
) => {
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

        await student.update({
            firstName:
                req.body.firstName ??
                student.firstName,

            lastName:
                req.body.lastName ??
                student.lastName,

            email:
                req.body.email ??
                student.email,

            age:
                req.body.age ??
                student.age
        });

        return res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        return sendSequelizeError(
            error,
            res
        );
    }
};

export const updateStudentProfile = async (
    req,
    res
) => {
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

        const profile =
            await StudentProfile.findOne({
                where: {
                    studentId
                }
            });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message:
                    "Student profile not found"
            });
        }

        await profile.update({
            phone:
                req.body.phone ??
                profile.phone,

            address:
                req.body.address ??
                profile.address,

            dateOfBirth:
                req.body.dateOfBirth ??
                profile.dateOfBirth
        });

        return res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        return sendSequelizeError(
            error,
            res
        );
    }
};

export const deleteStudent = async (
    req,
    res
) => {
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

        return res.status(200).json({
            success: true,
            message:
                "Student and associated profile deleted successfully"
        });
    } catch (error) {
        return sendSequelizeError(
            error,
            res
        );
    }
};

export const deleteStudentProfile = async (
    req,
    res
) => {
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

        const profile =
            await StudentProfile.findOne({
                where: {
                    studentId
                }
            });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message:
                    "Student profile not found"
            });
        }

        await profile.destroy();

        return res.status(200).json({
            success: true,
            message:
                "Student profile deleted successfully"
        });
    } catch (error) {
        return sendSequelizeError(
            error,
            res
        );
    }
};
