"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cart_items", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()")
      },

      cart_id: {
        type: Sequelize.UUID,
        allowNull: false,

        references: {
          model: "carts",
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

    await queryInterface.addIndex("cart_items", ["cart_id"], {
      name: "cart_items_cart_id_index"
    });

    await queryInterface.addIndex("cart_items", ["product_id"], {
      name: "cart_items_product_id_index"
    });

    await queryInterface.addIndex(
      "cart_items",
      ["cart_id", "product_id"],
      {
        name: "cart_items_cart_product_unique",
        unique: true
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("cart_items");
  }
};