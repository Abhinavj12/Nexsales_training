"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "password_reset_tokens",
      {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.literal(
            "gen_random_uuid()"
          )
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

        token_hash: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },

        expires_at: {
          type: Sequelize.DATE,
          allowNull: false
        },

        used_at: {
          type: Sequelize.DATE,
          allowNull: true
        },

        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP"
          )
        },

        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP"
          )
        }
      }
    );

    await queryInterface.addIndex(
      "password_reset_tokens",
      ["user_id"],
      {
        name: "password_reset_tokens_user_id_idx"
      }
    );

    await queryInterface.addIndex(
      "password_reset_tokens",
      ["token_hash"],
      {
        name: "password_reset_tokens_token_hash_unique",
        unique: true
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable(
      "password_reset_tokens"
    );
  }
};