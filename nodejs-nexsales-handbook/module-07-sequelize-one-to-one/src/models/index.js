import Student from "./student.model.js";
import StudentProfile from "./student-profile.model.js";

Student.hasOne(
    StudentProfile,
    {
        foreignKey: {
            name: "studentId",
            field: "student_id",
            allowNull: false
        },

        as: "profile",

        onDelete: "CASCADE",

        onUpdate: "CASCADE"
    }
);

StudentProfile.belongsTo(
    Student,
    {
        foreignKey: {
            name: "studentId",
            field: "student_id",
            allowNull: false
        },

        as: "student",

        // onDelete: "CASCADE",

        onUpdate: "CASCADE"
    }
);

export {
    Student,
    StudentProfile
};
