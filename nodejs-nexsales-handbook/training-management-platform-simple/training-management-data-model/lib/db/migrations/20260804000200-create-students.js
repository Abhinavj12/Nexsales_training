"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("students", {
            id: { type: Sequelize.UUID, allowNull: false, primaryKey: true },
            first_name: { type: Sequelize.STRING(50), allowNull: false },
            last_name: { type: Sequelize.STRING(50), allowNull: false },
            email: { type: Sequelize.STRING(150), allowNull: false, unique: true },
            age: { type: Sequelize.INTEGER },
            department_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: "departments", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT"
            },
            created_at: { type: Sequelize.DATE, allowNull: false },
            updated_at: { type: Sequelize.DATE, allowNull: false },
            deleted_at: { type: Sequelize.DATE }
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable("students");
    }
};
