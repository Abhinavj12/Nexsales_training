"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("product_images", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()")
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

      image_url: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      cloudinary_public_id: {
        type: Sequelize.STRING(500),
        allowNull: true
      },

      is_primary: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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
      },

      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    await queryInterface.addIndex(
      "product_images",
      ["product_id"],
      {
        name: "product_images_product_id_index"
      }
    );

    await queryInterface.addIndex(
      "product_images",
      ["product_id", "is_primary"],
      {
        name: "product_images_product_primary_index"
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable(
      "product_images"
    );
  }
};