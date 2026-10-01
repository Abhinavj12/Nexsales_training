const { Model, DataTypes } = require("sequelize");

class CartItem extends Model {
  static initModel(sequelize) {
    CartItem.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },

        cart_id: {
          type: DataTypes.UUID,
          allowNull: false
        },

        product_id: {
          type: DataTypes.UUID,
          allowNull: false
        },

        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,

          validate: {
            isInt: {
              msg: "Quantity must be an integer"
            },

            min: {
              args: [1],
              msg: "Quantity must be at least 1"
            }
          }
        }
      },
      {
        sequelize,
        modelName: "CartItem",
        tableName: "cart_items",
        timestamps: true,
        underscored: true
      }
    );

    return CartItem;
  }

  static associate(models) {
    CartItem.belongsTo(models.Cart, {
      foreignKey: "cart_id",
      as: "cart"
    });

    CartItem.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product"
    });
  }
}

module.exports = CartItem;