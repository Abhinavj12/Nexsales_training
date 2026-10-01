const { BadRequestError } = require("../lib/errors");
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const validateUuid = (value, field) => {
    if (!uuidPattern.test(value)) throw new BadRequestError(`${field} must be a valid UUID.`);
};
const required = (body, fields) => {
    const missing = fields.filter((field) => body[field] === undefined || body[field] === "");
    if (missing.length) throw new BadRequestError("Required fields are missing.", missing);
};
const validateDepartment = (body, update = false) => {
    if (!update) required(body, ["name", "code"]);
    if (update && body.name === undefined && body.code === undefined)
        throw new BadRequestError("Provide name or code.");
};
const validateStudent = (body, update = false) => {
    if (!update) required(body, ["firstName", "lastName", "email", "departmentId"]);
    if (body.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
        throw new BadRequestError("Email is invalid.");
    if (body.departmentId !== undefined) validateUuid(body.departmentId, "departmentId");
    if (body.age !== undefined && (!Number.isInteger(body.age) || body.age < 16 || body.age > 100))
        throw new BadRequestError("Age must be between 16 and 100.");
};
const pagination = (query) => {
    const page = Number(query.page || 1);
    const pageSize = Number(query.pageSize || 20);
    if (
        !Number.isInteger(page) ||
        page < 1 ||
        !Number.isInteger(pageSize) ||
        pageSize < 1 ||
        pageSize > 100
    )
        throw new BadRequestError("Invalid pagination.");
    return { page, pageSize, limit: pageSize, offset: (page - 1) * pageSize };
};
module.exports = { validateUuid, validateDepartment, validateStudent, pagination };
