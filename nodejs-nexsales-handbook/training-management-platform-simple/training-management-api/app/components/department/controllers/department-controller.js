const DepartmentService = require("../services/department-service");
const { validateUuid, validateDepartment } = require("../../../utils/validation");
class DepartmentController {
    constructor() {
        this.service = new DepartmentService();
    }
    async getDepartments(req, res, next) {
        try {
            return res.json(await this.service.list(req.query));
        } catch (error) {
            return next(error);
        }
    }
    async getDepartment(req, res, next) {
        try {
            validateUuid(req.params.departmentId, "departmentId");
            return res.json(await this.service.get(req.params.departmentId));
        } catch (error) {
            return next(error);
        }
    }
    async getStudents(req, res, next) {
        try {
            validateUuid(req.params.departmentId, "departmentId");
            return res.json(await this.service.students(req.params.departmentId, req.query));
        } catch (error) {
            return next(error);
        }
    }
    async createDepartment(req, res, next) {
        try {
            validateDepartment(req.body);
            return res.status(201).json(await this.service.create(req.body));
        } catch (error) {
            return next(error);
        }
    }
    async updateDepartment(req, res, next) {
        try {
            validateUuid(req.params.departmentId, "departmentId");
            validateDepartment(req.body, true);
            return res.json(await this.service.update(req.params.departmentId, req.body));
        } catch (error) {
            return next(error);
        }
    }
    async deleteDepartment(req, res, next) {
        try {
            validateUuid(req.params.departmentId, "departmentId");
            await this.service.delete(req.params.departmentId);
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    }
    async restoreDepartment(req, res, next) {
        try {
            validateUuid(req.params.departmentId, "departmentId");
            return res.json(await this.service.restore(req.params.departmentId));
        } catch (error) {
            return next(error);
        }
    }
}
module.exports = DepartmentController;
