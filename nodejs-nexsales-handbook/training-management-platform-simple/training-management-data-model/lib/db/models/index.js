const { Sequelize } = require("sequelize");
const configs = require("../../config/database");
const sequelize = new Sequelize(
    configs[process.env.NODE_ENV || "development"] || configs.development
);
const Department = require("./department").initModel(sequelize);
const Student = require("./student").initModel(sequelize);
const models = { Department, Student };
Object.values(models).forEach((model) => model.associate(models));
module.exports = { sequelize, Sequelize, ...models };
