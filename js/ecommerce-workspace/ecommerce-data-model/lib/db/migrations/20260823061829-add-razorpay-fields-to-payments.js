"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "payments",
      "razorpay_order_id",
      {
        type: Sequelize.STRING(255),
        allowNull: true
      }
    );

    await queryInterface.addColumn(
      "payments",
      "razorpay_payment_id",
      {
        type: Sequelize.STRING(255),
        allowNull: true
      }
    );

    await queryInterface.addColumn(
      "payments",
      "razorpay_signature",
      {
        type: Sequelize.STRING(500),
        allowNull: true
      }
    );

    await queryInterface.addIndex(
      "payments",
      ["razorpay_order_id"],
      {
        name: "payments_razorpay_order_id_index",
        unique: true
      }
    );

    await queryInterface.addIndex(
      "payments",
      ["razorpay_payment_id"],
      {
        name: "payments_razorpay_payment_id_index",
        unique: true
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      "payments",
      "payments_razorpay_payment_id_index"
    );

    await queryInterface.removeIndex(
      "payments",
      "payments_razorpay_order_id_index"
    );

    await queryInterface.removeColumn(
      "payments",
      "razorpay_signature"
    );

    await queryInterface.removeColumn(
      "payments",
      "razorpay_payment_id"
    );

    await queryInterface.removeColumn(
      "payments",
      "razorpay_order_id"
    );
  }
};