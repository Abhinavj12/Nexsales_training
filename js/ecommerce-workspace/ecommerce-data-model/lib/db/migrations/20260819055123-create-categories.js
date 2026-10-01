"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("categories", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()")
      },

      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE"
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },

      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    await queryInterface.addIndex("categories", ["name"], {
      name: "categories_name_index"
    });

    await queryInterface.addIndex("categories", ["status"], {
      name: "categories_status_index"
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("categories");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_categories_status";'
    );
  }
};