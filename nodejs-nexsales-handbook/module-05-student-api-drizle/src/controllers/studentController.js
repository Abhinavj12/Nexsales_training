import * as studentRepository
    from "../repositories/studentRepository.js";

import {
    parseStudentId,
    validateStudentData,
    validateUpdateData
} from "../utils/studentValidation.js";

export const getAllStudents = async (
    req,
    res
) => {
    const studentList =
        await studentRepository.findAll();

    return res.status(200).json({
        success: true,
        count: studentList.length,
        data: studentList
    });
};

export const getStudentById = async (
    req,
    res
) => {
    const id = parseStudentId(
        req.params.id
    );

    const student =
        await studentRepository.findById(id);

    if (!student) {
        const error = new Error(
            `Student with ID ${id} was not found`
        );

        error.statusCode = 404;

        throw error;
    }

    return res.status(200).json({
        success: true,
        data: student
    });
};

// export const createStudent = async (
//     req,
//     res
// ) => {
//     validateStudentData(req.body);

//     const existingStudent =
//         await studentRepository.findByEmail(
//             req.body.email
//                 .trim()
//                 .toLowerCase()
//         );

//     if (existingStudent) {
//         const error = new Error(
//             "A student with this email already exists"
//         );

//         error.statusCode = 409;

//         throw error;
//     }

//     const createdStudent =
//         await studentRepository.create(
//             req.body
//         );

//     return res.status(201).json({
//         success: true,
//         message:
//             "Student created successfully",
//         data: createdStudent
//     });
// };

export const createStudent = async (req,res) => {
    const student = await Student.create(req.body);

    return res.status(201).json({
        success: true,
        data: student
    });
};

export const updateStudent = async (
    req,
    res
) => {
    const id = parseStudentId(
        req.params.id
    );

    validateUpdateData(req.body);

    const existingStudent =
        await studentRepository.findById(id);

    if (!existingStudent) {
        const error = new Error(
            `Student with ID ${id} was not found`
        );

        error.statusCode = 404;

        throw error;
    }

    if (req.body.email !== undefined) {
        const normalizedEmail =
            req.body.email
                .trim()
                .toLowerCase();

        const studentWithEmail =
            await studentRepository.findByEmail(
                normalizedEmail
            );

        if (
            studentWithEmail &&
            studentWithEmail.id !== id
        ) {
            const error = new Error(
                "Another student already uses this email"
            );

            error.statusCode = 409;

            throw error;
        }
    }

    const updatedStudent =
        await studentRepository.updateById(
            id,
            req.body
        );

    return res.status(200).json({
        success: true,
        message:
            "Student updated successfully",
        data: updatedStudent
    });
};

export const deleteStudent = async (
    req,
    res
) => {
    const id = parseStudentId(
        req.params.id
    );

    const deletedStudent =
        await studentRepository.deleteById(id);

    if (!deletedStudent) {
        const error = new Error(
            `Student with ID ${id} was not found`
        );

        error.statusCode = 404;

        throw error;
    }

    return res.status(200).json({
        success: true,
        message:
            "Student deleted successfully",
        data: deletedStudent
    });
};