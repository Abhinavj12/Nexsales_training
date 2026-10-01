"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("products", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()")
      },

      sku: {
        type: Sequelize.STRING(100),
        allowNull: false
      },

      name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      category_id: {
        type: Sequelize.UUID,
        allowNull: false,

        references: {
          model: "categories",
          key: "id"
        },

        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },

      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },

      stock_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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

    // SKU must be unique.
    await queryInterface.addIndex("products", ["sku"], {
      name: "products_sku_unique",
      unique: true
    });

    // Product lookup/filtering.
    await queryInterface.addIndex("products", ["category_id"], {
      name: "products_category_id_index"
    });

    await queryInterface.addIndex("products", ["price"], {
      name: "products_price_index"
    });

    await queryInterface.addIndex("products", ["status"], {
      name: "products_status_index"
    });

    // Useful for category + active/inactive product filtering.
    await queryInterface.addIndex(
      "products",
      ["category_id", "status"],
      {
        name: "products_category_status_index"
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("products");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_products_status";'
    );
  }
};