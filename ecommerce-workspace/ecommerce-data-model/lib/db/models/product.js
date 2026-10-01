const { Model, DataTypes } = require("sequelize");

class Product extends Model {
  static initModel(sequelize) {
    Product.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },

        sku: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: {
              msg: "SKU is required"
            },

            len: {
              args: [2, 100],
              msg: "SKU must be between 2 and 100 characters"
            }
          },

          set(value) {
            this.setDataValue(
              "sku",
              value.trim().toUpperCase()
            );
          }
        },

        name: {
          type: DataTypes.STRING(200),
          allowNull: false,

          validate: {
            notEmpty: {
              msg: "Product name is required"
            },

            len: {
              args: [2, 200],
              msg: "Product name must be between 2 and 200 characters"
            }
          },

          set(value) {
            this.setDataValue("name", value.trim());
          }
        },

        description: {
          type: DataTypes.TEXT,
          allowNull: true
        },

        category_id: {
          type: DataTypes.UUID,
          allowNull: false
        },

        price: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,

          validate: {
            min: {
              args: [0],
              msg: "Price cannot be negative"
            }
          }
        },

        stock_quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,

          validate: {
            min: {
              args: [0],
              msg: "Stock quantity cannot be negative"
            },

            isInt: {
              msg: "Stock quantity must be an integer"
            }
          }
        },

        status: {
          type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
          allowNull: false,
          defaultValue: "ACTIVE"
        },

        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true
        }
      },

      {
        sequelize,
        modelName: "Product",
        tableName: "products",
        timestamps: true,
        paranoid: true,
        underscored: true
      }
    );

    return Product;
  }

  static associate(models) {
  Product.belongsTo(models.Category, {
    foreignKey: "category_id",
    as: "category"
  });

  Product.hasMany(models.CartItem, {
    foreignKey: "product_id",
    as: "cart_items"
  });
  Product.hasMany(models.OrderItem, {
  foreignKey: "product_id",
  as: "order_items"
});
  Product.hasMany(models.ProductImage, {
  foreignKey: "product_id",
  as: "images"
});
}
}

module.exports = Product;