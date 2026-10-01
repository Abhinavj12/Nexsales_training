const { sequelize } = require("./lib/db/models");

const testConnection = async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed");
    console.error(error.message);
  } finally {
    await sequelize.close();
  }
};

testConnection();