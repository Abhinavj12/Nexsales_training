import "dotenv/config";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        dialect: "postgres",
        logging: false
    }
);

export const connectDatabase = async () => {
    await sequelize.authenticate();
    console.log("Database connection established.");
};

export const synchronizeDatabase = async () => {
    await sequelize.sync({ alter: true });
    console.log("Database synchronized.");
};

export const closeDatabaseConnection = async () => {
    await sequelize.close();
    console.log("Database connection closed.");
};

export default sequelize;
