"use strict";
const departmentId = "11111111-1111-4111-8111-111111111111";
const studentId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
module.exports = {
    async up(queryInterface) {
        const now = new Date();
        await queryInterface.bulkInsert("departments", [
            { id: departmentId, name: "Engineering", code: "ENG", created_at: now, updated_at: now }
        ]);
        await queryInterface.bulkInsert("students", [
            {
                id: studentId,
                first_name: "Asha",
                last_name: "Patel",
                email: "asha@example.com",
                age: 22,
                department_id: departmentId,
                created_at: now,
                updated_at: now
            }
        ]);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("students", { id: studentId });
        await queryInterface.bulkDelete("departments", { id: departmentId });
    }
};
