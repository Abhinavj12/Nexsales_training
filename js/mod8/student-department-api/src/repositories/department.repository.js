import Department from "../models/department.model.js";

class DepartmentRepository {

    async create(data) {
        return await Department.create(data);
    }

    async findAll() {
        return await Department.findAll({
            order: [["id", "ASC"]]
        });
    }

    async findById(id) {
        return await Department.findByPk(id);
    }

    async findByName(name) {
        return await Department.findOne({
            where: {
                name
            }
        });
    }

    async update(id, data) {
        const [updatedRows] = await Department.update(
            data,
            {
                where: {
                    id
                }
            }
        );

        return updatedRows;
    }

    async delete(id) {
        return await Department.destroy({
            where: {
                id
            }
        });
    }
}

export default new DepartmentRepository();