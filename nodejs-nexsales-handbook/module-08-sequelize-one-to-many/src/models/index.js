import Department from "./department.model.js";
import Student from "./student.model.js";

let relationshipsLoaded = false;

export const loadRelationships = () => {
    if (relationshipsLoaded) {
        return;
    }

    // hasMany means one department can be referenced by many student rows.
    // The "students" alias makes an array available when a department is included.
    Department.hasMany(Student, {
        as: "students",
        foreignKey: {
            name: "departmentId",
            field: "department_id",
            allowNull: false
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
    });

    // belongsTo places the foreign key on Student and returns one department object.
    // RESTRICT prevents a department from being removed while students still use it.
    Student.belongsTo(Department, {
        as: "department",
        foreignKey: {
            name: "departmentId",
            field: "department_id",
            allowNull: false
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
    });

    relationshipsLoaded = true;
};

export { Department, Student };
