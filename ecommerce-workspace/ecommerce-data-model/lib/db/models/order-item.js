const { Model, DataTypes } = require("sequelize");

class OrderItem extends Model {
  static initModel(sequelize) {
    OrderItem.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },

        order_id: {
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
        },

        unit_price: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false
        },

        line_total: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: "OrderItem",
        tableName: "order_items",
        timestamps: true,
        underscored: true
      }
    );

    return OrderItem;
  }

  static associate(models) {
    OrderItem.belongsTo(models.Order, {
      foreignKey: "order_id",
      as: "order"
    });

    OrderItem.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product"
    });
  }
}

module.exports = OrderItem;