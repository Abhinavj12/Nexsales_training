import "dotenv/config";

import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in the .env file");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export const db = drizzle(pool);

pool.on("error", (error) => {
    console.error(
        "Unexpected PostgreSQL connection error:",
        error
    );
});

export const closeDatabaseConnection = async () => {
    await pool.end();
};