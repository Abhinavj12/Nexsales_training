import "dotenv/config";
import { defineConfig } from "drizzle-kit";

console.log(
    "DATABASE_URL:",
    process.env.DATABASE_URL
);

export default defineConfig({
    schema: "./src/db/schema.js",
    out: "./drizzle",
    dialect: "postgresql",

    dbCredentials: {
        url: process.env.DATABASE_URL
    }
});