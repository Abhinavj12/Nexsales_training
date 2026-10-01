import studentService from "../services/student.service.js";

class StudentController {

    async create(req, res, next) {

        try {

            const student =
                await studentService.createStudent(req.body);

            return res.status(201).json({
                success: true,
                message: "Student created successfully",
                data: student
            });

        } catch (error) {

            next(error);
        }
    }

    async getAll(req, res, next) {

        try {

            const students =
                await studentService.getAllStudents();

            return res.status(200).json({
                success: true,
                data: students
            });

        } catch (error) {

            next(error);
        }
    }

    async getById(req, res, next) {

        try {

            const student =
                await studentService.getStudentById(
                    Number(req.params.id)
                );

            return res.status(200).json({
                success: true,
                data: student
            });

        } catch (error) {

            next(error);
        }
    }

    async update(req, res, next) {

        try {

            const student =
                await studentService.updateStudent(
                    Number(req.params.id),
                    req.body
                );

            return res.status(200).json({
                success: true,
                message: "Student updated successfully",
                data: student
            });

        } catch (error) {

            next(error);
        }
    }

    async delete(req, res, next) {

        try {

            await studentService.deleteStudent(
                Number(req.params.id)
            );

            return res.status(200).json({
                success: true,
                message: "Student deleted successfully"
            });

        } catch (error) {

            next(error);
        }
    }
}

export default new StudentController();