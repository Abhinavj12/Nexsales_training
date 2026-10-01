import "dotenv/config";

import app from "./app.js";

import {
    connectDatabase,
    synchronizeDatabase
} from "./config/database.js";

const port = Number(
    process.env.PORT ?? 3000
);

const startServer = async () => {
    try {
        await connectDatabase();

        await synchronizeDatabase();

        app.listen(
            port,
            () => {
                console.log(
                    `Server running at http://localhost:${port}`
                );
            }
        );
    } catch (error) {
        console.error(
            "Application failed to start:",
            error.message
        );

        process.exit(1);
    }
};

await startServer();
