import departmentRepository from "../repositories/department.repository.js";

class DepartmentService {

    async createDepartment(data) {

        const existingDepartment =
            await departmentRepository.findByName(data.name);

        if (existingDepartment) {
            const error = new Error(
                "Department with this name already exists"
            );

            error.statusCode = 409;

            throw error;
        }

        return await departmentRepository.create(data);
    }

    async getAllDepartments() {
        return await departmentRepository.findAll();
    }

    async getDepartmentById(id) {

        const department =
            await departmentRepository.findById(id);

        if (!department) {
            const error = new Error(
                "Department not found"
            );

            error.statusCode = 404;

            throw error;
        }

        return department;
    }

    async updateDepartment(id, data) {

        await this.getDepartmentById(id);

        if (data.name) {

            const existingDepartment =
                await departmentRepository.findByName(data.name);

            if (
                existingDepartment &&
                existingDepartment.id !== Number(id)
            ) {
                const error = new Error(
                    "Department with this name already exists"
                );

                error.statusCode = 409;

                throw error;
            }
        }

        await departmentRepository.update(id, data);

        return await departmentRepository.findById(id);
    }

    async deleteDepartment(id) {

        await this.getDepartmentById(id);

        await departmentRepository.delete(id);
    }
}

export default new DepartmentService();