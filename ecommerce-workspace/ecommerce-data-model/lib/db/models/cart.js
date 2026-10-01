const { Model, DataTypes } = require("sequelize");

class Cart extends Model {
  static initModel(sequelize) {
    Cart.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },

        user_id: {
          type: DataTypes.UUID,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: "Cart",
        tableName: "carts",
        timestamps: true,
        underscored: true
      }
    );

    return Cart;
  }

  static associate(models) {
    Cart.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });

    Cart.hasMany(models.CartItem, {
      foreignKey: "cart_id",
      as: "items"
    });
  }
}

module.exports = Cart;