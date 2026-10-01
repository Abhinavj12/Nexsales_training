const StudentService = require("../services/student-service");
const { validateUuid, validateStudent } = require("../../../utils/validation");
class StudentController {
    constructor() {
        this.service = new StudentService();
    }
    async getStudents(req, res, next) {
        try {
            if (req.query.departmentId) validateUuid(req.query.departmentId, "departmentId");
            return res.json(await this.service.list(req.query));
        } catch (error) {
            return next(error);
        }
    }
    async getStudent(req, res, next) {
        try {
            validateUuid(req.params.studentId, "studentId");
            return res.json(await this.service.get(req.params.studentId));
        } catch (error) {
            return next(error);
        }
    }
    async createStudent(req, res, next) {
        try {
            validateStudent(req.body);
            return res.status(201).json(await this.service.create(req.body));
        } catch (error) {
            return next(error);
        }
    }
    async updateStudent(req, res, next) {
        try {
            validateUuid(req.params.studentId, "studentId");
            validateStudent(req.body, true);
            return res.json(await this.service.update(req.params.studentId, req.body));
        } catch (error) {
            return next(error);
        }
    }
    async deleteStudent(req, res, next) {
        try {
            validateUuid(req.params.studentId, "studentId");
            await this.service.delete(req.params.studentId);
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    }
    async restoreStudent(req, res, next) {
        try {
            validateUuid(req.params.studentId, "studentId");
            return res.json(await this.service.restore(req.params.studentId));
        } catch (error) {
            return next(error);
        }
    }
}
module.exports = StudentController;
