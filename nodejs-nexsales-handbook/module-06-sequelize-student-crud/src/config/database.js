import "dotenv/config";

import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,

        port: Number(
            process.env.DB_PORT ?? 5432
        ),

        dialect: "postgres",

        logging:
            process.env.SQL_LOGGING === "true"
                ? console.log
                : false
    }
);

export const connectDatabase = async () => {
    await sequelize.authenticate();

    console.log(
        "PostgreSQL connection established successfully"
    );
};

export const synchronizeDatabase = async () => {
    await sequelize.sync();

    console.log(
        "Database tables synchronized successfully"
    );
};

export default sequelize;
