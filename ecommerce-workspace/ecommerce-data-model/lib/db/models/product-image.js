const { Model, DataTypes } = require("sequelize");

class ProductImage extends Model {
  static initModel(sequelize) {
    ProductImage.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },

        product_id: {
          type: DataTypes.UUID,
          allowNull: false
        },

        image_url: {
          type: DataTypes.TEXT,
          allowNull: false
        },

        cloudinary_public_id: {
          type: DataTypes.STRING(500),
          allowNull: true
        },

        is_primary: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },

        sort_order: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },

        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: "ProductImage",
        tableName: "product_images",
        timestamps: true,
        paranoid: true,
        underscored: true
      }
    );

    return ProductImage;
  }

  static associate(models) {
    ProductImage.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product"
    });
  }
}

module.exports = ProductImage;