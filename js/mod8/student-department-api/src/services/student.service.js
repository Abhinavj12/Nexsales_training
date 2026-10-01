import studentRepository from "../repositories/student.repository.js";
import departmentRepository from "../repositories/department.repository.js";

class StudentService {

    async createStudent(data) {

        const existingStudent =
            await studentRepository.findByEmail(data.email);

        if (existingStudent) {
            const error = new Error(
                "Student with this email already exists"
            );

            error.statusCode = 409;

            throw error;
        }

        const department =
            await departmentRepository.findById(data.departmentId);

        if (!department) {
            const error = new Error(
                "Department not found"
            );

            error.statusCode = 404;

            throw error;
        }

        return await studentRepository.create(data);
    }

    async getAllStudents() {
        return await studentRepository.findAll();
    }

    async getStudentById(id) {

        const student =
            await studentRepository.findById(id);

        if (!student) {
            const error = new Error(
                "Student not found"
            );

            error.statusCode = 404;

            throw error;
        }

        return student;
    }

    async updateStudent(id, data) {

        await this.getStudentById(id);

        if (data.email) {

            const existingStudent =
                await studentRepository.findByEmail(data.email);

            if (
                existingStudent &&
                existingStudent.id !== Number(id)
            ) {
                const error = new Error(
                    "Student with this email already exists"
                );

                error.statusCode = 409;

                throw error;
            }
        }

        if (data.departmentId) {

            const department =
                await departmentRepository.findById(
                    data.departmentId
                );

            if (!department) {
                const error = new Error(
                    "Department not found"
                );

                error.statusCode = 404;

                throw error;
            }
        }

        await studentRepository.update(id, data);

        return await studentRepository.findById(id);
    }

    async deleteStudent(id) {

        await this.getStudentById(id);

        await studentRepository.delete(id);
    }
}

export default new StudentService();