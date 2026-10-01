import Department from "./department.model.js";
import Student from "./student.model.js";

Department.hasMany(Student, {
    foreignKey: {
        name: "departmentId",
        field: "department_id"
    },
    onDelete: "RESTRICT",
    onUpdate: "CASCADE"
});

Student.belongsTo(Department, {
    as: "department",
    foreignKey: {
        name: "departmentId",
        field: "department_id"
    },
    onDelete: "RESTRICT",
    onUpdate: "CASCADE"
});

export {
    Department,
    Student
};                                                                                              