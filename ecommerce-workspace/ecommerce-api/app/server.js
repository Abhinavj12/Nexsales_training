const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const { sequelize } = require("@ecommerce/ecommerce-data-model");
const app = require("./app");

const PORT = Number(process.env.PORT || 3000);

const start = async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connection successful");

    app.listen(PORT, () => {
      console.log(
        `Ecommerce API listening on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Unable to start Ecommerce API");
    console.error(error);

    process.exit(1);
  }
};

start();