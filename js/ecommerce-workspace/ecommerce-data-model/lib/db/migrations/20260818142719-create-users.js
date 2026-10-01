"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()")
      },

      first_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },

      last_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },

      email: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      password_hash: {
        type: Sequelize.STRING,
        allowNull: false
      },

      role: {
        type: Sequelize.ENUM("USER", "ADMIN"),
        allowNull: false,
        defaultValue: "USER"
      },

      is_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      is_blocked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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

    await queryInterface.addIndex("users", ["email"], {
      name: "users_email_unique",
      unique: true
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("users");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_role";'
    );
  }
};