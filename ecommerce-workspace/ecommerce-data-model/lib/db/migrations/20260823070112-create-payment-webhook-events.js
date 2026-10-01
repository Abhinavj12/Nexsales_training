"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "payment_webhook_events",
      {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue:
            Sequelize.literal("gen_random_uuid()")
        },

        event_id: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },

        event_type: {
          type: Sequelize.STRING(100),
          allowNull: false
        },

        processed_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue:
            Sequelize.literal("CURRENT_TIMESTAMP")
        },

        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue:
            Sequelize.literal("CURRENT_TIMESTAMP")
        },

        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue:
            Sequelize.literal("CURRENT_TIMESTAMP")
        }
      }
    );

    await queryInterface.addIndex(
      "payment_webhook_events",
      ["event_id"],
      {
        name:
          "payment_webhook_events_event_id_unique",
        unique: true
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable(
      "payment_webhook_events"
    );
  }
};