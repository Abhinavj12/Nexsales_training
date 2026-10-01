const { Op } = require("sequelize");
const { Department, Student } = require("@training/training-management-data-model-simple");
const { NotFoundError, ConflictError } = require("../../../lib/errors");
const { pagination } = require("../../../utils/validation");
class DepartmentService {
    async list(query) {
        const { page, pageSize, limit, offset } = pagination(query);
        const where = {};
        if (query.name) {
            where.name = { [Op.iLike]: `%${query.name}%` };
        }
        if (query.code) {
            where.code = { [Op.iLike]: `%${query.code}%` };
        }
        const { rows, count } = await Department.findAndCountAll({
            where,
            limit,
            offset,
            order: [["updatedAt", "DESC"]]
        });
        return {
            rows,
            count,
            pagination: { page, pageSize, totalPages: Math.ceil(count / pageSize) }
        };
    }
    async get(id) {
        const row = await Department.findByPk(id);
        if (!row) throw new NotFoundError("Department not found.");
        return row;
    }
    async students(id, query) {
        await this.get(id);
        const { page, pageSize, limit, offset } = pagination(query);
        const { rows, count } = await Student.findAndCountAll({
            where: { departmentId: id },
            limit,
            offset
        });
        return {
            rows,
            count,
            pagination: { page, pageSize, totalPages: Math.ceil(count / pageSize) }
        };
    }
    async create(body) {
        if (await Department.findOne({ where: { code: body.code.trim().toUpperCase() } }))
            throw new ConflictError("Department code already exists.");
        return Department.create(body);
    }
    async update(id, body) {
        const row = await this.get(id);
        await row.update(body);
        return row;
    }
    async delete(id) {
        const row = await this.get(id);
        if (await Student.count({ where: { departmentId: id } }))
            throw new ConflictError("Delete or move active students first.");
        await row.destroy();
    }
    async restore(id) {
        const row = await Department.findByPk(id, { paranoid: false });
        if (!row) throw new NotFoundError("Department not found.");
        if (!row.deletedAt) throw new ConflictError("Department is not deleted.");
        await row.restore();
        return row;
    }
}
module.exports = DepartmentService;
