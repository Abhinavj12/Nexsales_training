import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 5000
});

try {
    console.log("Connecting to PostgreSQL...");

    await client.connect();

    const result = await client.query(`
        SELECT
            current_database() AS database_name,
            current_user AS user_name,
            NOW() AS connected_at
    `);

    console.log("Connection successful");
    console.log(result.rows[0]);
} catch (error) {
    console.error("Connection failed");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
} finally {
    await client.end();
}