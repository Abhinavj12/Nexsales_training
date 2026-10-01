"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("carts", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()")
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,

        references: {
          model: "users",
          key: "id"
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE"
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
      }
    });

    await queryInterface.addIndex("carts", ["user_id"], {
      name: "carts_user_id_unique",
      unique: true
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("carts");
  }
};