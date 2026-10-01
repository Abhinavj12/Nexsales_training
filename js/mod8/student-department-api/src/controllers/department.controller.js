import departmentService from "../services/department.service.js";

class DepartmentController {

    async create(req, res, next) {
        try {
            const department =
                await departmentService.createDepartment(req.body);

            return res.status(201).json({
                success: true,
                message: "Department created successfully",
                data: department
            });

        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const departments =
                await departmentService.getAllDepartments();

            return res.status(200).json({
                success: true,
                data: departments
            });

        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const department =
                await departmentService.getDepartmentById(
                    Number(req.params.id)
                );

            return res.status(200).json({
                success: true,
                data: department
            });

        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const department =
                await departmentService.updateDepartment(
                    Number(req.params.id),
                    req.body
                );

            return res.status(200).json({
                success: true,
                message: "Department updated successfully",
                data: department
            });

        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await departmentService.deleteDepartment(
                Number(req.params.id)
            );

            return res.status(200).json({
                success: true,
                message: "Department deleted successfully"
            });

        } catch (error) {
            next(error);
        }
    }
}

export default new DepartmentController();