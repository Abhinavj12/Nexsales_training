"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order_items", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()")
      },

      order_id: {
        type: Sequelize.UUID,
        allowNull: false,

        references: {
          model: "orders",
          key: "id"
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },

      product_id: {
        type: Sequelize.UUID,
        allowNull: false,

        references: {
          model: "products",
          key: "id"
        },

        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      unit_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },

      line_total: {
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

    await queryInterface.addIndex("order_items", ["order_id"], {
      name: "order_items_order_id_index"
    });

    await queryInterface.addIndex(
      "order_items",
      ["product_id"],
      {
        name: "order_items_product_id_index"
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("order_items");
  }
};