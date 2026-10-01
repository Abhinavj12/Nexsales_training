const { Sequelize } = require("sequelize");
const EmailVerificationToken = require(
  "./email-verification-token"
);
const PasswordResetToken =
  require("./password-reset-token")

const configs = require("../../config/database");

const environment = process.env.NODE_ENV || "development";

const sequelize = new Sequelize(
  configs[environment] || configs.development
);
const User=require("./user").initModel(sequelize);
const Category = require("./category").initModel(sequelize);
const Product = require("./product").initModel(sequelize);
const Cart = require("./cart").initModel(sequelize);
const CartItem = require("./cart-item").initModel(sequelize);
const Order = require("./order").initModel(sequelize);
const OrderItem = require("./order-item").initModel(sequelize);
const Payment = require("./payment").initModel(sequelize);
EmailVerificationToken.initModel(sequelize);
PasswordResetToken.initModel(sequelize);
const ProductImage =
  require("./product-image").initModel(sequelize);
const PaymentWebhookEvent =
  require("./payment-webhook-event")
    .initModel(sequelize);

const models = {
    User,
    Category,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Payment,
    EmailVerificationToken,
    PasswordResetToken,
    ProductImage,
    PaymentWebhookEvent
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  ...models
};