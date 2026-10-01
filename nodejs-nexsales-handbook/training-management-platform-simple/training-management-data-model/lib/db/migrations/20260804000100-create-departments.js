"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("departments", {
            id: { type: Sequelize.UUID, allowNull: false, primaryKey: true },
            name: { type: Sequelize.STRING(100), allowNull: false },
            code: { type: Sequelize.STRING(20), allowNull: false, unique: true },
            created_at: { type: Sequelize.DATE, allowNull: false },
            updated_at: { type: Sequelize.DATE, allowNull: false },
            deleted_at: { type: Sequelize.DATE }
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable("departments");
    }
};
