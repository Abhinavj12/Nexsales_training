import "dotenv/config";

import { drizzle }
    from "drizzle-orm/node-postgres";

import { Pool }
    from "pg";

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL is not defined in the .env file"
    );
}

const pool = new Pool({
    connectionString:
        process.env.DATABASE_URL
});

pool.on("error", error => {
    console.error(
        "Unexpected PostgreSQL connection error:",
        error
    );
});

export const db = drizzle(pool);

export const closeDatabaseConnection =
    async () => {
        await pool.end();
    };