const { Model, DataTypes } = require("sequelize");

class Payment extends Model {
  static initModel(sequelize) {
    Payment.init(
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

        order_id: {
          type: DataTypes.UUID,
          allowNull: false
        },

        amount: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,

          validate: {
            min: {
              args: [0],
              msg: "Payment amount cannot be negative"
            }
          }
        },

        status: {
          type: DataTypes.ENUM(
            "PENDING",
            "SUCCESS",
            "FAILED",
            "CANCELLED",
            "REFUNDED"
          ),
          allowNull: false,
          defaultValue: "PENDING"
        },

        gateway_reference: {
          type: DataTypes.STRING(255),
          allowNull: true
        },

        razorpay_order_id: {
          type: DataTypes.STRING(255),
          allowNull: true,
          unique: true
        },

        razorpay_payment_id: {
          type: DataTypes.STRING(255),
          allowNull: true,
          unique: true
        },

        razorpay_signature: {
          type: DataTypes.STRING(500),
          allowNull: true
        }
      },

      {
        sequelize,
        modelName: "Payment",
        tableName: "payments",
        timestamps: true,
        underscored: true
      }
    );

    return Payment;
  }

  static associate(models) {
    Payment.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });

    Payment.belongsTo(models.Order, {
      foreignKey: "order_id",
      as: "order"
    });
  }
}

module.exports = Payment;