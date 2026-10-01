const {
  Model,
  DataTypes
} = require("sequelize");

class PaymentWebhookEvent extends Model {
  static initModel(sequelize) {
    PaymentWebhookEvent.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },

        event_id: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true
        },

        event_type: {
          type: DataTypes.STRING(100),
          allowNull: false
        },

        processed_at: {
          type: DataTypes.DATE,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName:
          "PaymentWebhookEvent",
        tableName:
          "payment_webhook_events",
        timestamps: true,
        underscored: true
      }
    );

    return PaymentWebhookEvent;
  }
}

module.exports =
  PaymentWebhookEvent;