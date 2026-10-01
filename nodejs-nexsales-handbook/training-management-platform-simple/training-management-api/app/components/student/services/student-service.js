const { Op } = require("sequelize");
const { Student, Department } = require("@training/training-management-data-model-simple");
const { NotFoundError, ConflictError } = require("../../../lib/errors");
const { pagination } = require("../../../utils/validation");

class StudentService {
    async department(id) {
        const row = await Department.findByPk(id);
        if (!row) throw new NotFoundError("Department not found.");
        return row;
    }
    async list(query) {
        const { page, pageSize, limit, offset } = pagination(query);
        const where = {};
        if (query.email) where.email = { [Op.iLike]: `%${query.email}%` };
        if (query.departmentId) where.departmentId = query.departmentId;
        const { rows, count } = await Student.findAndCountAll({
            where,
            include: [{ model: Department, as: "department" }],
            limit,
            offset,
            order: [["updatedAt", "DESC"]],
            distinct: true
        });
        return {
            rows,
            count,
            pagination: { page, pageSize, totalPages: Math.ceil(count / pageSize) }
        };
    }
    async get(id) {
        const row = await Student.findByPk(id, {
            include: [{ model: Department, as: "department" }]
        });
        if (!row) throw new NotFoundError("Student not found.");
        return row;
    }
    async create(body) {
        await this.department(body.departmentId);
        if (await Student.findOne({ where: { email: body.email.trim().toLowerCase() } }))
            throw new ConflictError("Email already exists.");
        return Student.create(body);
    }
    async update(id, body) {
        const row = await this.get(id);
        if (body.departmentId) await this.department(body.departmentId);
        await row.update(body);
        return this.get(id);
    }
    async delete(id) {
        const row = await this.get(id);
        await row.destroy();
    }
    async restore(id) {
        const row = await Student.findByPk(id, { paranoid: false });
        if (!row) throw new NotFoundError("Student not found.");
        if (!row.deletedAt) throw new ConflictError("Student is not deleted.");
        await this.department(row.departmentId);
        await row.restore();
        return this.get(id);
    }
}
module.exports = StudentService;
