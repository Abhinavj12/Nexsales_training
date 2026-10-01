"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
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

      status: {
        type: Sequelize.ENUM(
          "PENDING",
          "CONFIRMED",
          "PROCESSING",
          "SHIPPED",
          "DELIVERED",
          "CANCELLED"
        ),
        allowNull: false,
        defaultValue: "PENDING"
      },

      total_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
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

    await queryInterface.addIndex("orders", ["user_id"], {
      name: "orders_user_id_index"
    });

    await queryInterface.addIndex("orders", ["status"], {
      name: "orders_status_index"
    });

    await queryInterface.addIndex(
      "orders",
      ["user_id", "created_at"],
      {
        name: "orders_user_created_at_index"
      }
    );

    await queryInterface.addIndex(
      "orders",
      ["user_id", "status"],
      {
        name: "orders_user_status_index"
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("orders");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_orders_status";'
    );
  }
};