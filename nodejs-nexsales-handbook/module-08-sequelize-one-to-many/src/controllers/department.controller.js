import {
    ForeignKeyConstraintError,
    UniqueConstraintError,
    ValidationError
} from "sequelize";
import { Department, Student } from "../models/index.js";
import parseId from "../utils/parseId.js";

const sendSequelizeError = (response, error) => {
    if (error instanceof UniqueConstraintError) {
        return response.status(409).json({ message: "Department name already exists." });
    }

    if (error instanceof ValidationError) {
        return response.status(400).json({
            message: "Department validation failed.",
            errors: error.errors.map((item) => item.message)
        });
    }

    if (error instanceof ForeignKeyConstraintError) {
        return response.status(409).json({ message: "Department is still referenced by students." });
    }

    console.error(error);
    return response.status(500).json({ message: "Unexpected server error." });
};

const getRequestId = (request, response) => {
    const id = parseId(request.params.id);

    if (id === null) {
        response.status(400).json({ message: "Department id must be a positive integer." });
    }

    return id;
};

export const createDepartment = async (request, response) => {
    try {
        const body = request.body ?? {};
        const department = await Department.create({
            name: body.name,
            description: body.description
        });

        return response.status(201).json(department);
    } catch (error) {
        return sendSequelizeError(response, error);
    }
};

export const getAllDepartments = async (request, response) => {
    try {
        // include performs the association join; hasMany produces a students array.
        const departments = await Department.findAll({
            include: [{ model: Student, as: "students" }],
            order: [["id", "ASC"]]
        });

        return response.status(200).json(departments);
    } catch (error) {
        return sendSequelizeError(response, error);
    }
};

export const getDepartmentById = async (request, response) => {
    const id = getRequestId(request, response);

    if (id === null) {
        return;
    }

    try {
        const department = await Department.findByPk(id, {
            include: [{ model: Student, as: "students" }]
        });

        if (!department) {
            return response.status(404).json({ message: "Department not found." });
        }

        return response.status(200).json(department);
    } catch (error) {
        return sendSequelizeError(response, error);
    }
};

export const updateDepartment = async (request, response) => {
    const id = getRequestId(request, response);

    if (id === null) {
        return;
    }

    try {
        const department = await Department.findByPk(id);

        if (!department) {
            return response.status(404).json({ message: "Department not found." });
        }

        const allowedFields = ["name", "description"];
        const updates = {};
        const body = request.body ?? {};

        for (const field of allowedFields) {
            if (Object.hasOwn(body, field)) {
                updates[field] = body[field];
            }
        }

        await department.update(updates);

        return response.status(200).json(department);
    } catch (error) {
        return sendSequelizeError(response, error);
    }
};

export const deleteDepartment = async (request, response) => {
    const id = getRequestId(request, response);

    if (id === null) {
        return;
    }

    try {
        const department = await Department.findByPk(id);

        if (!department) {
            return response.status(404).json({ message: "Department not found." });
        }

        const studentCount = await Student.count({ where: { departmentId: id } });

        if (studentCount > 0) {
            return response.status(409).json({
                message: "Cannot delete a department that has students."
            });
        }

        await department.destroy();

        return response.status(204).send();
    } catch (error) {
        return sendSequelizeError(response, error);
    }
};
