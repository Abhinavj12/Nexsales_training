import Student from "../models/student.model.js";
import Department from "../models/department.model.js";

class StudentRepository {

    async create(data) {
        return await Student.create(data);
    }

    async findAll() {
    return await Student.findAll({
        include: [
            {
                model: Department,
                as: "department",
                attributes: ["id", "name"]
            }
        ],
        order: [["id", "ASC"]]
    });
}

    async findById(id) {
    return await Student.findByPk(id, {
        include: [
            {
                model: Department,
                as: "department",
                attributes: ["id", "name"]
            }
        ]
    });
}

    async findByEmail(email) {
        return await Student.findOne({
            where: {
                email
            }
        });
    }

    async update(id, data) {
        const [updatedRows] = await Student.update(
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
        return await Student.destroy({
            where: {
                id
            }
        });
    }
}

export default new StudentRepository();