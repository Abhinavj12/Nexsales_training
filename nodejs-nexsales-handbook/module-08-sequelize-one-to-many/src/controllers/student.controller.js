import {
    ForeignKeyConstraintError,
    UniqueConstraintError,
    ValidationError
} from "sequelize";
import { Department, Student } from "../models/index.js";
import parseId from "../utils/parseId.js";

const sendSequelizeError = (response, error) => {
    if (error instanceof UniqueConstraintError) {
        return response.status(409).json({ message: "Student email already exists." });
    }

    if (error instanceof ValidationError) {
        return response.status(400).json({
            message: "Student validation failed.",
            errors: error.errors.map((item) => item.message)
        });
    }

    if (error instanceof ForeignKeyConstraintError) {
        return response.status(400).json({ message: "Department does not exist." });
    }

    console.error(error);
    return response.status(500).json({ message: "Unexpected server error." });
};

const getRequestId = (request, response) => {
    const id = parseId(request.params.id);

    if (id === null) {
        response.status(400).json({ message: "Student id must be a positive integer." });
    }

    return id;
};

const departmentExists = async (departmentId) => {
    const parsedDepartmentId = parseId(departmentId);

    if (parsedDepartmentId === null) {
        return null;
    }

    return Department.findByPk(parsedDepartmentId);
};

const findStudentWithDepartment = async (id) => {
    // include loads the single department linked by the student's foreign key.
    return Student.findByPk(id, {
        include: [{ model: Department, as: "department" }]
    });
};

export const createStudent = async (request, response) => {
    try {
        const body = request.body ?? {};
        const department = await departmentExists(body.departmentId);

        if (!department) {
            return response.status(400).json({ message: "A valid departmentId is required." });
        }

        const student = await Student.create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            age: body.age,
            departmentId: department.id
        });
        const createdStudent = await findStudentWithDepartment(student.id);

        return response.status(201).json(createdStudent);
    } catch (error) {
        return sendSequelizeError(response, error);
    }
};

export const getAllStudents = async (request, response) => {
    try {
        const students = await Student.findAll({
            include: [{ model: Department, as: "department" }],
            order: [["id", "ASC"]]
        });

        return response.status(200).json(students);
    } catch (error) {
        return sendSequelizeError(response, error);
    }
};

export const getStudentById = async (request, response) => {
    const id = getRequestId(request, response);

    if (id === null) {
        return;
    }

    try {
        const student = await findStudentWithDepartment(id);

        if (!student) {
            return response.status(404).json({ message: "Student not found." });
        }

        return response.status(200).json(student);
    } catch (error) {
        return sendSequelizeError(response, error);
    }
};

export const updateStudent = async (request, response) => {
    const id = getRequestId(request, response);

    if (id === null) {
        return;
    }

    try {
        const student = await Student.findByPk(id);

        if (!student) {
            return response.status(404).json({ message: "Student not found." });
        }

        const allowedFields = ["firstName", "lastName", "email", "age", "departmentId"];
        const updates = {};
        const body = request.body ?? {};

        for (const field of allowedFields) {
            if (Object.hasOwn(body, field)) {
                updates[field] = body[field];
            }
        }

        if (Object.hasOwn(updates, "departmentId")) {
            const department = await departmentExists(updates.departmentId);

            if (!department) {
                return response.status(400).json({ message: "A valid departmentId is required." });
            }

            updates.departmentId = department.id;
        }

        await student.update(updates);

        return response.status(200).json(await findStudentWithDepartment(student.id));
    } catch (error) {
        return sendSequelizeError(response, error);
    }
};

export const deleteStudent = async (request, response) => {
    const id = getRequestId(request, response);

    if (id === null) {
        return;
    }

    try {
        const student = await Student.findByPk(id);

        if (!student) {
            return response.status(404).json({ message: "Student not found." });
        }

        await student.destroy();

        return response.status(204).send();
    } catch (error) {
        return sendSequelizeError(response, error);
    }
};
