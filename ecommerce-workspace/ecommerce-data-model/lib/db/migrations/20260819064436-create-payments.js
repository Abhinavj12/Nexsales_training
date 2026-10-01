"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payments", {
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
        onDelete: "RESTRICT"
      },

      order_id: {
        type: Sequelize.UUID,
        allowNull: false,

        references: {
          model: "orders",
          key: "id"
        },

        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },

      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM(
          "PENDING",
          "SUCCESS",
          "FAILED",
          "CANCELLED",
          "REFUNDED"
        ),
        allowNull: false,
        defaultValue: "PENDING"
      },

      gateway_reference: {
        type: Sequelize.STRING(255),
        allowNull: true
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

    await queryInterface.addIndex("payments", ["user_id"], {
      name: "payments_user_id_index"
    });

    await queryInterface.addIndex("payments", ["order_id"], {
      name: "payments_order_id_index"
    });

    await queryInterface.addIndex("payments", ["status"], {
      name: "payments_status_index"
    });

    await queryInterface.addIndex(
      "payments",
      ["gateway_reference"],
      {
        name: "payments_gateway_reference_index"
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("payments");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_payments_status";'
    );
  }
};