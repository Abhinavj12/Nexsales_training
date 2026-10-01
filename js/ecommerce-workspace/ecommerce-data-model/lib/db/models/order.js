const { Model, DataTypes } = require("sequelize");

class Order extends Model {
  static initModel(sequelize) {
    Order.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },

        user_id: {
          type: DataTypes.UUID,
          allowNull: false
        },

        status: {
          type: DataTypes.ENUM(
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
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: "Order",
        tableName: "orders",
        timestamps: true,
        underscored: true
      }
    );

    return Order;
  }

  static associate(models) {
    Order.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });

    Order.hasMany(models.OrderItem, {
      foreignKey: "order_id",
      as: "items"
    });

    Order.hasMany(models.Payment, {
      foreignKey: "order_id",
      as: "payments"
    });
  }
}

module.exports = Order;